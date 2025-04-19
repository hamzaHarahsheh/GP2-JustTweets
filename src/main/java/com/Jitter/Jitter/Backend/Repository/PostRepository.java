package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface PostRepository extends MongoRepository<Post, String> {
    List<Post> findByUserId(String userId);
}