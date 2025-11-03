package com.yourapp.backend.controller;

import com.yourapp.backend.model.User;
import com.yourapp.backend.service.UserService;
import com.yourapp.backend.config.JwtUtil;
import jakarta.validation.Valid;
import com.yourapp.backend.dto.AuthRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthController(UserService userService, JwtUtil jwtUtil, AuthenticationManager authenticationManager) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user) {
        if (userService.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", "Email already registered"));
        }
        User saved = userService.register(user);
        saved.setPassword(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest body) {
        try {
            String email = body.getEmail();
            String password = body.getPassword();
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
            var userOpt = userService.findByEmail(email);
            if (userOpt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message","Invalid credentials"));
            var user = userOpt.get();
            String token = jwtUtil.generateToken(user);
            return ResponseEntity.ok(Map.of("token", token, "user", Map.of("id", user.getId(), "email", user.getEmail(), "name", user.getName())));
        } catch (AuthenticationException ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid credentials"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Stateless JWT: nothing to revoke server-side by default.
        // This endpoint exists to let clients perform a clean logout without
        // triggering any auth challenges.
        return ResponseEntity.ok(Map.of("message", "logged out"));
    }
}
