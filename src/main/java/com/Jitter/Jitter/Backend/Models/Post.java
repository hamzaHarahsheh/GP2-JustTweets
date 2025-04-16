package com.Jitter.Jitter.Backend.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;
import java.util.List;

@Document(collation = "posts")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Post {

    @Id
    private String id;

    private String userId;

    private String content;
    private String imageUrl;

    private Date createdAt;
    private Date updatedAt;

    private int likesCount;
    private int commentsCount;

    private int retweetsCount;
    private List<Media> media;

}
