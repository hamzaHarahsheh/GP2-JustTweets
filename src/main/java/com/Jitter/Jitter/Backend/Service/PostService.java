package com.Jitter.Jitter.Backend.Service;

import com.Jitter.Jitter.Backend.Models.Media;
import com.Jitter.Jitter.Backend.Models.Post;
import com.Jitter.Jitter.Backend.Repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final MediaService mediaService;

    @Autowired
    public PostService(PostRepository postRepository, MediaService mediaService) {
        this.postRepository = postRepository;
        this.mediaService = mediaService;
    }

    public List<Post> getAllPosts() {
        return postRepository.findAllWithMedia();
    }

    public Optional<Post> getById(String id) {
        return postRepository.findByIdWithMedia(id);
    }

    public List<Post> getAllByUser(String userId) {
        return postRepository.findByUserIdWithMedia(userId);
    }

    public Post createPost(String content, String userId, List<MultipartFile> files) throws IOException {
        Post post = new Post();
        post.setContent(content);
        post.setUserId(userId);
        post.setCreatedAt(new Date());
        post.setUpdatedAt(new Date());

        if (files != null && !files.isEmpty()) {
            List<Media> mediaList = new ArrayList<>();
            for (MultipartFile file : files) {
                Media media = mediaService.saveMedia(file);
                mediaList.add(media);
            }
            post.setMedia(mediaList);
        }

        return postRepository.save(post);
    }

    public Optional<Post> updatePost(String id, Post updatedPost) {
        return postRepository.findByIdWithMedia(id)
                .map(existingPost -> {
                    updatedPost.setId(id);
                    updatedPost.setUpdatedAt(new Date());
                    if (updatedPost.getCreatedAt() == null) {
                        updatedPost.setCreatedAt(existingPost.getCreatedAt());
                    }
                    if (updatedPost.getMedia() == null) {
                        updatedPost.setMedia(existingPost.getMedia());
                    }
                    return postRepository.save(updatedPost);
                });
    }

    public Optional<Post> addMediaToPost(String id, MultipartFile file) throws IOException {
        return postRepository.findByIdWithMedia(id)
                .map(post -> {
                    try {
                        Media media = mediaService.saveMedia(file);
                        if (post.getMedia() == null) {
                            post.setMedia(new ArrayList<>());
                        }
                        post.getMedia().add(media);
                        post.setUpdatedAt(new Date());
                        return postRepository.save(post);
                    } catch (IOException e) {
                        throw new RuntimeException("Failed to process media file", e);
                    }
                });
    }

    public boolean deleteMediaFromPost(String postId, String mediaId) {
        return postRepository.findByIdWithMedia(postId)
                .map(post -> {
                    boolean removed = post.getMedia().removeIf(m -> m.getId().equals(mediaId));
                    if (removed) {
                        mediaService.deleteMedia(mediaId);
                        post.setUpdatedAt(new Date());
                        postRepository.save(post);
                    }
                    return removed;
                })
                .orElse(false);
    }

    public Optional<Media> getPostMedia(String postId, String mediaId) {
        return postRepository.findByIdWithMedia(postId)
                .flatMap(post -> post.getMedia().stream()
                        .filter(m -> m.getId().equals(mediaId))
                        .findFirst());
    }

    public void delete(String id) {
        postRepository.findByIdWithMedia(id)
                .ifPresent(post -> {
                    if (post.getMedia() != null && !post.getMedia().isEmpty()) {
                        mediaService.deleteMultipleMedia(post.getMedia());
                    }
                    postRepository.deleteById(id);
                });
    }
}