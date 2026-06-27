
package com.examly.springapp.controller;

import com.examly.springapp.model.User;
import com.examly.springapp.repository.UserRepository;
import com.examly.springapp.dto.UserDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
// import java.util.Optional; // (Unused)

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")

public class AuthController {

    @Value("${app.mentor.key:SECRET_MENTOR_KEY}")
    private String mentorKey;

    @Autowired
    private UserRepository userRepository;

    // --- SIGNUP ---
    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody User user,
            @RequestParam(value = "mentorKey", required = false) String providedMentorKey,
            @RequestParam(value = "mentorId", required = false) Long mentorId) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        // Admin accounts must be created outside public signup.
        if ("ADMIN".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.status(403).body("Admin signup is disabled");
        }
        if ("MENTOR".equalsIgnoreCase(user.getRole())) {
            if (providedMentorKey == null || !providedMentorKey.equals(mentorKey)) {
                return ResponseEntity.status(403).body("Invalid mentor key");
            }
        }
        // Mentor assignment for users
        if ("USER".equalsIgnoreCase(user.getRole()) && mentorId != null) {
            userRepository.findById(mentorId).ifPresent(user::setMentor);
        }
        userRepository.save(user);
        return ResponseEntity.ok("Signup successful");
    }

    // --- LOGIN ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        return userRepository.findByEmail(loginRequest.getEmail())
                .map(user -> {
                    if (user.getPassword().equals(loginRequest.getPassword())) {
                        return ResponseEntity.ok(new UserDTO(user.getId(), user.getName(), user.getRole()));
                    }
                    return ResponseEntity.status(401).body("Invalid credentials");
                })
                .orElseGet(() -> ResponseEntity.status(404).body("User not found"));
    }

    // --- GET ALL USERS ---
    @GetMapping("/users")
    public List<UserDTO> getAllUsers(@RequestParam(value = "mentorId", required = false) Long mentorId) {
        List<User> users = mentorId == null
                ? userRepository.findAll()
                : userRepository.findByMentorId(mentorId);

        return users.stream()
                .map(u -> new UserDTO(u.getId(), u.getName(), u.getRole(),
                        u.getMentor() != null ? u.getMentor().getId() : null))
                .toList();
    }

    // --- GET USER BY EMAIL ---
    @GetMapping("/user")
    public ResponseEntity<?> getUserByEmail(@RequestParam String email) {
        return userRepository.findByEmail(email)
                .map(u -> ResponseEntity.ok(new UserDTO(u.getId(), u.getName(), u.getRole(),
                        u.getMentor() != null ? u.getMentor().getId() : null)))
                .orElseGet(() -> ResponseEntity.status(404).body(null));
    }

    // --- GET ALL MENTORS ---
    @GetMapping("/mentors")
    public List<UserDTO> getAllMentors() {
        return userRepository.findByRole("MENTOR").stream()
                .map(u -> new UserDTO(u.getId(), u.getName(), u.getRole(), null))
                .toList();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id,
            @RequestParam(value = "requesterRole", required = false) String requesterRole) {
        if (!"ADMIN".equalsIgnoreCase(requesterRole)) {
            return ResponseEntity.status(403).body("Only admins can delete users");
        }

        return userRepository.findById(id)
                .map(user -> {
                    if ("ADMIN".equalsIgnoreCase(user.getRole())) {
                        return ResponseEntity.status(403).body("Admin accounts cannot be deleted here");
                    }

                    userRepository.findByMentorId(id).forEach(mentee -> {
                        mentee.setMentor(null);
                        userRepository.save(mentee);
                    });
                    userRepository.delete(user);
                    return ResponseEntity.ok("User deleted successfully");
                })
                .orElseGet(() -> ResponseEntity.status(404).body("User not found"));
    }

}
