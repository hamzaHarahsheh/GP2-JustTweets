package com.Jitter.Jitter.Backend.Controller;

import com.Jitter.Jitter.Backend.Models.User;
import com.Jitter.Jitter.Backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable String id) {
        return userService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        return userService.getByUsername(username)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        return userService.getByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAll();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<User> createUser(
            @RequestPart("user") User user,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) {
        try {
            User savedUser = userService.createUser(user, profilePicture);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (IOException e) {
            throw new RuntimeException("Failed to process profile picture", e);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable String id,
            @RequestBody User updatedUser) {
        return userService.updateUser(id, updatedUser)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/profile-picture")
    public ResponseEntity<User> updateProfilePicture(
            @PathVariable String id,
            @RequestParam("file") MultipartFile file) {
        try {
            return userService.updateProfilePicture(id, file)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IOException e) {
            throw new RuntimeException("Failed to update profile picture", e);
        }
    }

    @PutMapping("/{id}/{field}")
    public ResponseEntity<User> updateField(
            @PathVariable String id,
            @PathVariable String field,
            @RequestBody String value) {
        return userService.updateField(id, field, value)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}