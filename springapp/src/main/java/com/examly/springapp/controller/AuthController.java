package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")

public class AuthController {

    @Autowired
    private UserRepository userRepository;

    // --- SIGNUP ---
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        userRepository.save(user);
        return ResponseEntity.ok("Signup successful");
    }

    // --- LOGIN ---
    @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody User loginRequest) {
    return userRepository.findByEmail(loginRequest.getEmail())
            .map(user -> {
                // ⚡ If password is plain text (not encoded):
                if (user.getPassword().equals(loginRequest.getPassword())) {
                    return ResponseEntity.ok(user);
                }

                // ⚡ If you are using PasswordEncoder:
                // if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                //     return ResponseEntity.ok(user);
                // }

                return ResponseEntity.status(401).body("Invalid credentials");
            })
            .orElseGet(() -> ResponseEntity.status(404).body("User not found"));
}


    // --- GET ALL USERS ---
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // --- GET USER BY EMAIL ---
   @GetMapping("/user")
public ResponseEntity<?> getUserByEmail(@RequestParam String email) {
    return userRepository.findByEmail(email)
            .<ResponseEntity<?>>map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.status(404).body("User not found"));
}

}
