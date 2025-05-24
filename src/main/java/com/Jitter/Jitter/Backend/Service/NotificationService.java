package com.Jitter.Jitter.Backend.Service;

import com.Jitter.Jitter.Backend.Models.Notification;
import com.Jitter.Jitter.Backend.Repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public Notification createNotification(String userId, String type, String sourceUserId, String postId, String commentId, String content) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setType(type);
        notification.setSourceUserId(sourceUserId);
        notification.setPostId(postId);
        notification.setCommentId(commentId);
        notification.setContent(content);
        notification.setRead(false);
        notification.setCreatedAt(new Date());
        return notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return notifications != null ? notifications : java.util.Collections.emptyList();
    }

    public long getUnreadNotificationCount(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    public void markNotificationAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }

    public void markAllNotificationsAsRead(String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndReadFalse(userId);
        notifications.forEach(notification -> notification.setRead(true));
        notificationRepository.saveAll(notifications);
    }
} 