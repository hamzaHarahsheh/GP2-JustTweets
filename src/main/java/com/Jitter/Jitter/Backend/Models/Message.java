package com.Jitter.Jitter.Backend.Models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "messages")
public class Message {
    @Id
    private String id;
    
    private String chatId;
    private String senderId;
    private String senderUsername;
    private String content;
    private MessageType type;
    private LocalDateTime timestamp;
    private boolean isRead;
    private boolean isEdited;
    private LocalDateTime editedAt;
    
    public enum MessageType {
        TEXT,
        IMAGE,
        FILE
    }
    
    public Message() {
        this.timestamp = LocalDateTime.now();
        this.isRead = false;
        this.isEdited = false;
    }
    
    public Message(String chatId, String senderId, String senderUsername, String content, MessageType type) {
        this();
        this.chatId = chatId;
        this.senderId = senderId;
        this.senderUsername = senderUsername;
        this.content = content;
        this.type = type;
    }
} 