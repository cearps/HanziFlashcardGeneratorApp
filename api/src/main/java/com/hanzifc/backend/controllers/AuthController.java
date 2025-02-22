package com.hanzifc.backend.controllers;

import com.hanzifc.backend.entities.UserEntity;
import com.hanzifc.backend.repository.UserRepository;
import com.hanzifc.backend.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authManager;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    // DTOs
    public static record RegisterRequest(String username, String password) { }
    public static record AuthRequest(String usernameOrEmail, String password) { }
    public static record AuthResponse(String token) { }

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        UserEntity newUser = new UserEntity();
        newUser.setUsername(request.username());
        newUser.setEmail(request.username());
        newUser.setPassword(passwordEncoder.encode(request.password()));

        userRepository.save(newUser);
        return "User registered successfully!";
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody AuthRequest request) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.usernameOrEmail(),
                        request.password()
                )
        );

        String token = jwtService.generateToken(request.usernameOrEmail());
        return new AuthResponse(token);
    }
}
