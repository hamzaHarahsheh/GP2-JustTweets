package com.Jitter.Jitter.Backend.Service;

import com.Jitter.Jitter.Backend.Models.Notification;
import com.Jitter.Jitter.Backend.Repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;
import java.util.List;

@Service
public class NotificationService {
    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    
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
        try {
            logger.info("Service: Fetching notifications for userId: {}", userId);
            List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
            logger.info("Service: Found {} notifications for userId: {}", notifications != null ? notifications.size() : 0, userId);
            return notifications != null ? notifications : java.util.Collections.emptyList();
        } catch (Exception e) {
            logger.error("Service: Error fetching notifications for userId: {}", userId, e);
            throw e;
        }
    }

    public Page<Notification> getUserNotificationsPaginated(String userId, int page, int size) {
        try {
            logger.info("Service: Fetching paginated notifications for userId: {}, page: {}, size: {}", userId, page, size);
            Pageable pageable = PageRequest.of(page, size);
            Page<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
            logger.info("Service: Found {} notifications on page {} for userId: {}", 
                notifications.getNumberOfElements(), page, userId);
            return notifications;
        } catch (Exception e) {
            logger.error("Service: Error fetching paginated notifications for userId: {}", userId, e);
            throw e;
        }
    }

    public long getUnreadNotificationCount(String userId) {
        try {
            logger.info("Service: Fetching unread count for userId: {}", userId);
            long count = notificationRepository.countByUserIdAndReadFalse(userId);
            logger.info("Service: Found {} unread notifications for userId: {}", count, userId);
            return count;
        } catch (Exception e) {
            logger.error("Service: Error fetching unread count for userId: {}", userId, e);
            throw e;
        }
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

    public long getTotalNotificationCount() {
        try {
            logger.info("Service: Getting total notification count");
            long count = notificationRepository.count();
            logger.info("Service: Total notifications in database: {}", count);
            return count;
        } catch (Exception e) {
            logger.error("Service: Error getting total count", e);
            throw e;
        }
    }
} 