package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.Role;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface RoleRepository extends MongoRepository<Role, String> {

    Optional<Role> findByType(String type);
    List<Role> findByUserId(String userId);
}
