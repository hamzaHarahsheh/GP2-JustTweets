package com.Jitter.Jitter.Backend.Models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "chats")
public class Chat {
    @Id
    private String id;
    
    private List<String> participantIds; 
    private String lastMessageId;
    private LocalDateTime lastMessageTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public Chat() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Chat(List<String> participantIds) {
        this();
        this.participantIds = participantIds;
    }
} 