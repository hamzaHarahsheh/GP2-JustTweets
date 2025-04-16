package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.Timeline;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface TimelineRepository extends MongoRepository<Timeline, String> {

    Optional<Timeline> findByUserId(String userId);

}
