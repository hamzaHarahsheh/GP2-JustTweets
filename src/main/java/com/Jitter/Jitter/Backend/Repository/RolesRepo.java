package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RolesRepo extends MongoRepository<Role, String> {

}
