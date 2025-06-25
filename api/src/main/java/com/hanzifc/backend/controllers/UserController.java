package com.hanzifc.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.hanzifc.backend.repository.UserRepository;

@RestController
public class UserController {

    // DTOs
    public record UserResponse(String username, String email) { }
    public record UpdateUsernameRequest(String newUsername) {}
    public record UpdateEmailRequest(String newEmail) {}
    public record UpdatePasswordRequest(String currentPassword, String newPassword) {}
    public record UpdateResponse(Boolean success, String message) {}

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/me")
    public UserResponse me() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        var user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        return new UserResponse(user.getUsername(), user.getEmail());
    }

    @PutMapping("/me/username")
    public UpdateResponse updateUsername(@RequestBody UpdateUsernameRequest request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found!"));
        if (userRepository.existsByUsername(request.newUsername())) {
            return new UpdateResponse(false, "Username already exists!");
        }
        user.setUsername(request.newUsername());
        userRepository.save(user);
        return new UpdateResponse(true, "Username updated successfully!");
    }

    @PutMapping("/me/email")
    public UpdateResponse updateEmail(@RequestBody UpdateEmailRequest request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found!"));
        if (userRepository.existsByEmail(request.newEmail())) {
            return new UpdateResponse(false, "Email already exists!");
        }
        user.setEmail(request.newEmail());
        userRepository.save(user);
        return new UpdateResponse(true, "Email updated successfully!");
    }

    @PutMapping("/me/password")
    public UpdateResponse updatePassword(@RequestBody UpdatePasswordRequest request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        var user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found!"));
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            return new UpdateResponse(false, "Current password is incorrect!");
        }
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
        return new UpdateResponse(true, "Password updated successfully!");
    }
}
