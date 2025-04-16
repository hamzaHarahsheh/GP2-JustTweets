package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.Roles;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RolesRepo extends MongoRepository<Roles, String> {

}
