package com.Jitter.Jitter.Backend.Service;

import com.Jitter.Jitter.Backend.Models.Like;
import com.Jitter.Jitter.Backend.Repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class LikeService {

    @Autowired
    private final LikeRepository likeRepository;

    public LikeService(LikeRepository likeRepository) {
        this.likeRepository = likeRepository;
    }

    public List<Like> getByPostId(String postId) {
        return likeRepository.findByPostId(postId);
    }

    public Optional<Like> getByUserAndPost(String userId, String postId) {
        return likeRepository.findByPostIdAndUserId(postId, userId);
    }

    public Like save(Like like) {
        return likeRepository.save(like);
    }

    public void delete(String id) {
        likeRepository.deleteById(id);
    }
}
