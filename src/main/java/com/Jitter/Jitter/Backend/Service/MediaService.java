package com.Jitter.Jitter.Backend.Service;

import com.Jitter.Jitter.Backend.Models.Media;
import com.Jitter.Jitter.Backend.Repository.MediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MediaService {

    @Autowired
    private final MediaRepository mediaRepository;

    public MediaService(MediaRepository mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    public List<Media> getByPostId(String postId) {
        return mediaRepository.findByPostId(postId);
    }

    public Media save(Media media) {
        return mediaRepository.save(media);
    }

    public void delete(String id) {
        mediaRepository.deleteById(id);
    }
}
