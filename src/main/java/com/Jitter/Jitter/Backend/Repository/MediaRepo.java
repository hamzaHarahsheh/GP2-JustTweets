package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.Media;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MediaRepo extends MongoRepository<Media, String> {

}
