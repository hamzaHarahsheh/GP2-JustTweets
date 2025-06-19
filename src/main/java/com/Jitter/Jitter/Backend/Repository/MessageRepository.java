package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    
    List<Message> findByChatIdOrderByTimestampDesc(String chatId);
    
    Page<Message> findByChatIdOrderByTimestampDesc(String chatId, Pageable pageable);
    
    Message findTopByChatIdOrderByTimestampDesc(String chatId);
    
    @Query("{ 'chatId': ?0, 'senderId': { $ne: ?1 }, 'isRead': false }")
    long countUnreadMessages(String chatId, String userId);
    
    @Query("{ 'chatId': ?0, 'senderId': { $ne: ?1 }, 'isRead': false }")
    List<Message> findUnreadMessagesInChat(String chatId, String userId);
} 