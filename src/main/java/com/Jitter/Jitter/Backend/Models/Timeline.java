package com.Jitter.Jitter.Backend.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collation = "timeline")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Timeline {

    @Id
    private String userId;
    private String postId;

    private List<String> postIds;

}
