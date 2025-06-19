package com.Jitter.Jitter.Backend.Controller;

import com.Jitter.Jitter.Backend.Models.Chat;
import com.Jitter.Jitter.Backend.Models.Message;
import com.Jitter.Jitter.Backend.Models.User;
import com.Jitter.Jitter.Backend.Repository.ChatRepository;
import com.Jitter.Jitter.Backend.Repository.UserRepository;
import com.Jitter.Jitter.Backend.Service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
    @Autowired
    private ChatRepository chatRepository;
    
    @Autowired
    private UserRepository userRepository;

    private String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication.getName();
        return userId;
    }

    @PostMapping("/create/{otherUserId}")
    public ResponseEntity<?> createChat(@PathVariable String otherUserId) {
        try {
            String currentUserId = getCurrentUserId();
            
            if (otherUserId == null || otherUserId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Other user ID is required");
            }
            
            if (currentUserId == null || currentUserId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Current user ID is required (authentication issue)");
            }
            
            if (currentUserId.equals(otherUserId)) {
                return ResponseEntity.badRequest().body("Cannot create chat with yourself");
            }
            
            Chat chat = chatService.createOrGetChat(currentUserId, otherUserId);
            return ResponseEntity.ok(chat);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating chat: " + e.getMessage());
        }
    }

    @GetMapping("/list")
    public ResponseEntity<?> getUserChats() {
        try {
            String currentUserId = getCurrentUserId();
            
            if (currentUserId == null || currentUserId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Current user ID is required (authentication issue)");
            }
            
            List<Map<String, Object>> chats = chatService.getUserChats(currentUserId);
            return ResponseEntity.ok(chats);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving chats: " + e.getMessage());
        }
    }

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<?> getChatMessages(
            @PathVariable String chatId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size) {
        try {
            String currentUserId = getCurrentUserId();
            
            if (currentUserId == null || currentUserId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Current user ID is required (authentication issue)");
            }
            
            if (chatId == null || chatId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Chat ID is required");
            }
            
            Page<Message> messages = chatService.getChatMessages(chatId, currentUserId, page, size);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error retrieving messages: " + e.getMessage());
        }
    }

    @PostMapping("/{chatId}/send")
    public ResponseEntity<?> sendMessage(
            @PathVariable String chatId,
            @RequestBody Map<String, Object> messageData) {
        try {
            String currentUserId = getCurrentUserId();
            
            if (chatId == null || chatId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Chat ID is required");
            }
            
            if (currentUserId == null || currentUserId.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Current user ID is required (authentication issue)");
            }
            
            if (messageData == null) {
                return ResponseEntity.badRequest().body("Message data is required");
            }
            
            String content = (String) messageData.get("content");
            if (content == null || content.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Message content is required");
            }
            
            String typeStr = (String) messageData.getOrDefault("type", "TEXT");
            
            Message.MessageType type;
            try {
                type = Message.MessageType.valueOf(typeStr);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid message type: " + typeStr);
            }

            Message message = chatService.sendMessage(chatId, currentUserId, content, type);

            try {
                Optional<Chat> chatOpt = chatRepository.findById(chatId);
                
                if (chatOpt.isPresent()) {
                    Chat chat = chatOpt.get();
                    
                    chat.getParticipantIds().forEach(participantId -> {
                        if (!participantId.equals(currentUserId)) {
                            try {
                                messagingTemplate.convertAndSendToUser(
                                    participantId,
                                    "/queue/messages",
                                    message
                                );
                                
                                Optional<User> userOpt = userRepository.findById(participantId);
                                if (userOpt.isPresent()) {
                                    String username = userOpt.get().getUsername();
                                    messagingTemplate.convertAndSendToUser(
                                        username,
                                        "/queue/messages",
                                        message
                                    );
                                }
                            } catch (Exception e) {
                            }
                        }
                    });
                }
            } catch (Exception e) {
            }

            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error sending message: " + e.getMessage());
        }
    }

    @PutMapping("/{chatId}/read")
    public ResponseEntity<?> markAsRead(@PathVariable String chatId) {
        try {
            String currentUserId = getCurrentUserId();
            chatService.markMessagesAsRead(chatId, currentUserId);
            return ResponseEntity.ok("Messages marked as read");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error marking messages as read: " + e.getMessage());
        }
    }

    @DeleteMapping("/message/{messageId}")
    public ResponseEntity<?> deleteMessage(@PathVariable String messageId) {
        try {
            String currentUserId = getCurrentUserId();
            chatService.deleteMessage(messageId, currentUserId);
            return ResponseEntity.ok("Message deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting message: " + e.getMessage());
        }
    }

    @MessageMapping("/test")
    public void testWebSocket(@Payload Map<String, Object> testData) {
        String userId = (String) testData.get("userId");
        
        if (userId != null) {
            Map<String, Object> response = Map.of(
                "type", "test_response",
                "message", "Connection test successful",
                "timestamp", java.time.Instant.now().toString()
            );
            
            messagingTemplate.convertAndSendToUser(userId, "/queue/test", response);
        }
    }

    @MessageMapping("/chat.sendMessage")
    public void sendMessageViaWebSocket(@Payload Map<String, Object> messageData) {
        try {
            String senderId = (String) messageData.get("senderId");
            String chatId = (String) messageData.get("chatId");
            String content = (String) messageData.get("content");
            
            Optional<Chat> chatOpt = chatRepository.findById(chatId);
            if (chatOpt.isPresent()) {
                Chat chat = chatOpt.get();
                
                chat.getParticipantIds().forEach(participantId -> {
                    if (!participantId.equals(senderId)) {
                        messagingTemplate.convertAndSendToUser(participantId, "/queue/messages", messageData);
                        
                        Optional<User> userOpt = userRepository.findById(participantId);
                        if (userOpt.isPresent()) {
                            String username = userOpt.get().getUsername();
                            messagingTemplate.convertAndSendToUser(username, "/queue/messages", messageData);
                        }
                    }
                });
            }
        } catch (Exception e) {
        }
    }
} 