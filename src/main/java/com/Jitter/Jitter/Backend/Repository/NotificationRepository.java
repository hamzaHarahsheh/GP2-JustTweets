package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {

    List<Notification> findByUserId(String userId);
}
