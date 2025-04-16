package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface CommentRepository extends MongoRepository<Comment, String> {

    List<Comment> findByPostId(String postId);
    List<Comment> findByUserId(String userId);
}
