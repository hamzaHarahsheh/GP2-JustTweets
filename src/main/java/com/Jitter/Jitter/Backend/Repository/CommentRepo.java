package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.Comment;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CommentRepo extends MongoRepository<Comment, String> {

}
