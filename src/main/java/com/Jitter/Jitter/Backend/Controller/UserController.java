package com.Jitter.Jitter.Backend.Controller;

import com.Jitter.Jitter.Backend.Models.User;
import com.Jitter.Jitter.Backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepo;


    @GetMapping("/{id}")
    public Optional<User> getUserById(@PathVariable String id) {
        return userRepo.findById(id);
    }

    @GetMapping("/username/{username}")
    public Optional<User> getUserByUsername(@PathVariable String username) {
        return userRepo.findByUsername(username);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @GetMapping("/email/{email}")
    public Optional<User> getUserByEmail(@PathVariable String email) {
        return userRepo.findByEmail(email);
    }

    @PostMapping("/add")
    public User addUser(@RequestBody User user) {
        return userRepo.save(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User updatedUser) {
        return userRepo.findById(id)
                .map(existingUser -> {
                    updatedUser.setId(id);
                    updatedUser.setUpdatedAt(new Date());
                    if (updatedUser.getCreatedAt() == null) {
                        updatedUser.setCreatedAt(existingUser.getCreatedAt());
                    }
                    return ResponseEntity.ok(userRepo.save(updatedUser));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/{field}")
    public ResponseEntity<User> updateFieldInUser(@PathVariable String id, @PathVariable String field, @RequestBody String value) {
        return userRepo.findById(id)
                .map(existingUser -> {
                    switch (field.toLowerCase()) {
                        case "username":
                            existingUser.setUsername(value);
                            break;
                        case "email":
                            existingUser.setEmail(value);
                            break;
                        case "bio":
                            existingUser.setBio(value);
                            break;
                        case "profilepicurl":
                            existingUser.setProfilePicUrl(value);
                            break;
                        case "password":
                            existingUser.setPassword(value);
                            break;
                        default:
                            throw new IllegalArgumentException("Invalid field: " + field);
                    }
                    existingUser.setUpdatedAt(new Date());
                    return ResponseEntity.ok(userRepo.save(existingUser));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable String id) {
        userRepo.deleteById(id);
    }
}
