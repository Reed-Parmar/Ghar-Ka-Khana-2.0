package com.yourapp.backend.controller;

// Import models and DTOs
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yourapp.backend.config.JwtUtil;
import com.yourapp.backend.dto.LoginRequest;
import com.yourapp.backend.dto.LoginResponse;
import com.yourapp.backend.dto.RegisterRequest;
import com.yourapp.backend.model.User;
import com.yourapp.backend.service.UserService;

import jakarta.validation.Valid;

/**
 * REST Controller for authentication endpoints
 * 
 * Handles:
 * - POST /api/auth/register - User registration
 * - POST /api/auth/login - User login with JWT generation
 * - POST /api/auth/logout - Logout (stateless, client-side only)
 * 
 * @RestController combines @Controller and @ResponseBody
 * - Automatically converts return values to JSON
 * - No need to manually create JSON strings
 * 
 * @RequestMapping("/api/auth") sets base path for all endpoints in this controller
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    // ===== DEPENDENCIES =====
    
    /**
     * UserService for business logic (registration, password verification)
     */
    private final UserService userService;
    
    /**
     * JwtUtil for generating and validating JWT tokens
     */
    private final JwtUtil jwtUtil;

    /**
     * Constructor for dependency injection
     * 
     * @param userService Injected by Spring
     * @param jwtUtil Injected by Spring
     */
    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    // ===== ENDPOINTS =====
    
    /**
     * Register a new user
     * 
     * Endpoint: POST /api/auth/register
     * Request Body: { name, email, password, role }
     * 
     * Process:
     * 1. Validate input using @Valid (triggers RegisterRequest validations)
     * 2. Check if email already exists
     * 3. Call UserService.register (hashes password, saves to DB)
     * 4. Return user data (without password!)
     * 
     * @param request RegisterRequest DTO with validated fields
     * @return ResponseEntity with created user or error message
     * 
     * Success Response (201 CREATED):
     * {
     *   "id": "507f1f77bcf86cd799439011",
     *   "name": "John Doe",
     *   "email": "john@example.com",
     *   "role": "student",
     *   "provider": "credentials"
     * }
     * 
     * Error Response (409 CONFLICT):
     * {
     *   "message": "Email already registered"
     * }
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        // @Valid triggers Jakarta Validation on RegisterRequest fields:
        // - name: @NotBlank, @Size(min=2, max=100)
        // - email: @NotBlank, @Email
        // - password: @NotBlank, @Size(min=6)
        // - role: @NotBlank, @Pattern(regexp="student|chef|admin")
        // If validation fails, Spring automatically returns 400 BAD REQUEST with error details
        
        try {
            // Call service to register user
            // UserService.register throws IllegalArgumentException if email exists
            User saved = userService.register(request);
            
            // SECURITY: Never return password in response!
            // Even though it's hashed, it's best practice to exclude it
            saved.setPassword(null);
            
            // Return 201 CREATED with user data
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
            
        } catch (IllegalArgumentException e) {
            // Email already exists
            return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Login user and generate JWT token
     * 
     * Endpoint: POST /api/auth/login
     * Request Body: { email, password }
     * 
     * Process:
     * 1. Validate input using @Valid
     * 2. Verify email and password using UserService
     * 3. Generate JWT token
     * 4. Return token and user info
     * 
     * @param request LoginRequest DTO with email and password
     * @return ResponseEntity with token and user data or error
     * 
     * Success Response (200 OK):
     * {
     *   "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     *   "user": {
     *     "id": "507f1f77bcf86cd799439011",
     *     "email": "john@example.com",
     *     "name": "John Doe",
     *     "role": "student",
     *     "image": null
     *   }
     * }
     * 
     * Error Response (401 UNAUTHORIZED):
     * {
     *   "message": "Invalid credentials"
     * }
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        // @Valid triggers validation on LoginRequest:
        // - email: @NotBlank, @Email
        // - password: @NotBlank
        
        // Step 1: Verify password
        // UserService.verifyPassword returns Optional<User> if credentials valid
        Optional<User> userOpt = userService.verifyPassword(request.getEmail(), request.getPassword());
        
        if (userOpt.isEmpty()) {
            // Invalid email or password
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid credentials"));
        }
        
        // Step 2: Get user
        User user = userOpt.get();
        
        // Step 3: Generate JWT token
        // Token contains user ID and email in payload
        // Token is signed with secret key (prevents tampering)
        // Token expires after configured time (e.g., 24 hours)
        String token = jwtUtil.generateToken(user);
        
        // Step 4: Build response using LoginResponse DTO
        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
            user.getId(),
            user.getEmail(),
            user.getName(),
            user.getRole(),
            user.getImage()
        );
        LoginResponse response = new LoginResponse(token, userInfo);
        
        // Return 200 OK with token and user info
        return ResponseEntity.ok(response);
    }

    /**
     * Logout endpoint
     * 
     * Endpoint: POST /api/auth/logout
     * 
     * Note: JWT is stateless - tokens can't be invalidated server-side
     * This endpoint exists for:
     * 1. Consistency with client expectations
     * 2. Future enhancement (e.g., token blacklist in Redis)
     * 3. Client can clear localStorage/cookies after calling this
     * 
     * @return ResponseEntity with success message
     * 
     * Response (200 OK):
     * {
     *   "message": "Logged out successfully"
     * }
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // Stateless JWT: No server-side session to clear
        // Client should:
        // 1. Remove token from localStorage/cookies
        // 2. Clear any cached user data
        // 3. Redirect to login page
        
        // Future enhancement: Add token to blacklist in Redis
        // redis.set("blacklist:" + token, "true", tokenExpiryTime)
        
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
