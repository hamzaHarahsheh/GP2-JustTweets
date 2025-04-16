package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.BookMark;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface BookMarkRepo extends MongoRepository<BookMark, String> {


}
