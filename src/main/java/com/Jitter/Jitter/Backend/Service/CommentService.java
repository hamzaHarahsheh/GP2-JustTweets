package com.Jitter.Jitter.Backend.Service;

import com.Jitter.Jitter.Backend.Models.Comment;
import com.Jitter.Jitter.Backend.Models.CommentDTO;
import com.Jitter.Jitter.Backend.Models.User;
import com.Jitter.Jitter.Backend.Repository.CommentRepository;
import com.Jitter.Jitter.Backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
public class CommentService {

    @Autowired
    private final CommentRepository commentRepository;

    @Autowired
    private final UserRepository userRepository;

    public CommentService(CommentRepository commentRepository, UserRepository userRepository) {
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
    }

    public List<CommentDTO> getEnrichedByPostId(String postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        List<CommentDTO> enriched = new ArrayList<>();
        for (Comment comment : comments) {
            Optional<User> userOpt = userRepository.findById(comment.getUserId());
            String username = userOpt.map(User::getUsername).orElse("Unknown");
            String profilePictureUrl = userOpt.isPresent() && userOpt.get().getProfilePicture() != null && userOpt.get().getProfilePicture().getData() != null
                    ? "/users/" + userOpt.get().getId() + "/profile-picture"
                    : null;
            enriched.add(new CommentDTO(
                    comment.getId(),
                    comment.getPostId(),
                    comment.getUserId(),
                    username,
                    profilePictureUrl,
                    comment.getContent(),
                    comment.getCreatedAt()
            ));
        }
        return enriched;
    }

    public List<Comment> getByUserId(String userId) {
        return commentRepository.findByUserId(userId);
    }

    public Comment save(Comment comment) {
        return commentRepository.save(comment);
    }

    public void delete(String id) {
        commentRepository.deleteById(id);
    }
}
