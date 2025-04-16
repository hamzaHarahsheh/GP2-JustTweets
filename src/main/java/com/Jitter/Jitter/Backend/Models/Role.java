package com.Jitter.Jitter.Backend.Models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collation = "roles")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Role {

    @Id
    private String id;
    private String type;

}
