package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.Media;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MediaRepository extends MongoRepository<Media, String> {

    List<Media> findByPostId(String postId);
}
