package com.Jitter.Jitter.Backend.Service;

import com.Jitter.Jitter.Backend.Models.Media;
import com.Jitter.Jitter.Backend.Models.User;
import com.Jitter.Jitter.Backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final MediaService mediaService;

    @Autowired
    public UserService(UserRepository userRepository, MediaService mediaService) {
        this.userRepository = userRepository;
        this.mediaService = mediaService;
    }

    public List<User> getAll() {
        return userRepository.findAll();
    }

    public Optional<User> getById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> getByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public Optional<User> getByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User createUser(User user, MultipartFile profilePicture) throws IOException {
        user.setCreatedAt(new Date());
        user.setUpdatedAt(new Date());

        if (profilePicture != null && !profilePicture.isEmpty()) {
            Media media = mediaService.saveMedia(profilePicture);
            user.setProfilePicture(media);
        }

        return userRepository.save(user);
    }

    public Optional<User> updateUser(String id, User updatedUser) {
        return userRepository.findById(id)
                .map(existingUser -> {
                    updatedUser.setId(id);
                    updatedUser.setUpdatedAt(new Date());
                    if (updatedUser.getCreatedAt() == null) {
                        updatedUser.setCreatedAt(existingUser.getCreatedAt());
                    }
                    if (updatedUser.getProfilePicture() == null) {
                        updatedUser.setProfilePicture(existingUser.getProfilePicture());
                    }
                    return userRepository.save(updatedUser);
                });
    }

    public Optional<User> updateProfilePicture(String id, MultipartFile file) throws IOException {
        return userRepository.findById(id)
                .map(user -> {
                    try {
                        // Delete old profile picture if exists
                        if (user.getProfilePicture() != null) {
                            mediaService.deleteMedia(user.getProfilePicture().getId());
                        }

                        Media media = mediaService.saveMedia(file);
                        user.setProfilePicture(media);
                        user.setUpdatedAt(new Date());
                        return userRepository.save(user);
                    } catch (IOException e) {
                        throw new RuntimeException("Failed to process profile picture", e);
                    }
                });
    }

    public Optional<User> updateField(String id, String field, String value) {
        return userRepository.findById(id)
                .map(user -> {
                    switch (field.toLowerCase()) {
                        case "username":
                            user.setUsername(value);
                            break;
                        case "email":
                            user.setEmail(value);
                            break;
                        case "bio":
                            user.setBio(value);
                            break;
                        case "password":
                            user.setPassword(value);
                            break;
                        default:
                            throw new IllegalArgumentException("Invalid field: " + field);
                    }
                    user.setUpdatedAt(new Date());
                    return userRepository.save(user);
                });
    }

    public void delete(String id) {
        userRepository.findById(id).ifPresent(user -> {
            if (user.getProfilePicture() != null) {
                mediaService.deleteMedia(user.getProfilePicture().getId());
            }
            userRepository.deleteById(id);
        });
    }
}