package com.Jitter.Jitter;

import com.Jitter.Jitter.Backend.Models.Role;
import com.Jitter.Jitter.Backend.Models.User;
import com.Jitter.Jitter.Backend.Repository.RoleRepository;
import com.Jitter.Jitter.Backend.Repository.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@SpringBootApplication
public class JitterApplication {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RoleRepository roleRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(JitterApplication.class, args);
	}

	@PostConstruct
	public void createDefaultAdmin() {
		try {
			boolean adminExists = userRepository.findAll().stream()
				.anyMatch(user -> roleRepository.findByUserId(user.getId()).stream()
					.anyMatch(role -> "ADMIN".equals(role.getType())));

			if (!adminExists) {
				User adminUser = new User();
				adminUser.setUsername("admin");
				adminUser.setEmail("admin01@cit.just.edu.jo");
				adminUser.setPassword(passwordEncoder.encode("AdminPassword123"));
				adminUser.setBio("System Administrator");

				User savedUser = userRepository.save(adminUser);

				Role adminRole = new Role();
				adminRole.setType("ADMIN");
				adminRole.setUserId(savedUser.getId());
				roleRepository.save(adminRole);
			}
		} catch (Exception e) {
		}
	}
}
