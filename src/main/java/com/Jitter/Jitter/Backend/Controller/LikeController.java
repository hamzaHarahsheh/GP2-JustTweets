package com.Jitter.Jitter.Backend.Controller;

import com.Jitter.Jitter.Backend.Models.Like;
import com.Jitter.Jitter.Backend.Models.Notification;
import com.Jitter.Jitter.Backend.Repository.LikeRepository;
import com.Jitter.Jitter.Backend.Service.NotificationService;
import com.Jitter.Jitter.Backend.Repository.PostRepository;
import com.Jitter.Jitter.Backend.Models.Post;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/likes")
public class LikeController {

    @Autowired
    private LikeRepository likeRepo;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private PostRepository postRepository;

    @PostMapping("/add")
    public Like addLike(@RequestBody Like like) {
        Like savedLike = likeRepo.save(like);
        Post post = postRepository.findById(like.getPostId()).orElse(null);
        if (post != null && !post.getUserId().equals(like.getUserId())) {
            notificationService.createNotification(post.getUserId(), "LIKE", like.getUserId(), post.getId(), null, null);
        }
        return savedLike;
    }

    @GetMapping("/{id}")
    public Optional<Like> getLikeById(@PathVariable String id) {
        return likeRepo.findById(id);
    }

    @GetMapping
    public List<Like> getAllLikes() {
        return likeRepo.findAll();
    }

    @GetMapping("/post/{postId}")
    public List<Like> getLikesByPostId(@PathVariable String postId) {
        return likeRepo.findByPostId(postId);
    }

    @PutMapping("/{id}")
    public Like updateLike(@PathVariable String id, @RequestBody Like updatedLike) {
        updatedLike.setId(id);
        return likeRepo.save(updatedLike);
    }

    @DeleteMapping("/{id}")
    public void deleteLike(@PathVariable String id) {
        likeRepo.deleteById(id);
    }

    // Notification endpoints added as workaround
    @GetMapping("/notifications/test")
    public String testNotificationEndpoint() {
        return "Notification endpoints working via LikeController!";
    }

    @GetMapping("/notifications/user/{userId}")
    public List<Notification> getUserNotifications(@PathVariable String userId) {
        return notificationService.getUserNotifications(userId);
    }

    @GetMapping("/notifications/user/{userId}/paginated")
    public Page<Notification> getUserNotificationsPaginated(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return notificationService.getUserNotificationsPaginated(userId, page, size);
    }

    @GetMapping("/notifications/unread/count/{userId}")
    public Long getUnreadNotificationCount(@PathVariable String userId) {
        return notificationService.getUnreadNotificationCount(userId);
    }

    @PutMapping("/notifications/read/{notificationId}")
    public void markNotificationAsRead(@PathVariable String notificationId) {
        notificationService.markNotificationAsRead(notificationId);
    }

    @PutMapping("/notifications/read/all/{userId}")
    public void markAllNotificationsAsRead(@PathVariable String userId) {
        notificationService.markAllNotificationsAsRead(userId);
    }
}
