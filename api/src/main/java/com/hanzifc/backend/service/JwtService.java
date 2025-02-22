package com.hanzifc.backend.service;

import com.hanzifc.backend.security.JwtKeyConfig;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    private final Key signingKey = new JwtKeyConfig().signingKey();

    // DTOs
    public record TokenResponse(String token, long expiry) { }

    public TokenResponse generateToken(String username) {
        long now = System.currentTimeMillis();
        long expiry = now + (1000 * 60 * 60 * 24); // 24 hours

        String token = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date(now))
                .setExpiration(new Date(expiry))
                .signWith(signingKey, SignatureAlgorithm.HS256)
                .compact();

        return new TokenResponse(token, expiry);
    }

    public String extractUsername(String token) {
        return getClaims(token).getSubject();
    }

    public boolean isTokenValid(String token) {
        try {
            Claims claims = getClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(signingKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
