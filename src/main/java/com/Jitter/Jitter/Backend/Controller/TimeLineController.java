package com.Jitter.Jitter.Backend.Controller;


import com.Jitter.Jitter.Backend.Models.Timeline;
import com.Jitter.Jitter.Backend.Repository.TimelineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/timelines")
public class TimeLineController {

    @Autowired
    private TimelineRepository timeLineRepo;

    @PostMapping("/add")
    public Timeline addTimeline(@RequestBody Timeline timeline) {
        return timeLineRepo.save(timeline);
    }

    @GetMapping("/{id}")
    public Optional<Timeline> getTimelineById(@PathVariable String id) {
        return timeLineRepo.findById(id);
    }

    @GetMapping("/user/{userId}")
    public Optional<Timeline> getTimelineByUserId(@PathVariable String userId) {
        return timeLineRepo.findByUserId(userId);
    }

    @GetMapping
    public List<Timeline> getAllTimelines() {
        return timeLineRepo.findAll();
    }

    @PutMapping("/{id}")
    public Timeline updateTimeline(@PathVariable String id, @RequestBody Timeline updatedTimeline) {
        updatedTimeline.setUserId(id);
        return timeLineRepo.save(updatedTimeline);
    }

    @DeleteMapping("/{id}")
    public void deleteTimeline(@PathVariable String id) {
        timeLineRepo.deleteById(id);
    }
}