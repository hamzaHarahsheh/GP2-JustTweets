package com.Jitter.Jitter.Backend.Controller;

import com.Jitter.Jitter.Backend.Models.Role;
import com.Jitter.Jitter.Backend.Repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/roles")
public class RoleController {

    @Autowired
    private RoleRepository roleRepository;

    @PostMapping("/add")
    public Role addRole(@RequestBody Role role) {
        return roleRepository.save(role);
    }

    @GetMapping("/{id}")
    public Optional<Role> getRoleById(@PathVariable String id) {
        return roleRepository.findById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Role> getRolesByUserId(@PathVariable String userId) {
        return roleRepository.findByUserId(userId);
    }

    @GetMapping
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    @PutMapping("/{id}")
    public Role updateRole(@PathVariable String id, @RequestBody Role updatedRole) {
        updatedRole.setId(id);
        return roleRepository.save(updatedRole);
    }

    @DeleteMapping("/{id}")
    public void deleteRole(@PathVariable String id) {
        roleRepository.deleteById(id);
    }
}
