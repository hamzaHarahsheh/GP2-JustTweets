package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.Post;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {

    @Aggregation(pipeline = {
            "{ $lookup: { from: 'media', localField: 'media', foreignField: '_id', as: 'media' } }",
            "{ $match: { _id: ?0 } }"
    })
    Optional<Post> findByIdWithMedia(String id);

    @Aggregation(pipeline = {
            "{ $lookup: { from: 'media', localField: 'media', foreignField: '_id', as: 'media' } }",
            "{ $match: { userId: ?0 } }"
    })
    List<Post> findByUserIdWithMedia(String userId);

    @Aggregation(pipeline = {
            "{ $lookup: { from: 'media', localField: 'media', foreignField: '_id', as: 'media' } }",
            "{ $sort: { createdAt: -1 } }"
    })
    List<Post> findAllWithMedia();

    List<Post> findByUserId(String userId);
}