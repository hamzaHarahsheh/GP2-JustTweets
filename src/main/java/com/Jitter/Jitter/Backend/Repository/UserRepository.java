package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.User;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    @Aggregation(pipeline = {
            "{ $lookup: { from: 'media', localField: 'profilePicture', foreignField: '_id', as: 'profilePicture' } }",
            "{ $unwind: { path: '$profilePicture', preserveNullAndEmptyArrays: true } }",
            "{ $match: { _id: ?0 } }"
    })
    Optional<User> findByIdWithMedia(String id);

    @Aggregation(pipeline = {
            "{ $lookup: { from: 'media', localField: 'profilePicture', foreignField: '_id', as: 'profilePicture' } }",
            "{ $unwind: { path: '$profilePicture', preserveNullAndEmptyArrays: true } }"
    })
    List<User> findAllWithMedia();

    @Aggregation(pipeline = {
            "{ $lookup: { from: 'media', localField: 'profilePicture', foreignField: '_id', as: 'profilePicture' } }",
            "{ $unwind: { path: '$profilePicture', preserveNullAndEmptyArrays: true } }",
            "{ $match: { username: ?0 } }"
    })
    Optional<User> findByUsernameWithMedia(String username);

    @Aggregation(pipeline = {
            "{ $lookup: { from: 'media', localField: 'profilePicture', foreignField: '_id', as: 'profilePicture' } }",
            "{ $unwind: { path: '$profilePicture', preserveNullAndEmptyArrays: true } }",
            "{ $match: { email: ?0 } }"
    })
    Optional<User> findByEmailWithMedia(String email);
}