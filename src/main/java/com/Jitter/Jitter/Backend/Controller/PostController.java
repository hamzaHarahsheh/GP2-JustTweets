package com.Jitter.Jitter.Backend.Controller;

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
        return postService.getAllPosts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable String id) {
        return postService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Post> getPostsByUserId(@PathVariable String userId) {
        return postService.getAllByUser(userId);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Post> createPost(
            @RequestParam("content") String content,
            @RequestParam("userId") String userId,
            @RequestParam(value = "files", required = false) List<MultipartFile> files) {
        try {
            Post savedPost = postService.createPost(content, userId, files);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedPost);
        } catch (IOException e) {
            throw new RuntimeException("Failed to process media files", e);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(
            @PathVariable String id,
            @RequestBody Post updatedPost) {
        return postService.updatePost(id, updatedPost)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        postService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/media")
    public ResponseEntity<Post> addMediaToPost(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {
        try {
            return postService.addMediaToPost(id, file)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IOException e) {
            throw new RuntimeException("Failed to add media to post", e);
        }
    }

    @DeleteMapping("/{postId}/media/{mediaId}")
    public ResponseEntity<Void> deleteMediaFromPost(
            @PathVariable String postId,
            @PathVariable String mediaId) {
        boolean deleted = postService.deleteMediaFromPost(postId, mediaId);
        return deleted ?
                ResponseEntity.noContent().build() :
                ResponseEntity.notFound().build();
    }

    @GetMapping("/{postId}/media/{mediaId}")
    public ResponseEntity<?> getPostMedia(
            @PathVariable String postId,
            @PathVariable String mediaId) {
        return postService.getPostMedia(postId, mediaId)
                .map(media -> ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(media.getType()))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                        .body(media.getData()))
                .orElse(ResponseEntity.notFound().build());
    }
}