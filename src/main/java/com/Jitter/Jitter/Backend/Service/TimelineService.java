package com.Jitter.Jitter.Backend.Service;

import com.Jitter.Jitter.Backend.Models.Timeline;
import com.Jitter.Jitter.Backend.Repository.TimelineRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TimelineService {

    @Autowired
    private final TimelineRepository timelineRepository;

    public TimelineService(TimelineRepository timelineRepository) {
        this.timelineRepository = timelineRepository;
    }

    public Optional<Timeline> getByUserId(String userId) {
        return timelineRepository.findByUserId(userId);
    }

    public Timeline save(Timeline timeline) {
        return timelineRepository.save(timeline);
    }

    public void delete(String id) {
        timelineRepository.deleteById(id);
    }
}
