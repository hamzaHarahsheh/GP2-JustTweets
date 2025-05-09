package com.Jitter.Jitter.Backend.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private String id;
    private String postId;
    private String userId;
    private String username;
    private String profilePictureUrl;
    private String content;
    private Date createdAt;
} 