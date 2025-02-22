package com.hanzifc.backend.controllers;

import com.hanzifc.backend.entities.UserEntity;
import com.hanzifc.backend.repository.UserRepository;
import com.hanzifc.backend.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    // DTOs
    public record RegisterRequest(String username, String email, String password) { }
    public record AuthRequest(String usernameOrEmail, String password) { }
    public record RegisterResponse(Boolean success, String message) { }

    @PostMapping("/register")
    public RegisterResponse register(@RequestBody RegisterRequest request) {
        // check if username or email already exists
        if (userRepository.existsByUsername(request.username())) {
            return new RegisterResponse(false, "Username already exists!");
        }
        if (userRepository.existsByEmail(request.email())) {
            return new RegisterResponse(false, "Email already exists!");
        }
        UserEntity newUser = new UserEntity();
        newUser.setUsername(request.username());
        newUser.setEmail(request.email());
        newUser.setPassword(passwordEncoder.encode(request.password()));

        userRepository.save(newUser);
        return new RegisterResponse(true, "User registered successfully!");
    }

    @PostMapping("/login")
    public JwtService.TokenResponse login(@RequestBody AuthRequest request) {
        UserEntity user = userRepository.findByUsername(request.usernameOrEmail())
                .orElseGet(() -> userRepository.findByEmail(request.usernameOrEmail())
                        .orElseThrow(() -> new RuntimeException("User not found!")));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new RuntimeException("Invalid password!");
        }

        return jwtService.generateToken(user.getUsername());
    }
}
