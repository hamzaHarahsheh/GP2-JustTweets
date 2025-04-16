package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.Post;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PostRepo extends MongoRepository<Post, String> {
}
