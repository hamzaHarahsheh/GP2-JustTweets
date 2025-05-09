package com.Jitter.Jitter.Backend.Controller;

import com.Jitter.Jitter.Backend.Models.Comment;
import com.Jitter.Jitter.Backend.DTO.CommentDTO;
import com.Jitter.Jitter.Backend.Models.User;
import com.Jitter.Jitter.Backend.Repository.CommentRepository;
import com.Jitter.Jitter.Backend.Service.CommentService;
import com.Jitter.Jitter.Backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @PostMapping("/add")
    public CommentDTO addComment(@RequestBody Comment comment, Principal principal) {
        String username = principal.getName();
        User user = userService.getByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found for username: " + username));
        comment.setUserId(user.getId());
        comment.setCreatedAt(new Date());
        Comment saved = commentRepo.save(comment);
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
    public Comment updateComment(@PathVariable String id, @RequestBody Comment updatedComment) {
        updatedComment.setId(id);
        return commentRepo.save(updatedComment);
    }

    @DeleteMapping("/{id}")
    public void deleteComment(@PathVariable String id) {
        commentRepo.deleteById(id);
    }
}
