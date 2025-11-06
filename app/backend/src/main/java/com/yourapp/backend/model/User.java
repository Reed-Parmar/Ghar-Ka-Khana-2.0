package com.yourapp.backend.model;

// Import Spring Data MongoDB annotations for entity mapping
import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * User entity representing users in the system (students, chefs, admins)
 * This model matches the Mongoose User schema from the Node.js backend
 * Collection name in MongoDB: "users"
 */
@Document(collection = "users") // Maps this class to the "users" collection in MongoDB
public class User {

    // ==================== FIELDS ====================
    
    @Id // MongoDB's ObjectId, auto-generated
    private String id;

    @NotBlank(message = "Name is required") // Ensures name is not null or empty
    private String name;

    @Email(message = "Invalid email format") // Validates email format
    @NotBlank(message = "Email is required")
    @Indexed(unique = true) // Creates unique index on email field for faster queries and uniqueness constraint
    private String email;

    @NotBlank(message = "Password is required")
    private String password; // Stored as BCrypt hash, never plain text

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "student|chef|admin", message = "Role must be student, chef, or admin") // Restricts to valid roles
    private String role; // Values: "student", "chef", or "admin"

    private String image; // Optional: URL to user's profile image

    private Instant emailVerified; // Timestamp when email was verified (null if not verified)

    private String provider; // Authentication provider: "credentials" (email/password) or OAuth provider name

    @CreatedDate // Automatically set when document is created
    private Instant createdAt;

    @LastModifiedDate // Automatically updated when document is modified
    private Instant updatedAt;

    // ==================== CONSTRUCTORS ====================
    
    /**
     * Default constructor required by Spring Data MongoDB
     */
    public User() {
        this.provider = "credentials"; // Default to email/password authentication
        this.role = "student"; // Default role is student
    }

    /**
     * Constructor with essential fields
     * @param name User's full name
     * @param email User's email address
     * @param password User's password (will be hashed before saving)
     * @param role User's role (student, chef, or admin)
     */
    public User(String name, String email, String password, String role) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.role = role;
        this.provider = "credentials";
    }

    // ==================== GETTERS AND SETTERS ====================
    
    /**
     * @return MongoDB ObjectId as String
     */
    public String getId() {
        return id;
    }

    /**
     * Sets the user ID (typically only used by MongoDB)
     * @param id MongoDB ObjectId
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * @return User's full name
     */
    public String getName() {
        return name;
    }

    /**
     * Updates user's name
     * @param name User's full name
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
     * Updates user's email address
     * @param email Valid email address
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * @return BCrypt hashed password
     */
    public String getPassword() {
        return password;
    }

    /**
     * Sets user's password (should be BCrypt hashed before calling this)
     * @param password BCrypt hashed password
     */
    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * @return User's role: "student", "chef", or "admin"
     */
    public String getRole() {
        return role;
    }

    /**
     * Sets user's role
     * @param role Must be "student", "chef", or "admin"
     */
    public void setRole(String role) {
        this.role = role;
    }

    /**
     * @return URL to user's profile image (nullable)
     */
    public String getImage() {
        return image;
    }

    /**
     * Sets user's profile image URL
     * @param image URL string
     */
    public void setImage(String image) {
        this.image = image;
    }

    /**
     * @return Timestamp when email was verified, or null if not verified
     */
    public Instant getEmailVerified() {
        return emailVerified;
    }

    /**
     * Sets email verification timestamp
     * @param emailVerified Instant when email was verified
     */
    public void setEmailVerified(Instant emailVerified) {
        this.emailVerified = emailVerified;
    }

    /**
     * @return Authentication provider ("credentials" for email/password, or OAuth provider name)
     */
    public String getProvider() {
        return provider;
    }

    /**
     * Sets authentication provider
     * @param provider "credentials" or OAuth provider name
     */
    public void setProvider(String provider) {
        this.provider = provider;
    }

    /**
     * @return Timestamp when user was created
     */
    public Instant getCreatedAt() {
        return createdAt;
    }

    /**
     * Sets creation timestamp (typically handled automatically by @CreatedDate)
     * @param createdAt Creation timestamp
     */
    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * @return Timestamp when user was last updated
     */
    public Instant getUpdatedAt() {
        return updatedAt;
    }

    /**
     * Sets last modified timestamp (typically handled automatically by @LastModifiedDate)
     * @param updatedAt Last modification timestamp
     */
    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
