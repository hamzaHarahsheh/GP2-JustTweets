package com.Jitter.Jitter.Backend.Controller;

import com.Jitter.Jitter.Backend.Models.Media;
import com.Jitter.Jitter.Backend.Models.Post;
import com.Jitter.Jitter.Backend.Models.Follow;
import com.Jitter.Jitter.Backend.Service.PostService;
import com.Jitter.Jitter.Backend.Service.UserService;
import com.Jitter.Jitter.Backend.Service.NotificationService;
import com.Jitter.Jitter.Backend.Service.FollowService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {
    private final PostService postService;
    private final UserService userService;
    private final NotificationService notificationService;
    private final FollowService followService;

    @Autowired
    public PostController(PostService postService, UserService userService, 
                         NotificationService notificationService, FollowService followService) {
        this.postService = postService;
        this.userService = userService;
        this.notificationService = notificationService;
        this.followService = followService;
    }

    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        return postService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Post> getPostsByUserId(@PathVariable String userId) {
        return postService.getByUserId(userId);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Post> createPost(
            @RequestPart("post") String postJson,
            @RequestPart(value = "images", required = false) List<MultipartFile> images,
            Principal principal) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            Post post = objectMapper.readValue(postJson, Post.class);
            String username = principal.getName();
            String userId = userService.getByUsername(username)
                    .map(u -> u.getId())
                    .orElseThrow(() -> new RuntimeException("User not found for username: " + username));
            post.setUserId(userId);
            Post savedPost = postService.createPost(post, images);
            
            List<Follow> followers = followService.getFollowers(userId);
            for (Follow follow : followers) {
                if (!follow.getFollowerId().equals(userId)) {
                    notificationService.createNotification(
                        follow.getFollowerId(), 
                        "NEW_POST", 
                        userId, 
                        savedPost.getId(), 
                        null, 
                        null
                    );
                }
            }
            
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPost);
        } catch (IOException e) {
            throw new RuntimeException("Failed to process images", e);
        }
    }

    @GetMapping("/{id}/image/{index}")
    public ResponseEntity<?> getImage(@PathVariable String id, @PathVariable int index) {
        return postService.getById(id)
                .map(post -> {
                    if (post.getImage() == null || post.getImage().isEmpty() || index >= post.getImage().size()) {
                        return ResponseEntity.notFound().build();
                    }
                    Media media = post.getImage().get(index);
                    if (media.getData() == null) {
                        return ResponseEntity.notFound().build();
                    }
                    return ResponseEntity.ok()
                            .contentType(MediaType.parseMediaType(media.getType()))
                            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + media.getFileName() + "\"")
                            .body(media.getData());
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<?> getAllImages(@PathVariable String id) {
        return postService.getById(id)
                .map(post -> {
                    if (post.getImage() == null || post.getImage().isEmpty()) {
                        return ResponseEntity.notFound().build();
                    }
                    List<ResponseEntity<?>> images = new ArrayList<>();
                    for (Media media : post.getImage()) {
                        if (media.getData() != null) {
                            ResponseEntity<?> imageResponse = ResponseEntity.ok()
                                    .contentType(MediaType.parseMediaType(media.getType()))
                                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + media.getFileName() + "\"")
                                    .body(media.getData());
                            images.add(imageResponse);
                        }
                    }
                    return ResponseEntity.ok(images);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        postService.delete(id);
        return ResponseEntity.noContent().build();
    }
}