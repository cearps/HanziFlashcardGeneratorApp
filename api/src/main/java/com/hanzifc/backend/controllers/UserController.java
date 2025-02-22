package com.hanzifc.backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    @GetMapping("/me")
    public String me() {
        return "Hello, World!";
    }

}
