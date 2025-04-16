package com.Jitter.Jitter.Backend.Service;

import com.Jitter.Jitter.Backend.Models.Post;
import com.Jitter.Jitter.Backend.Repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    @Autowired
    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public List<Post> getAllByUser(String userId) {
        return postRepository.findByUserId(userId);
    }

    public Optional<Post> getById(String id) {
        return postRepository.findById(id);
    }

    public Post save(Post post) {
        return postRepository.save(post);
    }

    public void delete(String id) {
        postRepository.deleteById(id);
    }
}
