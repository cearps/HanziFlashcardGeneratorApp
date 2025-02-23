package com.hanzifc.backend.controllers;

import com.hanzifc.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    // DTOs
    public record UserResponse(String username, String email) { }

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/me")
    public UserResponse me() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        var user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found!"));

        return new UserResponse(user.getUsername(), user.getEmail());
    }


}
