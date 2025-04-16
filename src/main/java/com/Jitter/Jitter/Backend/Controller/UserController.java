package com.Jitter.Jitter.Backend.Controller;

import com.Jitter.Jitter.Backend.Models.User;
import com.Jitter.Jitter.Backend.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @Autowired
    private UserRepo userRepo;
    @PostMapping("/addUser")
    public void addUser(@RequestBody User users) {
        userRepo.save(users);
    }
}
