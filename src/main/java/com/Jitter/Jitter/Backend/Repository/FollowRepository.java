package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.Follow;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FollowRepo extends MongoRepository<Follow, String> {

}
