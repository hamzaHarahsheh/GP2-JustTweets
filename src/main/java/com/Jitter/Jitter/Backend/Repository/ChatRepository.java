package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.Chat;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChatRepository extends MongoRepository<Chat, String> {
    
    @Query("{ 'participantIds': ?0 }")
    List<Chat> findByParticipantIdsContaining(String userId);
    
    @Query("{ 'participantIds': { $all: [?0, ?1], $size: 2 } }")
    Optional<Chat> findByParticipantIds(String userId1, String userId2);
    
    @Query("{ 'participantIds': ?0 }")
    List<Chat> findByParticipantIdsContainingOrderByLastMessageTimeDesc(String userId);
} 