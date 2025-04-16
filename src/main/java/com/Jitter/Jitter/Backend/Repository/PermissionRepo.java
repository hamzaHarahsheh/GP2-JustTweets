package com.Jitter.Jitter.Backend.Repository;

import com.Jitter.Jitter.Backend.Models.Permission;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface PermissionRepo extends MongoRepository<Permission, String> {

}
