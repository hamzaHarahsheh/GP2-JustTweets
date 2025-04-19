package com.Jitter.Jitter.Backend.Service;

import com.Jitter.Jitter.Backend.Models.Media;
import com.Jitter.Jitter.Backend.Repository.MediaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;
@Service
public class MediaService {
    private final MediaRepository mediaRepository;

    @Autowired
    public MediaService(MediaRepository mediaRepository) {
        this.mediaRepository = mediaRepository;
    }

    public Media saveMedia(MultipartFile file) throws IOException {
        Media media = new Media();
        media.setFileName(file.getOriginalFilename());
        media.setType(file.getContentType());
        media.setData(file.getBytes());
        media.setCreatedAt(new Date());
        return mediaRepository.save(media);
    }

    public void deleteMedia(String id) {
        mediaRepository.deleteById(id);
    }

    public void deleteMultipleMedia(List<Media> mediaList) {
        mediaRepository.deleteAll(mediaList);
    }

    public Optional<Media> getMedia(String id) {
        return mediaRepository.findById(id);
    }
}