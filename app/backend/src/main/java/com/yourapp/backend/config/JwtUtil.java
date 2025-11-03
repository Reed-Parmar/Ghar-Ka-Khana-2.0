package com.yourapp.backend.config;


import com.yourapp.backend.model.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtil {

    private final Key key;
    private final long expirationMs;

    public JwtUtil(@Value("${jwt.secret}") String secret, @Value("${jwt.expirationMs}") long expirationMs) {
        // In production, store secret safely and decode/base64 if needed. Support several formats:
        // - If property starts with "base64:", decode the remainder as base64 bytes.
        // - If provided plain text shorter than 32 bytes, derive a 256-bit key using SHA-256.
        // - If null/empty, generate a secure random key (not suitable for multi-instance deployments).
        try {
            if (secret == null || secret.trim().isEmpty()) {
                this.key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
            } else if (secret.startsWith("base64:")) {
                byte[] decoded = Base64.getDecoder().decode(secret.substring(7));
                this.key = Keys.hmacShaKeyFor(decoded);
            } else {
                byte[] secretBytes = secret.getBytes(StandardCharsets.UTF_8);
                if (secretBytes.length < 32) {
                    MessageDigest md = MessageDigest.getInstance("SHA-256");
                    byte[] hash = md.digest(secretBytes);
                    this.key = Keys.hmacShaKeyFor(hash);
                } else {
                    this.key = Keys.hmacShaKeyFor(secretBytes);
                }
            }
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to initialize JWT signing key", ex);
        }
        this.expirationMs = expirationMs;
    }

    public String generateToken(User user) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .setSubject(user.getEmail())
                .claim("id", user.getId())
                .claim("role", user.getRole())
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Claims validateAndGetClaims(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
    }
}
