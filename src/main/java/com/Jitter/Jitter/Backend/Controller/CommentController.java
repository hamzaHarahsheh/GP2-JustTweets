package com.Jitter.Jitter.Backend.Controller;

import com.Jitter.Jitter.Backend.Models.Comment;
import com.Jitter.Jitter.Backend.Models.Post;
import com.Jitter.Jitter.Backend.Models.Follow;
import com.Jitter.Jitter.Backend.DTO.CommentDTO;
import com.Jitter.Jitter.Backend.Models.User;
import com.Jitter.Jitter.Backend.Models.Role;
import com.Jitter.Jitter.Backend.Repository.CommentRepository;
import com.Jitter.Jitter.Backend.Repository.PostRepository;
import com.Jitter.Jitter.Backend.Repository.RoleRepository;
import com.Jitter.Jitter.Backend.Service.CommentService;
import com.Jitter.Jitter.Backend.Service.NotificationService;
import com.Jitter.Jitter.Backend.Service.FollowService;
import com.Jitter.Jitter.Backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/comments")
public class CommentController {

    @Autowired
    private CommentRepository commentRepo;

    @Autowired
    private CommentService commentService;

    @Autowired
    private UserService userService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private FollowService followService;

    @Autowired
    private RoleRepository roleRepository;

    @PostMapping("/add")
    public CommentDTO addComment(@RequestBody Comment comment, Principal principal) {
        String username = principal.getName();
        User user = userService.getByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found for username: " + username));
        comment.setUserId(user.getId());
        comment.setCreatedAt(new Date());
        Comment saved = commentRepo.save(comment);
        
        Post post = postRepository.findById(comment.getPostId()).orElse(null);
        if (post != null && !post.getUserId().equals(user.getId())) {
            notificationService.createNotification(post.getUserId(), "COMMENT", user.getId(), post.getId(), saved.getId(), null);
        }
        
        List<Follow> followers = followService.getFollowers(user.getId());
        for (Follow follow : followers) {
            if (!follow.getFollowerId().equals(user.getId()) && 
                (post == null || !follow.getFollowerId().equals(post.getUserId()))) {
                notificationService.createNotification(
                    follow.getFollowerId(), 
                    "FRIEND_COMMENT", 
                    user.getId(), 
                    post != null ? post.getId() : null, 
                    saved.getId(), 
                    null
                );
            }
        }
        
        String profilePictureUrl = user.getProfilePicture() != null && user.getProfilePicture().getData() != null
                ? "/users/" + user.getId() + "/profile-picture"
                : null;
        return new CommentDTO(
            saved.getId(),
            saved.getPostId(),
            saved.getUserId(),
            user.getUsername(),
            profilePictureUrl,
            saved.getContent(),
            saved.getCreatedAt()
        );
    }

    @GetMapping("/{id}")
    public Optional<Comment> getCommentById(@PathVariable String id) {
        return commentRepo.findById(id);
    }

    @GetMapping
    public List<Comment> getAllComments() {
        return commentRepo.findAll();
    }

    @GetMapping("/post/{postId}")
    public List<CommentDTO> getCommentsByPostId(@PathVariable String postId) {
        return commentService.getEnrichedByPostId(postId);
    }

    @GetMapping("/user/{userId}")
    public List<Comment> getCommentsByUserId(@PathVariable String userId) {
        return commentRepo.findByUserId(userId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(@PathVariable String id, @RequestBody Comment updatedComment, Principal principal) {
        String username = principal.getName();
        User currentUser = userService.getByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found for username: " + username));

        Optional<Comment> existingCommentOpt = commentRepo.findById(id);
        if (!existingCommentOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Comment existingComment = existingCommentOpt.get();
        
        boolean canEdit = false;
        if (existingComment.getUserId().equals(currentUser.getId())) {
            canEdit = true;
        } else {
            List<Role> roles = roleRepository.findByUserId(currentUser.getId());
            canEdit = roles.stream().anyMatch(role -> "ADMIN".equals(role.getType()));
        }

        if (!canEdit) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("You don't have permission to edit this comment");
        }

        existingComment.setContent(updatedComment.getContent());
        Comment saved = commentRepo.save(existingComment);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable String id, Principal principal) {
        String username = principal.getName();
        User currentUser = userService.getByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found for username: " + username));

        Optional<Comment> existingCommentOpt = commentRepo.findById(id);
        if (!existingCommentOpt.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Comment existingComment = existingCommentOpt.get();
        
        boolean canDelete = false;
        
        if (existingComment.getUserId().equals(currentUser.getId())) {
            canDelete = true;
        } else {
            Optional<Post> postOpt = postRepository.findById(existingComment.getPostId());
            if (postOpt.isPresent() && postOpt.get().getUserId().equals(currentUser.getId())) {
                canDelete = true;
            } else {
                List<Role> roles = roleRepository.findByUserId(currentUser.getId());
                canDelete = roles.stream().anyMatch(role -> "ADMIN".equals(role.getType()));
            }
        }

        if (!canDelete) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body("You don't have permission to delete this comment");
        }

        commentRepo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
