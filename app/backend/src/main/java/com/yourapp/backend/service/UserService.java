package com.yourapp.backend.service;

// Import User model and repository
import java.util.List;
import java.util.Optional;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.yourapp.backend.dto.RegisterRequest;
import com.yourapp.backend.model.User;
import com.yourapp.backend.repository.UserRepository;

/**
 * Service layer for User-related business logic
 * 
 * Service layer sits between Controllers and Repositories:
 * - Controllers handle HTTP requests/responses
 * - Services contain business logic (validation, processing, calculations)
 * - Repositories interact with MongoDB database
 * 
 * Why use @Service annotation?
 * - Marks this class as a Spring component (auto-detected and managed)
 * - Spring creates a single instance (singleton) and injects it where needed
 * - Enables transaction management, caching, and other Spring features
 */
@Service
public class UserService {

    // ===== DEPENDENCIES =====
    
    /**
     * UserRepository for database operations
     * 
     * The 'final' keyword means:
     * - This field can only be set once (in the constructor)
     * - Prevents accidental reassignment later
     * - Signals that this dependency is required
     */
    private final UserRepository userRepository;
    
    /**
     * BCryptPasswordEncoder for hashing passwords
     * 
     * Why BCrypt?
     * - Industry standard for password hashing
     * - Automatically salts passwords (prevents rainbow table attacks)
     * - Slow by design (prevents brute force attacks)
     * - One-way hash (cannot decrypt, can only verify)
     * 
     * Example:
     * - Plain password: "myPassword123"
     * - Hashed: "$2a$10$K9Yh8Z..." (60 chars, impossible to reverse)
     */
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Constructor for dependency injection
     * 
     * Spring automatically calls this constructor and injects UserRepository
     * This is called "Constructor Injection" - best practice because:
     * 1. Makes dependencies explicit and required
     * 2. Allows final fields (immutable)
     * 3. Easier to test (can mock dependencies in unit tests)
     * 
     * @param userRepository Repository injected by Spring
     */
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ===== BUSINESS METHODS =====
    
    /**
     * Register a new user with validated input and hashed password
     * 
     * Process:
     * 1. Check if email already exists (prevent duplicates)
     * 2. Hash the password using BCrypt
     * 3. Set default values (emailVerified=null, provider="credentials")
     * 4. Save to database
     * 
     * Used by: AuthController for registration endpoint
     * 
     * @param request RegisterRequest DTO with validated name, email, password, role
     * @return User The saved user object
     * @throws IllegalArgumentException if email already exists
     */
    public User register(RegisterRequest request) {
        // Step 1: Check if email already registered
        // existsByEmail is more efficient than findByEmail for checking existence
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        
        // Step 2: Create new User object and set fields
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        
        // Step 3: Hash password before storing
        // NEVER store plain text passwords - always hash them!
        // BCrypt automatically generates a unique salt for each password
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        // Step 4: Set role (student, chef, or admin)
        user.setRole(request.getRole());
        
        // Step 5: Set defaults
        // provider = "credentials" means local registration (not OAuth like Google)
        user.setProvider("credentials");
        // emailVerified starts as null - will be set when user confirms email
        user.setEmailVerified(null);
        // image is optional, starts as null
        user.setImage(null);
        
        // Step 6: Save to MongoDB
        // userRepository.save() inserts the document
        // MongoDB auto-generates the _id field
        // @CreatedDate and @LastModifiedDate are automatically set by Spring auditing
        return userRepository.save(user);
    }
    
    /**
     * Find a user by email address
     * Used for: Login authentication, profile lookup
     * 
     * @param email User's email address
     * @return Optional<User> - contains User if found, empty otherwise
     */
    public Optional<User> findByEmail(String email) {
        // Optional prevents null pointer exceptions
        // Caller can check: optional.isPresent() or optional.isEmpty()
        return userRepository.findByEmail(email);
    }
    
    /**
     * Find a user by their ID
     * Used for: Profile page, authorization checks
     * 
     * @param id MongoDB ObjectId as String (e.g., "507f1f77bcf86cd799439011")
     * @return Optional<User> - contains User if found, empty otherwise
     */
    public Optional<User> findById(String id) {
        // findById is provided by MongoRepository
        return userRepository.findById(id);
    }
    
    /**
     * Find all users by role
     * Used for: Admin dashboard (list all chefs, list all students)
     * 
     * @param role User role ("student", "chef", or "admin")
     * @return List<User> - all users with that role
     */
    public List<User> findByRole(String role) {
        return userRepository.findByRole(role);
    }
    
    /**
     * Verify password during login
     * 
     * Process:
     * 1. Fetch stored user by email
     * 2. Compare plain text password with hashed password
     * 
     * Why not just compare hashed passwords?
     * - BCrypt adds random salt, so same password has different hashes
     * - passwordEncoder.matches() handles the salt comparison internally
     * 
     * @param email User's email
     * @param plainPassword Plain text password from login form
     * @return Optional<User> - contains User if credentials valid, empty otherwise
     */
    public Optional<User> verifyPassword(String email, String plainPassword) {
        // Step 1: Find user by email
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        // Step 2: If user exists, verify password
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            
            // Compare plain password with hashed password
            // matches() returns true if they match, false otherwise
            boolean passwordMatches = passwordEncoder.matches(plainPassword, user.getPassword());
            
            // Return user only if password matches, otherwise return empty
            if (passwordMatches) {
                return Optional.of(user);
            }
        }
        
        // User not found or password didn't match
        return Optional.empty();
    }
    
    /**
     * Get total count of users by role
     * Used for: Admin dashboard statistics
     * 
     * @param role User role to count
     * @return long Number of users
     */
    public long countByRole(String role) {
        return userRepository.countByRole(role);
    }
}
