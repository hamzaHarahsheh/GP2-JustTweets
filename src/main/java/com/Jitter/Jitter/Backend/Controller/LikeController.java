package com.Jitter.Jitter.Backend.Controller;

import com.Jitter.Jitter.Backend.Models.Like;
import com.Jitter.Jitter.Backend.Repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/likes")
public class LikeController {

    @Autowired
    private LikeRepository likeRepo;

    @PostMapping("/add")
    public Like addLike(@RequestBody Like like) {
        return likeRepo.save(like);
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
}
