package com.Jitter.Jitter.Backend.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.sql.Time;
import java.util.Date;
import java.util.List;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private String id;

    @Indexed(unique = true)
    private String username;
    private String password;
    @Indexed(unique = true)
    private String email;
    private String bio;
    private String profilePicUrl;

    private Date createdAt;
    private Date updatedAt;

    @DBRef(lazy = true)
    List<Role> roles;

    @DBRef(lazy = true)
    List<Permission> permissions;

    @DBRef(lazy = true)
    List<Comment> comments;

    @DBRef(lazy = true)
    List<Like> likes;

    @DBRef(lazy = true)
    List<Notification> notifications;

    @DBRef(lazy = true)
    List<BookMark> bookmarks;

    @DBRef(lazy = true)
    List<Timeline> timelines;

    @DBRef(lazy = true)
    List<Follow> followers;
}
