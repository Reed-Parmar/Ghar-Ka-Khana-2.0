package com.yourapp.backend.repository;

// Import the User model
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.yourapp.backend.model.User;

/**
 * Repository interface for User entity
 * Extends MongoRepository which provides basic CRUD operations (save, findById, findAll, delete, etc.)
 * 
 * Spring Data MongoDB automatically implements these methods at runtime - no need to write implementation!
 * Just declare the method signature and Spring generates the MongoDB query automatically
 * 
 * Method naming conventions:
 * - findBy[FieldName] → finds documents by exact field match
 * - existsBy[FieldName] → checks if document exists
 * - countBy[FieldName] → counts documents
 * - deleteBy[FieldName] → deletes documents
 */
public interface UserRepository extends MongoRepository<User, String> {
    
    /**
     * Find a user by their email address
     * Used for: Login authentication, checking if email already exists
     * 
     * MongoDB query: db.users.findOne({ email: "user@example.com" })
     * 
     * @param email User's email address (unique in database)
     * @return Optional<User> - contains User if found, empty if not found
     */
    Optional<User> findByEmail(String email);
    
    /**
     * Find all users by their role (student, chef, or admin)
     * Used for: Admin dashboard to list all chefs/students, analytics
     * 
     * MongoDB query: db.users.find({ role: "chef" })
     * 
     * @param role User role ("student", "chef", or "admin")
     * @return List<User> - all users with the specified role
     */
    List<User> findByRole(String role);
    
    /**
     * Check if a user exists with the given email
     * Used for: Registration validation (prevent duplicate emails)
     * This is more efficient than findByEmail when you only need to check existence
     * 
     * MongoDB query: db.users.count({ email: "user@example.com" }) > 0
     * 
     * @param email Email address to check
     * @return boolean - true if user exists, false otherwise
     */
    boolean existsByEmail(String email);
    
    /**
     * Count the total number of users with a specific role
     * Used for: Admin dashboard statistics (total students, total chefs)
     * 
     * MongoDB query: db.users.count({ role: "student" })
     * 
     * @param role User role to count
     * @return long - number of users with that role
     */
    long countByRole(String role);
    
    /**
     * Find users by authentication provider
     * Used for: Analytics, filtering OAuth vs credential users
     * 
     * MongoDB query: db.users.find({ provider: "credentials" })
     * 
     * @param provider Authentication provider ("credentials", "google", "facebook", etc.)
     * @return List<User> - all users using that provider
     */
    List<User> findByProvider(String provider);
}
