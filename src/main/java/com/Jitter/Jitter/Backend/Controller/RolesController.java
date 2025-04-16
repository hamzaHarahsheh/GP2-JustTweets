package com.Jitter.Jitter.Backend.Controller;

import com.Jitter.Jitter.Backend.Repository.RolesRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RolesController {

    @Autowired
    private RolesRepo rolesRepo;
}
