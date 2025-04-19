package com.Jitter.Jitter.Backend.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "likes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Like {

    @Id
    private String id;

    private String userId;
    private String postId;

    private Date createdAt;
}
