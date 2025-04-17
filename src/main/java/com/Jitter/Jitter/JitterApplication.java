package com.Jitter.Jitter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@SpringBootApplication
@EnableMongoRepositories
public class JitterApplication {

	public static void main(String[] args) {
		SpringApplication.run(JitterApplication.class, args);
	}

}
