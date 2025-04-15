package com.Jitter.Jitter.Repository;

import com.Jitter.Jitter.Model.Users;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepo extends MongoRepository<Users, Integer> {
}
