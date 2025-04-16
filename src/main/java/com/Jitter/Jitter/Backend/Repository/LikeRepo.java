package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.Like;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface LikeRepo extends MongoRepository<Like, String> {
}
