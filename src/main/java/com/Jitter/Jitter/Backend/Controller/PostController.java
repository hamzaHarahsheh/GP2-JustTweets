package com.Jitter.Jitter.Backend.Controller;

import com.Jitter.Jitter.Backend.Repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class PostController {

    @Autowired
    private PostRepository postRepo;
}
