package com.yourapp.backend.dto;

/**
 * Data Transfer Object (DTO) for login responses
 * This class structures the successful login response sent to the frontend
 * 
 * After successful authentication, this object is converted to JSON and sent back
 * Frontend expects: { "token": "...", "user": { "id": "...", "email": "...", "name": "...", "role": "..." } }
 */
public class LoginResponse {

    // ==================== FIELDS ====================
    
    private String token; // JWT token for subsequent authenticated requests
    private UserInfo user; // User information to display on frontend

    // ==================== NESTED CLASS FOR USER INFO ====================
    
    /**
     * Nested class containing safe user information (no password)
     * This is what gets stored in frontend state and localStorage
     */
    public static class UserInfo {
        private String id; // User's MongoDB ObjectId
        private String email; // User's email
        private String name; // User's full name
        private String role; // User's role (student/chef/admin)
        private String image; // Optional: profile image URL

        // Constructors
        public UserInfo() {}

        public UserInfo(String id, String email, String name, String role, String image) {
            this.id = id;
            this.email = email;
            this.name = name;
            this.role = role;
            this.image = image;
        }

        // Getters and setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public String getImage() { return image; }
        public void setImage(String image) { this.image = image; }
    }

    // ==================== CONSTRUCTORS ====================
    
    /**
     * Default constructor
     * Required by Jackson for JSON serialization
     */
    public LoginResponse() {}

    /**
     * Constructor with all fields
     * 
     * @param token JWT token
     * @param user User information object
     */
    public LoginResponse(String token, UserInfo user) {
        this.token = token;
        this.user = user;
    }

    // ==================== GETTERS AND SETTERS ====================
    
    /**
     * @return JWT token string
     */
    public String getToken() {
        return token;
    }

    /**
     * Sets the JWT token
     * @param token JWT token for authentication
     */
    public void setToken(String token) {
        this.token = token;
    }

    /**
     * @return User information object
     */
    public UserInfo getUser() {
        return user;
    }

    /**
     * Sets the user information
     * @param user UserInfo object
     */
    public void setUser(UserInfo user) {
        this.user = user;
    }
}
