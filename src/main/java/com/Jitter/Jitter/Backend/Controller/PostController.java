package com.Jitter.Jitter.Backend.Controller;

import com.Jitter.Jitter.Backend.Models.Media;
import com.Jitter.Jitter.Backend.Models.Post;
import com.Jitter.Jitter.Backend.Service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/posts")
@CrossOrigin(origins = "http://localhost:3000")
public class PostController {
    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
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
            @RequestPart("post") Post post,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        try {
            Post savedPost = postService.createPost(post, images);
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