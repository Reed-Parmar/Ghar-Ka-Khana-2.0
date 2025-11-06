package com.yourapp.backend.config;

// Import Spring Data MongoDB configuration classes
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

/**
 * MongoDB configuration class
 * Enables auditing features for automatic timestamp management
 * 
 * This configuration allows the use of:
 * - @CreatedDate: Automatically sets timestamp when entity is first saved
 * - @LastModifiedDate: Automatically updates timestamp when entity is modified
 * - @CreatedBy: Can be used to track who created the entity (if we implement)
 * - @LastModifiedBy: Can be used to track who last modified the entity
 * 
 * Without this annotation, @CreatedDate and @LastModifiedDate won't work
 */
@Configuration // Marks this as a Spring configuration class
@EnableMongoAuditing // Enables automatic auditing of MongoDB documents
public class MongoConfig {
    // No additional configuration needed for basic auditing
    // The @EnableMongoAuditing annotation does all the work
    
    /**
     * In the future, we can add beans here for:
     * - Custom AuditorAware implementation (for @CreatedBy/@LastModifiedBy)
     * - Custom date/time providers
     * - MongoDB converters
     * - Custom validators
     */
}
