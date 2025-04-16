package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.Permission;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface PermissionRepository extends MongoRepository<Permission, String> {

    Optional<Permission> findByType(String type);
}
