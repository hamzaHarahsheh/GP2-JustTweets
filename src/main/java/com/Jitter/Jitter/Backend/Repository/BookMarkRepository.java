package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.BookMark;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface BookMarkRepository extends MongoRepository<BookMark, String> {

    List<BookMark> findByUserId(String userId);
    Optional<BookMark> findByUserIdAndPostId(String userId, String postId);

}
