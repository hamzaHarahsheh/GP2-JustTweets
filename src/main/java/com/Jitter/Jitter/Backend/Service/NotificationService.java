package com.Jitter.Jitter.Backend.Service;

import com.Jitter.Jitter.Backend.Models.Notification;
import com.Jitter.Jitter.Backend.Repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public List<Notification> getByUserId(String userId) {
        return notificationRepository.findByUserId(userId);
    }

    public Notification save(Notification notification) {
        return notificationRepository.save(notification);
    }

    public void delete(String id) {
        notificationRepository.deleteById(id);
    }
}
