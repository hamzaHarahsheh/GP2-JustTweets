package com.Jitter.Jitter.Backend.Models;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

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
    @Pattern(regexp = "^[A-Za-z]+\\d{2}@[A-Za-z]+\\.just\\.edu\\.jo$",
             message = "Email must be in the format username##@[any letters].just.edu.jo")
    private String email;

    private String bio;
    private Media profilePicture;
    private Date createdAt;
    private Date updatedAt;
}
