package com.Jitter.Jitter.Backend.Utility;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MediaDTO {
    private String id;
    private String postId;
    private String url;
    private String fileName;
    private String type;
    private Date createdAt;
}