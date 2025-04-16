package com.Jitter.Jitter.Backend.Service;

import com.Jitter.Jitter.Backend.Models.Permission;
import com.Jitter.Jitter.Backend.Repository.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PermissionService {

    @Autowired
    private final PermissionRepository permissionRepository;

    public PermissionService(PermissionRepository permissionRepository) {
        this.permissionRepository = permissionRepository;
    }

    public Optional<Permission> getByType(String type) {
        return permissionRepository.findByType(type);
    }

    public Permission save(Permission permission) {
        return permissionRepository.save(permission);
    }

    public void delete(String id) {
        permissionRepository.deleteById(id);
    }

    public List<Permission> getAll() {
        return permissionRepository.findAll();
    }
}
