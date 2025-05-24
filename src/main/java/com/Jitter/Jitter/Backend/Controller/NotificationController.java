package com.Jitter.Jitter.Backend.Controller;

import com.Jitter.Jitter.Backend.Models.Notification;
import com.Jitter.Jitter.Backend.Service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {
    @Autowired
    private NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable String userId) {
        List<Notification> notifications = notificationService.getUserNotifications(userId);
        if (notifications == null) {
            return ResponseEntity.ok(java.util.Collections.emptyList());
        }
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/unread/count/{userId}")
    public ResponseEntity<Long> getUnreadNotificationCount(@PathVariable String userId) {
        return ResponseEntity.ok(notificationService.getUnreadNotificationCount(userId));
    }

    @PutMapping("/read/{notificationId}")
    public ResponseEntity<Void> markNotificationAsRead(@PathVariable String notificationId) {
        notificationService.markNotificationAsRead(notificationId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/read/all/{userId}")
    public ResponseEntity<Void> markAllNotificationsAsRead(@PathVariable String userId) {
        notificationService.markAllNotificationsAsRead(userId);
        return ResponseEntity.ok().build();
    }
} 