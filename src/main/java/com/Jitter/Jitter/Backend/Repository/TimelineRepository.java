package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.TimeLine;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TimeLineRepo extends MongoRepository<TimeLine, String> {

}
