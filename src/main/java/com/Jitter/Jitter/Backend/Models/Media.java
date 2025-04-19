package com.Jitter.Jitter.Backend.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "media")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Media {

    @Id
    private String id;
    private String postId;

    private String type;
    private String fileName;
    private byte[] data;
    private Date createdAt;
}
