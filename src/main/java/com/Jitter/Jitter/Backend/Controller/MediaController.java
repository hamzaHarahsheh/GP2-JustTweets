package com.Jitter.Jitter.Backend.Controller;

import com.Jitter.Jitter.Backend.Models.Media;
import com.Jitter.Jitter.Backend.Repository.MediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/media")
public class MediaController {

    @Autowired
    private MediaRepository mediaRepo;

    @PostMapping("/add")
    public Media addMedia(@RequestBody Media media) {
        return mediaRepo.save(media);
    }

    @GetMapping("/{id}")
    public Optional<Media> getMediaById(@PathVariable String id) {
        return mediaRepo.findById(id);
    }

    @GetMapping
    public List<Media> getAllMedia() {
        return mediaRepo.findAll();
    }

    @PutMapping("/{id}")
    public Media updateMedia(@PathVariable String id, @RequestBody Media updatedMedia) {
        updatedMedia.setId(id);
        return mediaRepo.save(updatedMedia);
    }

    @DeleteMapping("/{id}")
    public void deleteMedia(@PathVariable String id) {
        mediaRepo.deleteById(id);
    }
}
