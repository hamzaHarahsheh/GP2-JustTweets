package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.Like;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface LikeRepository extends MongoRepository<Like, String> {

    List<Like> findByPostId(String postId);
    List<Like> findByUserId(String userId);
    Optional<Like> findByPostIdAndUserId(String postId, String userId);
}
