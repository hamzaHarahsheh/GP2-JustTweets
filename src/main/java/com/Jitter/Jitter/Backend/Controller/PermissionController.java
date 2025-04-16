package com.Jitter.Jitter.Backend.Controller;

import com.Jitter.Jitter.Backend.Models.Permission;
import com.Jitter.Jitter.Backend.Repository.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/permissions")
public class PermissionController {

    @Autowired
    private PermissionRepository permissionRepository;

    @PostMapping("/add")
    public Permission addPermission(@RequestBody Permission permission) {
        return permissionRepository.save(permission);
    }

    @GetMapping("/{id}")
    public Optional<Permission> getPermissionById(@PathVariable String id) {
        return permissionRepository.findById(id);
    }

    @GetMapping
    public List<Permission> getAllPermissions() {
        return permissionRepository.findAll();
    }

    @PutMapping("/{id}")
    public Permission updatePermission(@PathVariable String id, @RequestBody Permission updatedPermission) {
        updatedPermission.setId(id);
        return permissionRepository.save(updatedPermission);
    }

    @DeleteMapping("/{id}")
    public void deletePermission(@PathVariable String id) {
        permissionRepository.deleteById(id);
    }
}
