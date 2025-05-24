package com.Jitter.Jitter.Backend.Controller;

import com.Jitter.Jitter.Backend.DTO.LoginDTO;
import com.Jitter.Jitter.Backend.DTO.LoginResponseDTO;
import com.Jitter.Jitter.Backend.Models.Role;
import com.Jitter.Jitter.Backend.Models.User;
import com.Jitter.Jitter.Backend.Repository.RoleRepository;
import com.Jitter.Jitter.Backend.Security.JWTGenerator;
import com.Jitter.Jitter.Backend.Service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.Jitter.Jitter.Backend.Models.Follow;
import java.security.Principal;
import com.Jitter.Jitter.Backend.DTO.UserDTO;
import com.Jitter.Jitter.Backend.Service.NotificationService;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JWTGenerator jwtGenerator;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private NotificationService notificationService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable String id) {
        return userService.getById(id)
                .map(user -> new UserDTO(user, userService.getFollowers(id).size(), userService.getFollowing(id).size()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
        return userService.getByUsername(username)
                .map(user -> new UserDTO(user, userService.getFollowers(user.getId()).size(), userService.getFollowing(user.getId()).size()))
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        return userService.getByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping(path = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createUser(
            @RequestPart("user") String userJson,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) {
        try {
            User user = objectMapper.readValue(userJson, User.class);
            
            // Basic validation
            if (user.getPassword() == null || user.getPassword().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Password is required");
            }
            if (user.getUsername() == null || user.getUsername().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Username is required");
            }
            if (user.getEmail() == null || user.getEmail().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Email is required");
            }

            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User savedUser = userService.createUser(user, profilePicture);
            Role role = new Role();
            role.setType("USER");
            role.setUserId(savedUser.getId());
            roleRepository.save(role);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Username already exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Username is already taken");
            }
            if (e.getMessage().equals("Email already exists")) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Email is already registered");
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Registration failed: " + e.getMessage());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to process profile picture or user data");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getUsername(),
                        loginDTO.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = jwtGenerator.generateToken(authentication);

        User user = userService.getByUsername(loginDTO.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        LoginResponseDTO response = new LoginResponseDTO(token);

        return ResponseEntity.ok()
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + token)
                .body(response);
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

    @GetMapping("/{id}/profile-picture")
    public ResponseEntity<?> getProfilePicture(@PathVariable String id) {
        return userService.getById(id)
                .map(user -> {
                    if (user.getProfilePicture() == null || user.getProfilePicture().getData() == null) {
                        return ResponseEntity.notFound().build();
                    }
                    return ResponseEntity.ok()
                            .contentType(MediaType.parseMediaType(user.getProfilePicture().getType()))
                            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + id + "\"")
                            .body(user.getProfilePicture().getData());
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/following")
    public List<User> getFollowing(@PathVariable String id) {
        return userService.getFollowing(id);
    }

    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam("q") String query) {
        return userService.searchByUsernameOrEmail(query);
    }

    @PostMapping("/follow/{userId}")
    public ResponseEntity<?> followUser(@PathVariable String userId, Principal principal) {
        String followerUsername = principal.getName();
        User follower = userService.getByUsername(followerUsername).orElse(null);
        if (follower == null || follower.getId().equals(userId)) {
            return ResponseEntity.badRequest().body("Invalid follow request");
        }
        boolean success = userService.followUser(follower.getId(), userId);
        if (!success) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Already following");
        }
        notificationService.createNotification(userId, "FOLLOW", follower.getId(), null, null, null);
        int followersCount = userService.getFollowers(userId).size();
        int followingCount = userService.getFollowing(follower.getId()).size();
        return ResponseEntity.ok(new java.util.HashMap<>() {{
            put("followersCount", followersCount);
            put("followingCount", followingCount);
        }});
    }

    @PostMapping("/unfollow/{userId}")
    public ResponseEntity<?> unfollowUser(@PathVariable String userId, Principal principal) {
        String followerUsername = principal.getName();
        User follower = userService.getByUsername(followerUsername).orElse(null);
        if (follower == null || follower.getId().equals(userId)) {
            return ResponseEntity.badRequest().body("Invalid unfollow request");
        }
        boolean success = userService.unfollowUser(follower.getId(), userId);
        if (!success) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Not following");
        }
        int followersCount = userService.getFollowers(userId).size();
        int followingCount = userService.getFollowing(follower.getId()).size();
        return ResponseEntity.ok(new java.util.HashMap<>() {{
            put("followersCount", followersCount);
            put("followingCount", followingCount);
        }});
    }

    @GetMapping("/{id}/followers")
    public List<User> getFollowers(@PathVariable String id) {
        return userService.getFollowers(id);
    }
}