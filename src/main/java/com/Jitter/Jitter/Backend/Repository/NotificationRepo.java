package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface NotificationRepo extends MongoRepository<Notification, String> {

}
