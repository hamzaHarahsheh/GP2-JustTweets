package com.Jitter.Jitter.Backend.Service;

import com.Jitter.Jitter.Backend.Models.Follow;
import com.Jitter.Jitter.Backend.Repository.FollowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class FollowService {

    @Autowired
    private final FollowRepository followRepository;

    public FollowService(FollowRepository followRepository) {
        this.followRepository = followRepository;
    }

    public List<Follow> getFollowers(String userId) {
        return followRepository.findByFollowingId(userId);
    }

    public List<Follow> getFollowing(String userId) {
        return followRepository.findByFollowerId(userId);
    }

    public Optional<Follow> getFollowRelation(String followerId, String followingId) {
        return followRepository.findByFollowerIdAndFollowingId(followerId, followingId);
    }

    public Follow save(Follow follow) {
        return followRepository.save(follow);
    }

    public void delete(String id) {
        followRepository.deleteById(id);
    }

    public boolean deleteByFollowerAndFollowing(String followerId, String followingId) {
        Optional<Follow> relation = followRepository.findByFollowerIdAndFollowingId(followerId, followingId);
        if (relation.isPresent()) {
            followRepository.deleteById(relation.get().getId());
            return true;
        }
        return false;
    }
}
