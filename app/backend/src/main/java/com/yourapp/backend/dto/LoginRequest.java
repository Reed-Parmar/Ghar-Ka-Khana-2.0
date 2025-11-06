package com.yourapp.backend.dto;

// Import Jakarta validation annotations
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * Data Transfer Object (DTO) for login requests
 * This class validates and transfers login credentials from frontend to backend
 * 
 * Corresponds to the login API endpoint: POST /api/auth/login
 * Frontend sends this data from the login form
 */
public class LoginRequest {

    // ==================== FIELDS ====================
    
    @NotBlank(message = "Email is required") // Ensures email is not null or empty
    @Email(message = "Invalid email format") // Validates proper email format
    private String email; // User's email address for authentication

    @NotBlank(message = "Password is required") // Ensures password is not null or empty
    private String password; // User's password (plain text, will be compared with hashed version in DB)

    // ==================== CONSTRUCTORS ====================
    
    /**
     * Default constructor
     * Required by Jackson for JSON deserialization
     */
    public LoginRequest() {}

    /**
     * Constructor with all fields
     * Useful for testing and manual object creation
     * 
     * @param email User's email
     * @param password User's password
     */
    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // ==================== GETTERS AND SETTERS ====================
    
    /**
     * @return User's email address
     */
    public String getEmail() {
        return email;
    }

    /**
     * Sets the email
     * @param email Email address
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * @return User's password
     */
    public String getPassword() {
        return password;
    }

    /**
     * Sets the password
     * @param password Password string
     */
    public void setPassword(String password) {
        this.password = password;
    }
}
