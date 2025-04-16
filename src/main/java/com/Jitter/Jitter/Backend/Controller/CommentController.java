package com.Jitter.Jitter.Backend.Controller;

import com.Jitter.Jitter.Backend.Models.Comment;
import com.Jitter.Jitter.Backend.Repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/comments")
public class CommentController {

    @Autowired
    private CommentRepository commentRepo;

    @PostMapping("/add")
    public Comment addComment(@RequestBody Comment comment) {
        return commentRepo.save(comment);
    }

    @GetMapping("/{id}")
    public Optional<Comment> getCommentById(@PathVariable String id) {
        return commentRepo.findById(id);
    }

    @GetMapping
    public List<Comment> getAllComments() {
        return commentRepo.findAll();
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
