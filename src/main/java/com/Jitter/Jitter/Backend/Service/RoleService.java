package com.Jitter.Jitter.Backend.Service;

import com.Jitter.Jitter.Backend.Models.Role;
import com.Jitter.Jitter.Backend.Repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleService {

    @Autowired
    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public Optional<Role> getByType(String type) {
        return roleRepository.findByType(type);
    }

    public Role save(Role role) {
        return roleRepository.save(role);
    }

    public void delete(String id) {
        roleRepository.deleteById(id);
    }

    public List<Role> getAll() {
        return roleRepository.findAll();
    }
}
