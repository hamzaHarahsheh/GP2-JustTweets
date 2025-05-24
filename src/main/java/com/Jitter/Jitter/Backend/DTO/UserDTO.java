package com.Jitter.Jitter.Backend.DTO;

import com.Jitter.Jitter.Backend.Models.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private String id;
    private String username;
    private String email;
    private String bio;
    private Object profilePicture;
    private int followers;
    private int following;

    public UserDTO(User user, int followers, int following) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.email = user.getEmail();
        this.bio = user.getBio();
        this.profilePicture = user.getProfilePicture();
        this.followers = followers;
        this.following = following;
    }
} 