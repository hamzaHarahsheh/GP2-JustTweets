package com.Jitter.Jitter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.Jitter.Jitter.Backend.Models.User;
import com.Jitter.Jitter.Backend.Models.Role;
import com.Jitter.Jitter.Backend.Repository.UserRepository;
import com.Jitter.Jitter.Backend.Repository.RoleRepository;
import java.util.Date;

@SpringBootApplication
@EnableMongoRepositories
public class JitterApplication implements CommandLineRunner {

	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private RoleRepository roleRepository;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	public static void main(String[] args) {
		SpringApplication.run(JitterApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		createAdminUserIfNotExists();
	}

	private void createAdminUserIfNotExists() {
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
				adminUser.setCreatedAt(new Date());
				adminUser.setUpdatedAt(new Date());

				User savedUser = userRepository.save(adminUser);

				Role adminRole = new Role();
				adminRole.setType("ADMIN");
				adminRole.setUserId(savedUser.getId());
				roleRepository.save(adminRole);

				System.out.println("✅ Admin user created automatically!");
				System.out.println("👤 Username: admin");
				System.out.println("🔑 Password: AdminPassword123");
				System.out.println("📧 Email: admin01@cit.just.edu.jo");
			} else {
				System.out.println("ℹ️  Admin user already exists, skipping creation.");
			}
		} catch (Exception e) {
			System.err.println("❌ Error creating admin user: " + e.getMessage());
		}
	}
}
