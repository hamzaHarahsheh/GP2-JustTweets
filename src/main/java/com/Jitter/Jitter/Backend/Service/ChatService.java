package com.Jitter.Jitter.Backend.Service;

import com.Jitter.Jitter.Backend.Models.Chat;
import com.Jitter.Jitter.Backend.Models.Message;
import com.Jitter.Jitter.Backend.Models.User;
import com.Jitter.Jitter.Backend.Repository.ChatRepository;
import com.Jitter.Jitter.Backend.Repository.MessageRepository;
import com.Jitter.Jitter.Backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.Base64;

@Service
public class ChatService {
    
    @Autowired
    private ChatRepository chatRepository;
    
    @Autowired
    private MessageRepository messageRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public Chat createOrGetChat(String userId1, String userId2) {
        final String actualUserId1;
        final String actualUserId2;
        
        Optional<User> user1Opt = userRepository.findById(userId1);
        if (user1Opt.isEmpty()) {
            Optional<User> userByUsername = userRepository.findByUsername(userId1);
            if (userByUsername.isPresent()) {
                actualUserId1 = userByUsername.get().getId();
            } else {
                throw new RuntimeException("User1 not found: " + userId1);
            }
        } else {
            actualUserId1 = userId1;
        }
        
        Optional<User> user2Opt = userRepository.findById(userId2);
        if (user2Opt.isEmpty()) {
            Optional<User> userByUsername = userRepository.findByUsername(userId2);
            if (userByUsername.isPresent()) {
                actualUserId2 = userByUsername.get().getId();
            } else {
                throw new RuntimeException("User2 not found: " + userId2);
            }
        } else {
            actualUserId2 = userId2;
        }
        
        Optional<Chat> existingChat = chatRepository.findByParticipantIds(actualUserId1, actualUserId2);
        if (existingChat.isEmpty()) {
            existingChat = chatRepository.findByParticipantIds(actualUserId2, actualUserId1);
        }
        
        if (existingChat.isPresent()) {
            return existingChat.get();
        }
        
        List<String> participants;
        if (actualUserId1.compareTo(actualUserId2) < 0) {
            participants = Arrays.asList(actualUserId1, actualUserId2);
        } else {
            participants = Arrays.asList(actualUserId2, actualUserId1);
        }
        
        Chat newChat = new Chat(participants);
        Chat savedChat = chatRepository.save(newChat);
        
        return savedChat;
    }
    
    public List<Map<String, Object>> getUserChats(String userId) {
        try {
            final String actualUserId;
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                Optional<User> userByUsername = userRepository.findByUsername(userId);
                if (userByUsername.isPresent()) {
                    actualUserId = userByUsername.get().getId();
                } else {
                    return new ArrayList<>();
                }
            } else {
                actualUserId = userId;
            }
            
            List<Chat> chats = chatRepository.findByParticipantIdsContainingOrderByLastMessageTimeDesc(actualUserId);
            
            return chats.stream().map(chat -> {
                Map<String, Object> chatInfo = new HashMap<>();
                chatInfo.put("id", chat.getId());
                chatInfo.put("lastMessageTime", chat.getLastMessageTime());
                
                String otherUserId = chat.getParticipantIds().stream()
                    .filter(id -> !id.equals(actualUserId))
                    .findFirst()
                    .orElse(null);
                
                if (otherUserId != null) {
                    Optional<User> otherUserOpt = userRepository.findById(otherUserId);
                    if (otherUserOpt.isEmpty()) {
                        otherUserOpt = userRepository.findByUsername(otherUserId);
                    }
                    
                    if (otherUserOpt.isPresent()) {
                        User otherUser = otherUserOpt.get();
                        
                        Map<String, Object> otherUserInfo = new HashMap<>();
                        otherUserInfo.put("id", otherUser.getId());
                        otherUserInfo.put("username", otherUser.getUsername());
                        
                        if (otherUser.getProfilePicture() != null && otherUser.getProfilePicture().getData() != null && otherUser.getProfilePicture().getData().length > 0) {
                            otherUserInfo.put("profilePicture", "/api/user/" + otherUser.getId() + "/profile-picture");
                        } else {
                            otherUserInfo.put("profilePicture", null);
                        }
                        
                        chatInfo.put("otherUser", otherUserInfo);
                    } else {
                        Map<String, Object> otherUserInfo = new HashMap<>();
                        otherUserInfo.put("id", otherUserId);
                        otherUserInfo.put("username", "Unknown User");
                        otherUserInfo.put("profilePicture", null);
                        
                        chatInfo.put("otherUser", otherUserInfo);
                    }
                } else {
                    Map<String, Object> otherUserInfo = new HashMap<>();
                    otherUserInfo.put("id", null);
                    otherUserInfo.put("username", "Unknown User");
                    otherUserInfo.put("profilePicture", null);
                    
                    chatInfo.put("otherUser", otherUserInfo);
                }
                
                if (chat.getLastMessageId() != null) {
                    try {
                        Optional<Message> lastMessage = messageRepository.findById(chat.getLastMessageId());
                        lastMessage.ifPresent(message -> chatInfo.put("lastMessage", message));
                    } catch (Exception e) {
                    }
                }
                
                try {
                    List<Message> unreadMessages = messageRepository.findUnreadMessagesInChat(chat.getId(), actualUserId);
                    long unreadCount = unreadMessages != null ? unreadMessages.size() : 0;
                    chatInfo.put("unreadCount", unreadCount);
                } catch (Exception e) {
                    chatInfo.put("unreadCount", 0L);
                }
                
                return chatInfo;
            }).collect(Collectors.toList());
            
        } catch (Exception e) {
            throw e;
        }
    }
    
    public Message sendMessage(String chatId, String userId, String content, Message.MessageType type) {
        try {
            Optional<Chat> chatOpt = chatRepository.findById(chatId);
            if (chatOpt.isEmpty()) {
                throw new RuntimeException("Chat not found");
            }
            Chat chat = chatOpt.get();

            final String actualUserId;
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                Optional<User> userByUsername = userRepository.findByUsername(userId);
                if (userByUsername.isPresent()) {
                    actualUserId = userByUsername.get().getId();
                } else {
                    throw new RuntimeException("Sender not found");
                }
            } else {
                actualUserId = userId;
            }

            if (!chat.getParticipantIds().contains(actualUserId)) {
                throw new RuntimeException("User is not a participant in this chat");
            }

            Message message = new Message();
            message.setChatId(chatId);
            message.setSenderId(actualUserId);
            message.setContent(content);
            message.setType(type);
            message.setTimestamp(LocalDateTime.now());
            message.setRead(false);

            Message savedMessage = messageRepository.save(message);

            chat.setLastMessageId(savedMessage.getId());
            chat.setLastMessageTime(savedMessage.getTimestamp());
            chatRepository.save(chat);

            return savedMessage;
        } catch (Exception e) {
            throw e;
        }
    }
    
    public Page<Message> getChatMessages(String chatId, String userId, int page, int size) {
        try {
            Optional<Chat> chatOpt = chatRepository.findById(chatId);
            if (chatOpt.isEmpty()) {
                throw new RuntimeException("Chat not found");
            }
            Chat chat = chatOpt.get();

            final String actualUserId;
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                Optional<User> userByUsername = userRepository.findByUsername(userId);
                if (userByUsername.isPresent()) {
                    actualUserId = userByUsername.get().getId();
                } else {
                    throw new RuntimeException("User not found");
                }
            } else {
                actualUserId = userId;
            }

            if (!chat.getParticipantIds().contains(actualUserId) && !chat.getParticipantIds().contains(userId)) {
                throw new RuntimeException("User is not authorized to access this chat");
            }

            Pageable pageable = PageRequest.of(page, size);
            Page<Message> messages = messageRepository.findByChatIdOrderByTimestampDesc(chatId, pageable);
            return messages;
        } catch (Exception e) {
            throw e;
        }
    }
    
    public void markMessagesAsRead(String chatId, String userId) {
        try {
            List<Message> unreadMessages = messageRepository.findUnreadMessagesInChat(chatId, userId);
            for (Message message : unreadMessages) {
                if (!message.getSenderId().equals(userId)) {
                    message.setRead(true);
                }
            }
            messageRepository.saveAll(unreadMessages);
        } catch (Exception e) {
            throw new RuntimeException("Error marking messages as read: " + e.getMessage(), e);
        }
    }
    
    public Optional<Chat> getChatById(String chatId, String userId) {
        try {
            Optional<Chat> chatOpt = chatRepository.findById(chatId);
            if (chatOpt.isEmpty()) {
                return Optional.empty();
            }
            Chat chat = chatOpt.get();

            final String actualUserId;
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                Optional<User> userByUsername = userRepository.findByUsername(userId);
                if (userByUsername.isPresent()) {
                    actualUserId = userByUsername.get().getId();
                } else {
                    return Optional.empty();
                }
            } else {
                actualUserId = userId;
            }

            if (!chat.getParticipantIds().contains(actualUserId)) {
                return Optional.empty();
            }

            return Optional.of(chat);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
    
    public void deleteMessage(String messageId, String userId) {
        try {
            Optional<Message> messageOpt = messageRepository.findById(messageId);
            if (messageOpt.isEmpty()) {
                throw new RuntimeException("Message not found");
            }

            Message message = messageOpt.get();
            if (!message.getSenderId().equals(userId)) {
                throw new RuntimeException("You can only delete your own messages");
            }

            messageRepository.delete(message);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting message: " + e.getMessage(), e);
        }
    }
    
    public Chat createChat(String currentUserId, String otherUserId) {
        return createOrGetChat(currentUserId, otherUserId);
    }
} 