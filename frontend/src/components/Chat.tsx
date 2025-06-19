import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Divider,
  Badge,
  InputAdornment,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import {
  Send as SendIcon,
  Search as SearchIcon,
  Message as MessageIcon,
  ArrowBack as ArrowBackIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { chatService, ChatListItem, Message } from '../services/chatService';
import { webSocketService } from '../services/websocketService';
import { getProfilePictureSrc, userService } from '../services/api';

interface ChatProps {
  currentUserId: string;
  currentUsername: string;
}

const MessageBubble = React.memo(({ 
  message, 
  isOwnMessage, 
  formatMessageTime, 
  theme 
}: { 
  message: Message; 
  isOwnMessage: boolean; 
  formatMessageTime: (timestamp: string) => string;
  theme: any;
}) => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
      mb: 2,
      position: 'relative',
      zIndex: 1
    }}
  >
    <Paper
      sx={{
        p: 2,
        maxWidth: '75%',
        borderRadius: 4,
        background: isOwnMessage 
          ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${alpha(theme.palette.primary.main, 0.8)})`
          : theme.palette.mode === 'dark'
            ? 'rgba(25, 39, 52, 0.8)'
            : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        border: isOwnMessage
          ? 'none'
          : `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        color: isOwnMessage ? '#ffffff' : 'text.primary',
        boxShadow: isOwnMessage
          ? `0 8px 32px ${alpha(theme.palette.primary.main, 0.3)}`
          : `0 4px 20px ${alpha(theme.palette.primary.main, 0.1)}`,
        position: 'relative',
        transform: 'translateY(0)',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: isOwnMessage
            ? `0 12px 40px ${alpha(theme.palette.primary.main, 0.4)}`
            : `0 8px 30px ${alpha(theme.palette.primary.main, 0.2)}`
        }
      }}
    >
      <Typography variant="body1" sx={{ 
        wordBreak: 'break-word',
        lineHeight: 1.5
      }}>
        {message.content}
      </Typography>
      <Typography 
        variant="caption" 
        sx={{ 
          display: 'block', 
          textAlign: 'right', 
          mt: 1,
          opacity: 0.8,
          fontSize: '0.75rem'
        }}
      >
        {formatMessageTime(message.timestamp)}
      </Typography>
    </Paper>
  </Box>
));

const Chat: React.FC<ChatProps> = ({ currentUserId, currentUsername }) => {
  const theme = useTheme();
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatListItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [messageCache, setMessageCache] = useState<Map<string, Message[]>>(new Map());
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 50 });
  const [containerHeight, setContainerHeight] = useState(600);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [otherUserData, setOtherUserData] = useState<any>(null);
  const [userDataCache, setUserDataCache] = useState<Map<string, any>>(new Map());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const currentMessagesRef = useRef<Message[]>([]);
  const intersectionObserver = useRef<IntersectionObserver | null>(null);
  const pendingRequests = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (currentUserId) {
      const connectWebSocket = async () => {
        try {
          const isBackendHealthy = await webSocketService.checkBackendHealth();
          if (!isBackendHealthy) {
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
          
          await webSocketService.connect(currentUserId, handleNewMessage);
        } catch (error) {
          setTimeout(async () => {
            try {
              await webSocketService.forceReconnect(currentUserId, handleNewMessage);
            } catch (retryError) {
            }
          }, 5000);
        }
      };

      connectWebSocket();

      return () => {
        webSocketService.disconnect();
      };
    }
  }, [currentUserId]);

  const handleNewMessage = (message: Message) => {
    setChats(prev => {
      const updatedChats = prev.map(chat => 
        chat.id === message.chatId 
          ? { 
              ...chat, 
              lastMessage: message,
              lastMessageTime: message.timestamp,
              unreadCount: (message.senderId !== currentUserId && message.senderUsername !== currentUsername && selectedChat?.id !== message.chatId) ? chat.unreadCount + 1 : chat.unreadCount
            }
          : chat
      );
      return updatedChats;
    });
    
    const currentMessages = currentMessagesRef.current;
    const shouldAddToCurrentView = currentMessages.length > 0 && currentMessages[0]?.chatId === message.chatId;
    
    if (shouldAddToCurrentView) {
      const isOwnMessage = message.senderId === currentUserId || message.senderUsername === currentUsername;
      
      if (isOwnMessage) {
        return; 
      }
      
      setMessages(prev => {
        const existingMessage = prev.find(m => m.id === message.id);
        if (existingMessage) {
          return prev;
        }
        
        const newMessages = [...prev, message];
        if (selectedChat) {
          setMessageCache(cache => new Map(cache.set(selectedChat.id, newMessages)));
        }
        return newMessages;
      });

      if (isAtBottom) {
        setAutoScroll(true);
        setTimeout(() => {
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
          }
        }, 100);
      }
    }
  };

  useEffect(() => {
    currentMessagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0 && autoScroll && isAtBottom) {
      const start = Math.max(0, messages.length - 50);
      setVisibleRange({ start, end: messages.length });
      
      requestAnimationFrame(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      });
    }
  }, [messages.length, autoScroll, isAtBottom]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      setContainerHeight(container.clientHeight);
    }
  }, [selectedChat]);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    if (loading) {
      return;
    }
    
    try {
      setLoading(true);
      const chatsData = await chatService.getUserChats();
      setChats(chatsData);
      
      const userDataPromises = chatsData.map(async (chat) => {
        try {
          const userData = await userService.getUserById(chat.otherUser.id);
          return { userId: chat.otherUser.id, userData };
        } catch (error) {
          return { userId: chat.otherUser.id, userData: null };
        }
      });
      
      const userDataResults = await Promise.all(userDataPromises);
      const newUserDataCache = new Map();
      userDataResults.forEach(({ userId, userData }) => {
        if (userData) {
          newUserDataCache.set(userId, userData);
        }
      });
      setUserDataCache(newUserDataCache);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = useCallback(async (chatId: string, pageNumber: number = 0, append: boolean = false) => {
    const requestKey = `${chatId}-${pageNumber}`;
    
    if (pendingRequests.current.has(requestKey)) {
      return;
    }
    
    if (messagesLoading && !append) {
      return;
    }
    
    if (append && loadingMore) {
      return;
    }
    
    const cachedMessages = messageCache.get(chatId);
    if (cachedMessages && !append && pageNumber === 0) {
      setMessages(cachedMessages);
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
        }
      }, 10);
      return;
    }
    
    pendingRequests.current.add(requestKey);
    
    if (append) {
      setLoadingMore(true);
    } else {
      setMessagesLoading(true);
    }
    
    try {
      const chatMessages = await chatService.getChatMessages(chatId, pageNumber, 20);
      const newMessages = chatMessages.content.reverse();
      
      console.log(`Loading page ${pageNumber}, got ${newMessages.length} messages, last: ${chatMessages.last}`);
      
      if (append) {
        const container = messagesContainerRef.current;
        const currentScrollHeight = container?.scrollHeight || 0;
        
        setMessages(prev => {
          const existingIds = new Set(prev.map(m => m.id));
          const uniqueNewMessages = newMessages.filter(m => !existingIds.has(m.id));
          
          if (uniqueNewMessages.length === 0) {
            console.log('No new unique messages found');
            return prev;
          }
          
          const updated = [...uniqueNewMessages, ...prev];
          setMessageCache(cache => new Map(cache.set(chatId, updated)));
          
          setTimeout(() => {
            if (container) {
              const newScrollHeight = container.scrollHeight;
              const heightDifference = newScrollHeight - currentScrollHeight;
              container.scrollTop = heightDifference + 100;
            }
          }, 50);
          
          return updated;
        });
        setHasMoreMessages(!chatMessages.last && newMessages.length > 0);
      } else {
        setMessages(newMessages);
        setMessageCache(cache => new Map(cache.set(chatId, newMessages)));
        setHasMoreMessages(!chatMessages.last && newMessages.length === 20);
        setPage(0);
        
        setIsAtBottom(true);
        setAutoScroll(true);
        setTimeout(() => {
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
          }
        }, 100);
      }
      
      if (!append) {
        chatService.markAsRead(chatId).catch(() => {});
        
        setChats(prev => prev.map(chat => 
          chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
        ));
      }
          } catch (error: any) {
      console.error('Failed to load messages:', error);
      if (!append) {
        const fallbackData = await chatService.getChatMessages(chatId, 0, 50);
        const fallbackMessages = fallbackData.content.reverse();
        setMessages(fallbackMessages);
        setMessageCache(cache => new Map(cache.set(chatId, fallbackMessages)));
        setIsAtBottom(true);
        setAutoScroll(true);
        setTimeout(() => {
          if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
          }
        }, 100);
      }
    } finally {
      pendingRequests.current.delete(requestKey);
      if (append) {
        setLoadingMore(false);
      } else {
        setMessagesLoading(false);
      }
    }
  }, [messagesLoading, loadingMore, messageCache, setChats]);



  const handleChatSelect = useCallback(async (chat: ChatListItem) => {
    setSelectedChat(chat);
    setMessages([]);
    setPage(0);
    setHasMoreMessages(true);
    setIsAtBottom(true);
    setAutoScroll(true);
    setVisibleRange({ start: 0, end: 50 });
    loadMessages(chat.id, 0, false);
    
    if (chat.unreadCount > 0) {
      try {
        await chatService.markAsRead(chat.id);
        setChats(prev => prev.map(c => 
          c.id === chat.id ? { ...c, unreadCount: 0 } : c
        ));
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }
    
    const cachedUserData = userDataCache.get(chat.otherUser.id);
    if (cachedUserData) {
      setOtherUserData(cachedUserData);
    } else {
      try {
        const userData = await userService.getUserById(chat.otherUser.id);
        setOtherUserData(userData);
        setUserDataCache(prev => new Map(prev.set(chat.otherUser.id, userData)));
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    }
  }, [loadMessages, userDataCache]);

  const loadMoreMessages = useCallback(() => {
    if (selectedChat && hasMoreMessages && !loadingMore) {
      const container = messagesContainerRef.current;
      if (container) {
        const nextPage = page + 1;
        console.log(`Loading more messages - current page: ${page}, next page: ${nextPage}, total messages: ${messages.length}`);
        setPage(nextPage);
        
        loadMessages(selectedChat.id, nextPage, true);
      }
    }
  }, [selectedChat, hasMoreMessages, loadingMore, page, loadMessages, messages.length]);

  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  const debouncedSearch = useCallback(
    debounce((searchValue: string) => {
      setSearchTerm(searchValue);
    }, 300),
    [debounce]
  );

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const { scrollTop, scrollHeight, clientHeight } = container;
    
    const isAtBottomNow = scrollTop + clientHeight >= scrollHeight - 50;
    setIsAtBottom(isAtBottomNow);
    
    if (scrollTop < 200 && hasMoreMessages && !loadingMore) {
      loadMoreMessages();
      return;
    }
    
    const itemHeight = 80;
    const buffer = 15;
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
    const end = Math.min(messages.length, Math.ceil((scrollTop + clientHeight) / itemHeight) + buffer);
    
    setVisibleRange({ start, end });
  }, [hasMoreMessages, loadingMore, loadMoreMessages, messages.length]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const message = await chatService.sendMessage(selectedChat.id, newMessage.trim());
      
      setMessages(prev => {
        const updated = [...prev, message];
        setMessageCache(cache => new Map(cache.set(selectedChat.id, updated)));
        return updated;
      });
      setNewMessage('');
      setAutoScroll(true);
      setIsAtBottom(true);
      
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 100);

      setChats(prev => prev.map(chat => 
        chat.id === selectedChat.id 
          ? { 
              ...chat, 
              lastMessage: message,
              lastMessageTime: message.timestamp
            }
          : chat
      ));
    } catch (error: any) {
      alert(`Failed to send message: ${error.response?.data || error.message || 'Unknown error'}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredChats = useMemo(() => 
    chats.filter(chat =>
      chat.otherUser.username.toLowerCase().includes(searchTerm.toLowerCase())
    ), [chats, searchTerm]);

  const visibleMessages = useMemo(() => {
    if (messages.length === 0) return [];
    if (loadingMore || messages.length <= 100) {
      return messages;
    }
    return messages.slice(visibleRange.start, visibleRange.end);
  }, [messages, visibleRange, loadingMore]);

  const totalHeight = useMemo(() => {
    if (loadingMore || messages.length <= 100) {
      return 'auto';
    }
    return messages.length * 80;
  }, [messages.length, loadingMore]);

  const offsetY = useMemo(() => {
    if (loadingMore || messages.length <= 100) {
      return 0;
    }
    return visibleRange.start * 80;
  }, [visibleRange.start, loadingMore, messages.length]);

  const formatMessageTime = useCallback((timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm');
  }, []);

  const formatChatTime = useCallback((timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 3600);
    
    if (diffInHours < 24) {
      return format(date, 'HH:mm');
    } else {
      return format(date, 'dd/MM');
    }
  }, []);

  const glassStyle = {
    background: theme.palette.mode === 'dark'
      ? 'rgba(25, 39, 52, 0.7)'
      : 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    boxShadow: theme.palette.mode === 'dark'
      ? '0 8px 32px rgba(0, 0, 0, 0.3)'
      : '0 8px 32px rgba(0, 0, 0, 0.1)',
  };

  const chatGlassStyle = {
    background: theme.palette.mode === 'dark'
      ? 'rgba(21, 32, 43, 0.8)'
      : 'rgba(248, 250, 252, 0.8)',
    backdropFilter: 'blur(20px)',
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      height: '100vh',
      background: theme.palette.mode === 'dark' 
        ? 'linear-gradient(135deg, #0f1419 0%, #15202b 50%, #192734 100%)'
        : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: theme.palette.mode === 'dark'
          ? 'radial-gradient(circle at 20% 50%, rgba(29, 161, 242, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%)'
          : 'radial-gradient(circle at 20% 50%, rgba(29, 161, 242, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(120, 119, 198, 0.05) 0%, transparent 50%)',
        pointerEvents: 'none'
      }
    }}>
      <Box 
        sx={{ 
          width: selectedChat ? { xs: '0px', md: '400px' } : '100%',
          maxWidth: '400px',
          display: selectedChat ? { xs: 'none', md: 'block' } : 'block',
          height: '100%',
          zIndex: 1,
          position: 'relative'
        }}
      >
        <Paper
          sx={{
            ...glassStyle,
            borderRadius: 0,
            height: '100%',
            overflow: 'hidden',
            position: 'relative'
          }}
        >
          <Box sx={{ 
            p: 3, 
            borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            background: theme.palette.mode === 'dark'
              ? 'rgba(25, 39, 52, 0.9)'
              : 'rgba(255, 255, 255, 0.9)',
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <MessageIcon sx={{ 
                mr: 2, 
                color: 'primary.main',
                fontSize: 28,
                filter: 'drop-shadow(0 2px 4px rgba(29, 161, 242, 0.3))'
              }} />
              <Typography variant="h5" sx={{ 
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main || '#7877c6'})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Messages
              </Typography>
            </Box>
            <TextField
              fullWidth
              size="small"
              placeholder="Search conversations..."
              onChange={(e) => debouncedSearch(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(25, 39, 52, 0.8)'
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
                    transform: 'translateY(-1px)',
                    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.15)}`
                  },
                  '&.Mui-focused': {
                    border: `2px solid ${theme.palette.primary.main}`,
                    transform: 'translateY(-1px)',
                    boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.25)}`
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: alpha(theme.palette.primary.main, 0.7) }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ height: 'calc(100% - 140px)', overflow: 'auto' }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress sx={{ color: 'primary.main' }} />
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {filteredChats.map((chat, index) => (
                  <React.Fragment key={chat.id}>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => handleChatSelect(chat)}
                        sx={{
                          p: 2,
                          background: selectedChat?.id === chat.id 
                            ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.15)}, ${alpha(theme.palette.primary.main, 0.1)})`
                            : 'transparent',
                          backdropFilter: selectedChat?.id === chat.id ? 'blur(10px)' : 'none',
                          border: selectedChat?.id === chat.id 
                            ? `1px solid ${alpha(theme.palette.primary.main, 0.3)}`
                            : '1px solid transparent',
                          margin: selectedChat?.id === chat.id ? '4px 8px' : '0',
                          borderRadius: selectedChat?.id === chat.id ? 3 : 0,
                          transition: 'all 0.3s ease',
                          '&:hover': { 
                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.main, 0.05)})`,
                            backdropFilter: 'blur(10px)',
                            transform: 'translateX(4px)',
                            margin: '4px 8px',
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                          }
                        }}
                      >
                        <ListItemAvatar>
                          <Badge 
                            badgeContent={chat.unreadCount} 
                            color="primary"
                            sx={{
                              '& .MuiBadge-badge': {
                                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main || '#7877c6'})`,
                                boxShadow: `0 2px 8px ${alpha(theme.palette.primary.main, 0.4)}`,
                                border: `2px solid ${theme.palette.background.paper}`
                              }
                            }}
                          >
                            <Avatar 
                              src={(() => {
                                const cachedUser = userDataCache.get(chat.otherUser.id);
                                if (cachedUser?.profilePicture?.data) {
                                  return `data:${cachedUser.profilePicture.type};base64,${cachedUser.profilePicture.data}`;
                                }
                                return chat.otherUser.profilePicture ? `http://localhost:8081${chat.otherUser.profilePicture}` : undefined;
                              })()}
                              sx={{
                                width: 50,
                                height: 50,
                                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
                              }}
                            >
                              {chat.otherUser.username.charAt(0).toUpperCase()}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1" noWrap sx={{ 
                                flex: 1, 
                                fontWeight: 600,
                                color: 'text.primary'
                              }}>
                                {chat.otherUser.username}
                              </Typography>
                              <Typography variant="caption" sx={{ 
                                color: 'text.secondary',
                                background: alpha(theme.palette.primary.main, 0.1),
                                px: 1,
                                py: 0.3,
                                borderRadius: 2,
                                fontSize: '0.7rem'
                              }}>
                                {formatChatTime(chat.lastMessageTime)}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Typography variant="body2" color="text.secondary" noWrap sx={{ 
                              mt: 0.5,
                              opacity: 0.8
                            }}>
                              {chat.lastMessage?.content || 'No messages yet'}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                    {index < filteredChats.length - 1 && (
                      <Divider sx={{ 
                        mx: 2, 
                        opacity: 0.3,
                        background: `linear-gradient(90deg, transparent, ${alpha(theme.palette.primary.main, 0.3)}, transparent)`
                      }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        </Paper>
      </Box>

      {selectedChat ? (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', zIndex: 1, position: 'relative' }}>
          <Paper 
            sx={{ 
              ...glassStyle,
              p: 3, 
              borderRadius: 0, 
              borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              display: 'flex',
              alignItems: 'center',
              background: theme.palette.mode === 'dark'
                ? 'rgba(25, 39, 52, 0.9)'
                : 'rgba(255, 255, 255, 0.9)',
            }}
          >
            <IconButton 
              sx={{ 
                display: { xs: 'block', md: 'none' }, 
                mr: 2,
                background: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.2),
                  transform: 'scale(1.1)'
                }
              }}
              onClick={() => setSelectedChat(null)}
            >
              <ArrowBackIcon sx={{ color: 'primary.main' }} />
            </IconButton>
            <Avatar 
              src={otherUserData?.profilePicture?.data 
                ? `data:${otherUserData.profilePicture.type};base64,${otherUserData.profilePicture.data}`
                : selectedChat.otherUser.profilePicture 
                  ? `http://localhost:8081${selectedChat.otherUser.profilePicture}` 
                  : undefined}
              sx={{ 
                mr: 3, 
                width: 50, 
                height: 50,
                border: `3px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
              }}
            >
              {selectedChat.otherUser.username.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 700,
                background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${alpha(theme.palette.primary.main, 0.8)})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {selectedChat.otherUser.username}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: 'text.secondary',
                opacity: 0.7
              }}>
                Online
              </Typography>
            </Box>
            <IconButton sx={{
              background: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                background: alpha(theme.palette.primary.main, 0.2),
                transform: 'scale(1.1)'
              }
            }}>
              <MoreVertIcon sx={{ color: 'primary.main' }} />
            </IconButton>
          </Paper>

          <Box 
            ref={messagesContainerRef}
            onScroll={handleScroll}
            sx={{ 
              flex: 1, 
              overflow: 'auto', 
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              background: theme.palette.mode === 'dark'
                ? 'rgba(15, 20, 25, 0.3)'
                : 'rgba(248, 250, 252, 0.3)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: theme.palette.mode === 'dark'
                  ? 'radial-gradient(circle at 50% 50%, rgba(29, 161, 242, 0.05) 0%, transparent 70%)'
                  : 'radial-gradient(circle at 50% 50%, rgba(29, 161, 242, 0.03) 0%, transparent 70%)',
                pointerEvents: 'none'
              }
            }}
          >
            {loadingMore && (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
                <CircularProgress size={20} sx={{ color: 'primary.main' }} />
              </Box>
            )}
            {messagesLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress sx={{ color: 'primary.main' }} />
              </Box>
            ) : (
              totalHeight === 'auto' ? (
                visibleMessages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isOwnMessage={message.senderId === currentUserId}
                    formatMessageTime={formatMessageTime}
                    theme={theme}
                  />
                ))
              ) : (
                <Box sx={{ 
                  height: totalHeight,
                  position: 'relative'
                }}>
                  <Box sx={{
                    transform: `translateY(${offsetY}px)`,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0
                  }}>
                    {visibleMessages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isOwnMessage={message.senderId === currentUserId}
                        formatMessageTime={formatMessageTime}
                        theme={theme}
                      />
                    ))}
                  </Box>
                </Box>
              )
            )}
            <div ref={messagesEndRef} style={{ height: 1 }} />
          </Box>

          <Box sx={{ 
            p: 3, 
            borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            ...glassStyle,
            borderRadius: 0
          }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(25, 39, 52, 0.8)'
                    : 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.4)}`,
                    transform: 'translateY(-1px)',
                    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`
                  },
                  '&.Mui-focused': {
                    border: `2px solid ${theme.palette.primary.main}`,
                    transform: 'translateY(-1px)',
                    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.25)}`
                  }
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      sx={{
                        background: newMessage.trim() 
                          ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main || '#7877c6'})`
                          : alpha(theme.palette.action.disabled, 0.1),
                        color: newMessage.trim() ? '#ffffff' : 'action.disabled',
                        borderRadius: '50%',
                        width: 45,
                        height: 45,
                        transition: 'all 0.3s ease',
                        boxShadow: newMessage.trim() 
                          ? `0 4px 20px ${alpha(theme.palette.primary.main, 0.4)}`
                          : 'none',
                        '&:hover': {
                          transform: newMessage.trim() ? 'scale(1.1) rotate(15deg)' : 'none',
                          boxShadow: newMessage.trim() 
                            ? `0 6px 25px ${alpha(theme.palette.primary.main, 0.5)}`
                            : 'none'
                        },
                        '&:disabled': {
                          background: alpha(theme.palette.action.disabled, 0.1),
                          color: 'action.disabled'
                        }
                      }}
                    >
                      <SendIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      ) : (
        <Box 
          sx={{ 
            flex: 1, 
            display: { xs: 'none', md: 'flex' }, 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            position: 'relative',
            zIndex: 1
          }}
        >
          <Paper sx={{
            ...chatGlassStyle,
            p: 6,
            borderRadius: 4,
            textAlign: 'center',
            maxWidth: 400
          }}>
            <MessageIcon sx={{ 
              fontSize: 80, 
              color: alpha(theme.palette.primary.main, 0.6), 
              mb: 3,
              filter: 'drop-shadow(0 4px 8px rgba(29, 161, 242, 0.3))'
            }} />
            <Typography variant="h5" sx={{ 
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${alpha(theme.palette.primary.main, 0.8)})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}>
              Start a Conversation
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ opacity: 0.8 }}>
              Select a conversation from the sidebar to begin messaging
            </Typography>
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default Chat; 