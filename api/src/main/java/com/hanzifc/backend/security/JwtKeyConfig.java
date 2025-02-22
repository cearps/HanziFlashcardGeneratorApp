package com.hanzifc.backend.security;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.security.Key;

@Configuration
public class JwtKeyConfig {

    @Bean
    public Key signingKey() {
        return Keys.secretKeyFor(SignatureAlgorithm.HS256);
    }
}
