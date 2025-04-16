package com.Jitter.Jitter.Backend.Controller;

import com.Jitter.Jitter.Backend.Repository.LikeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LikeController {

    @Autowired
    private LikeRepo likeRepo;

}
