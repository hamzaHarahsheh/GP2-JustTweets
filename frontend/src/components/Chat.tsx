import React, { useState, useEffect, useRef } from 'react';
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
  useTheme
} from '@mui/material';
import {
  Send as SendIcon,
  Search as SearchIcon,
  Message as MessageIcon,
  ArrowBack as ArrowBackIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { chatService, ChatListItem, Message } from '../services/chatService';
import { webSocketService } from '../services/websocketService';
import { getProfilePictureSrc } from '../services/api';

interface ChatProps {
  currentUserId: string;
  currentUsername: string;
}

const Chat: React.FC<ChatProps> = ({ currentUserId, currentUsername }) => {
  const theme = useTheme();
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatListItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentMessagesRef = useRef<Message[]>([]);

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
              unreadCount: (message.senderId !== currentUserId && message.senderUsername !== currentUsername) ? chat.unreadCount + 1 : chat.unreadCount
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
        return [...newMessages];
      });
      

      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  };



  useEffect(() => {
    currentMessagesRef.current = messages;
  }, [messages]);









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
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId: string) => {
    if (messagesLoading) {
      return;
    }
    
    setMessagesLoading(true);
    try {
      const chatMessages = await chatService.getChatMessages(chatId);
      
      setMessages(chatMessages.content.reverse()); 
      scrollToBottom();
      
      await chatService.markAsRead(chatId);
      
      setChats(prev => prev.map(chat => 
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      ));
    } catch (error: any) {
      alert(`Failed to load messages: ${error.response?.data || error.message || 'Unknown error'}`);
    } finally {
      setMessagesLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleChatSelect = (chat: ChatListItem) => {
    setSelectedChat(chat);
    loadMessages(chat.id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      const message = await chatService.sendMessage(selectedChat.id, newMessage.trim());
      
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      scrollToBottom();

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

  const filteredChats = chats.filter(chat =>
    chat.otherUser.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatMessageTime = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm');
  };

  const formatChatTime = (timestamp?: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 3600);
    
    if (diffInHours < 24) {
      return format(date, 'HH:mm');
    } else {
      return format(date, 'dd/MM');
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: 'background.default' }}>

      <Paper 
        sx={{ 
          width: selectedChat ? { xs: '0px', md: '350px' } : '100%',
          maxWidth: '350px',
          display: selectedChat ? { xs: 'none', md: 'block' } : 'block',
          borderRadius: 0,
          height: '100%',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            <MessageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Messages
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ height: 'calc(100% - 120px)', overflow: 'auto' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {filteredChats.map((chat, index) => (
                <React.Fragment key={chat.id}>
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => handleChatSelect(chat)}
                      sx={{
                        bgcolor: selectedChat?.id === chat.id ? 'action.selected' : 'transparent',
                        '&:hover': { bgcolor: 'action.hover' }
                      }}
                    >
                      <ListItemAvatar>
                        <Badge badgeContent={chat.unreadCount} color="primary">
                          <Avatar 
                            src={getProfilePictureSrc(chat.otherUser.profilePicture || null, chat.otherUser.id)}
                          >
                            {chat.otherUser.username.charAt(0).toUpperCase()}
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" noWrap sx={{ flex: 1 }}>
                              {chat.otherUser.username}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatChatTime(chat.lastMessageTime)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {chat.lastMessage?.content || 'No messages yet'}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < filteredChats.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Paper>


      {selectedChat ? (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

          <Paper 
            sx={{ 
              p: 2, 
              borderRadius: 0, 
              borderBottom: 1, 
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <IconButton 
              sx={{ display: { xs: 'block', md: 'none' }, mr: 1 }}
              onClick={() => setSelectedChat(null)}
            >
              <ArrowBackIcon />
            </IconButton>
            <Avatar 
              src={getProfilePictureSrc(selectedChat.otherUser.profilePicture || null, selectedChat.otherUser.id)}
              sx={{ mr: 2 }}
            >
              {selectedChat.otherUser.username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h6" sx={{ flex: 1 }}>
              {selectedChat.otherUser.username}
            </Typography>

          </Paper>


          <Box 
            sx={{ 
              flex: 1, 
              overflow: 'auto', 
              p: 1,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {messagesLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              messages.map((message) => (
                <Box
                  key={message.id}
                  sx={{
                    display: 'flex',
                    justifyContent: message.senderId === currentUserId ? 'flex-end' : 'flex-start',
                    mb: 1
                  }}
                >
                  <Paper
                    sx={{
                      p: 1.5,
                      maxWidth: '70%',
                      bgcolor: message.senderId === currentUserId 
                        ? 'primary.main' 
                        : theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100',
                      color: message.senderId === currentUserId ? 'primary.contrastText' : 'text.primary'
                    }}
                  >
                    <Typography variant="body2">
                      {message.content}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        display: 'block', 
                        textAlign: 'right', 
                        mt: 0.5,
                        opacity: 0.7
                      }}
                    >
                      {formatMessageTime(message.timestamp)}
                    </Typography>
                  </Paper>
                </Box>
              ))
            )}
            <div ref={messagesEndRef} />
          </Box>


          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <TextField
              fullWidth
              multiline
              maxRows={4}
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      color="primary"
                    >
                      <SendIcon />
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
            bgcolor: 'background.paper'
          }}
        >
          <MessageIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Select a conversation to start messaging
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default Chat; 