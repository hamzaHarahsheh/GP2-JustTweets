package com.Jitter.Jitter.Backend.Controller;

import com.Jitter.Jitter.Backend.Models.Follow;
import com.Jitter.Jitter.Backend.Repository.FollowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/follows")
public class FollowController {

    @Autowired
    private FollowRepository followRepo;

    @PostMapping("/add")
    public Follow addFollow(@RequestBody Follow follow) {
        return followRepo.save(follow);
    }

    @GetMapping("/{id}")
    public Optional<Follow> getFollowById(@PathVariable String id) {
        return followRepo.findById(id);
    }

    @GetMapping
    public List<Follow> getAllFollows() {
        return followRepo.findAll();
    }

    @PutMapping("/{id}")
    public Follow updateFollow(@PathVariable String id, @RequestBody Follow updatedFollow) {
        updatedFollow.setId(id);
        return followRepo.save(updatedFollow);
    }

    @DeleteMapping("/{id}")
    public void deleteFollow(@PathVariable String id) {
        followRepo.deleteById(id);
    }
}
