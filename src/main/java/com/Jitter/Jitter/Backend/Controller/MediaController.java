package com.Jitter.Jitter.Backend.Controller;

import com.Jitter.Jitter.Backend.Models.Media;
import com.Jitter.Jitter.Backend.Repository.MediaRepository;
import com.Jitter.Jitter.Backend.Utility.MediaDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/media")
@CrossOrigin(origins = "http://localhost:3000")
public class MediaController {

    @Autowired
    private MediaRepository mediaRepo;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadMedia(
                                           @RequestParam("file") MultipartFile file,
                                           @RequestParam(value = "postId", required = false) String postId) {

        try {
            System.out.println("Received file: " + file.getOriginalFilename());
            System.out.println("Content type: " + file.getContentType());
            System.out.println("File size: " + file.getSize());

            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body("File cannot be empty");
            }

            Media media = new Media();
            media.setFileName(file.getOriginalFilename());
            media.setType(file.getContentType());
            media.setData(file.getBytes());
            media.setCreatedAt(new Date());
            media.setPostId(postId);

            Media savedMedia = mediaRepo.save(media);
            return new ResponseEntity<>(savedMedia, HttpStatus.CREATED);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to process file: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMediaById(@PathVariable String id) {
        Optional<Media> media = mediaRepo.findById(id);
        if (media.isPresent()) {
            Media mediaFile = media.get();
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(mediaFile.getType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + mediaFile.getFileName() + "\"")
                    .body(mediaFile.getData());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<MediaDTO>> getMediaByPostId(@PathVariable String postId) {
        List<Media> mediaList = mediaRepo.findByPostId(postId);
        List<MediaDTO> mediaDTOs = mediaList.stream()
                .map(media -> new MediaDTO(
                        media.getId(),
                        media.getPostId(),
                        "/media/" + media.getId(),
                        media.getFileName(),
                        media.getType(),
                        media.getCreatedAt()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(mediaDTOs);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedia(@PathVariable String id) {
        if (mediaRepo.existsById(id)) {
            mediaRepo.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Media> updateMedia(
            @PathVariable String id,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "postId", required = false) String postId) throws IOException {

        Optional<Media> existingMedia = mediaRepo.findById(id);
        if (existingMedia.isPresent()) {
            Media media = existingMedia.get();

            if (file != null) {
                media.setFileName(file.getOriginalFilename());
                media.setType(file.getContentType());
                media.setData(file.getBytes());
            }

            if (postId != null) {
                media.setPostId(postId);
            }

            media.setCreatedAt(new Date());
            return ResponseEntity.ok(mediaRepo.save(media));
        }

        return ResponseEntity.notFound().build();
    }
}
