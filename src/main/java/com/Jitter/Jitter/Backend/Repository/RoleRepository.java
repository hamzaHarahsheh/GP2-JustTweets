package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RolesRepository extends MongoRepository<Role, String> {

}
