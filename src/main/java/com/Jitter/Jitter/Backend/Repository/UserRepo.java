package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepo extends MongoRepository<User, Integer> {
}
