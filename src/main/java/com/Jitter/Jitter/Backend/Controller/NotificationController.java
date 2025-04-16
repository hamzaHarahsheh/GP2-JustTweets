package com.Jitter.Jitter.Backend.Controller;

import com.Jitter.Jitter.Backend.Models.Notification;
import com.Jitter.Jitter.Backend.Repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepo;

    @PostMapping("/add")
    public Notification addNotification(@RequestBody Notification notification) {
        return notificationRepo.save(notification);
    }

    @GetMapping("/{id}")
    public Optional<Notification> getNotificationById(@PathVariable String id) {
        return notificationRepo.findById(id);
    }

    @GetMapping
    public List<Notification> getAllNotifications() {
        return notificationRepo.findAll();
    }

    @PutMapping("/{id}")
    public Notification updateNotification(@PathVariable String id, @RequestBody Notification updatedNotification) {
        updatedNotification.setId(id);
        return notificationRepo.save(updatedNotification);
    }

    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable String id) {
        notificationRepo.deleteById(id);
    }
}
