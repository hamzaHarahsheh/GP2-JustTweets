package com.Jitter.Jitter.Backend.Service;

import com.Jitter.Jitter.Backend.Models.Media;
import com.Jitter.Jitter.Backend.Models.Post;
import com.Jitter.Jitter.Backend.Repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class PostService {
    private final PostRepository postRepository;

    @Autowired
    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<Post> getAll() {
        return postRepository.findAll();
    }

    public Optional<Post> getById(String id) {
        return postRepository.findById(id);
    }

    public List<Post> getByUserId(String userId) {
        return postRepository.findByUserId(userId);
    }

    public Post createPost(Post post, List<MultipartFile> images) throws IOException {
        post.setCreatedAt(new Date());
        post.setUpdatedAt(new Date());

        if (images != null && !images.isEmpty()) {
            List<Media> mediaList = new ArrayList<>();
            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    Media media = new Media();
                    media.setFileName(image.getOriginalFilename());
                    media.setType(image.getContentType());
                    media.setData(image.getBytes());
                    media.setCreatedAt(new Date());
                    mediaList.add(media);
                }
            }
            post.setImage(mediaList);
        }

        return postRepository.save(post);
    }

    public Optional<Post> updatePost(String id, Post updatedPost) {
        return postRepository.findById(id)
                .map(existingPost -> {
                    updatedPost.setId(id);
                    updatedPost.setUpdatedAt(new Date());
                    if (updatedPost.getCreatedAt() == null) {
                        updatedPost.setCreatedAt(existingPost.getCreatedAt());
                    }
                    if (updatedPost.getImage() == null) {
                        updatedPost.setImage(existingPost.getImage());
                    }
                    return postRepository.save(updatedPost);
                });
    }

    public void delete(String id) {
        postRepository.deleteById(id);
    }
}