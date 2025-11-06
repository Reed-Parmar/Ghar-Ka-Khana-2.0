package com.yourapp.backend.dto;

// Import Jakarta validation annotations for input validation
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Data Transfer Object (DTO) for user registration requests
 * This class validates and transfers registration data from the frontend to the backend
 * 
 * Corresponds to the registration API endpoint: POST /api/auth/register
 * Frontend sends this data from the registration form
 */
public class RegisterRequest {

    // ==================== FIELDS ====================
    
    @NotBlank(message = "Name is required") // Ensures name is not null or empty
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters") // Length validation
    private String name; // User's full name

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format") // Validates proper email format (e.g., user@example.com)
    private String email; // User's email address (must be unique in database)

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password must be at least 6 characters") // Minimum security requirement
    private String password; // User's password (will be hashed with BCrypt)

    @NotBlank(message = "Role is required")
    @Pattern(
        regexp = "student|chef|admin", // Only allows these three values
        message = "Role must be student, chef, or admin"
    )
    private String role; // User's role: "student" (customer), "chef" (food provider), or "admin" (system administrator)

    // ==================== CONSTRUCTORS ====================
    
    /**
     * Default constructor
     * Required by Jackson for JSON deserialization
     */
    public RegisterRequest() {}

    /**
     * Constructor with all fields
     * Useful for testing and manual object creation
     * 
     * @param name User's full name
     * @param email User's email address
     * @param password User's password (plain text, will be hashed)
     * @param role User's role (student/chef/admin)
     */
    public RegisterRequest(String name, String email, String password, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // ==================== GETTERS AND SETTERS ====================
    
    /**
     * @return User's full name
     */
    public String getName() {
        return name;
    }

    /**
     * Sets the user's name
     * @param name Full name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * @return User's email address
     */
    public String getEmail() {
        return email;
    }

    /**
     * Sets the user's email
     * @param email Email address
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * @return User's password (plain text)
     */
    public String getPassword() {
        return password;
    }

    /**
     * Sets the user's password
     * @param password Password (will be hashed before storing)
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * @return User's role
     */
    public String getRole() {
        return role;
    }

    /**
     * Sets the user's role
     * @param role Must be "student", "chef", or "admin"
     */
    public void setRole(String role) {
        this.role = role;
    }
}
