package com.Jitter.Jitter.Backend.Controller;

import com.Jitter.Jitter.Backend.Repository.PermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PermissionController {

    @Autowired
    private PermissionRepository permissionRepo;
}
