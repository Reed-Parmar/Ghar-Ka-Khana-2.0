package com.yourapp.backend.model;

// Import Spring Data MongoDB annotations for entity mapping and relationships
import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Meal entity representing food items offered by chefs
 * This model matches the Mongoose Meal schema from the Node.js backend
 * Collection name in MongoDB: "meals"
 * 
 * Indexes:
 * - Compound index on (chef, isActive) for efficient chef meal queries
 * - Compound index on (isActive, createdAt) for listing active meals chronologically
 */
@Document(collection = "meals") // Maps to "meals" collection in MongoDB
@CompoundIndexes({
    @CompoundIndex(name = "chef_active_idx", def = "{'chef': 1, 'isActive': 1}"), // Index for querying chef's active meals
    @CompoundIndex(name = "active_created_idx", def = "{'isActive': 1, 'createdAt': -1}") // Index for listing recent active meals
})
public class Meal {

    // ==================== FIELDS ====================
    
    @Id // MongoDB's ObjectId, auto-generated
    private String id;

    @DBRef // Reference to User document (establishes relationship with chef)
    @NotNull(message = "Chef reference is required")
    @Indexed // Index for faster queries by chef
    private User chef; // The chef who created this meal (relationship to User with role="chef")

    @NotBlank(message = "Meal name is required")
    @Size(max = 100, message = "Meal name cannot exceed 100 characters") // Matches Mongoose maxlength
    private String mealName; // Name of the dish

    @NotBlank(message = "Description is required")
    @Size(max = 500, message = "Description cannot exceed 500 characters") // Matches Mongoose maxlength
    private String description; // Detailed description of the meal

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price cannot be negative") // Ensures non-negative price
    private Double price; // Price in local currency (e.g., INR)

    private String imageUrl; // Optional: URL to meal image

    @NotBlank(message = "Available time is required")
    private String availableTime; // Time when meal is available (e.g., "Lunch: 12PM-2PM")

    private Boolean isActive = true; // Whether meal is currently available for ordering (default: true)

    @CreatedDate // Automatically set when meal is created
    private Instant createdAt;

    @LastModifiedDate // Automatically updated when meal is modified
    private Instant updatedAt;

    // ==================== CONSTRUCTORS ====================
    
    /**
     * Default constructor required by Spring Data MongoDB
     */
    public Meal() {
        this.isActive = true; // Default to active
    }

    /**
     * Constructor with essential fields
     * @param chef The chef creating this meal
     * @param mealName Name of the meal
     * @param description Description of the meal
     * @param price Price of the meal
     * @param availableTime When the meal is available
     */
    public Meal(User chef, String mealName, String description, Double price, String availableTime) {
        this.chef = chef;
        this.mealName = mealName;
        this.description = description;
        this.price = price;
        this.availableTime = availableTime;
        this.isActive = true;
    }

    // ==================== GETTERS AND SETTERS ====================
    
    /**
     * @return MongoDB ObjectId as String
     */
    public String getId() {
        return id;
    }

    /**
     * Sets the meal ID (typically only used by MongoDB)
     * @param id MongoDB ObjectId
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * @return The chef who created this meal
     */
    public User getChef() {
        return chef;
    }

    /**
     * Sets the chef for this meal
     * @param chef User object with role="chef"
     */
    public void setChef(User chef) {
        this.chef = chef;
    }

    /**
     * @return Name of the meal
     */
    public String getMealName() {
        return mealName;
    }

    /**
     * Sets the meal name
     * @param mealName Name (max 100 characters)
     */
    public void setMealName(String mealName) {
        this.mealName = mealName;
    }

    /**
     * @return Description of the meal
     */
    public String getDescription() {
        return description;
    }

    /**
     * Sets the meal description
     * @param description Description (max 500 characters)
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * @return Price of the meal
     */
    public Double getPrice() {
        return price;
    }

    /**
     * Sets the meal price
     * @param price Non-negative price value
     */
    public void setPrice(Double price) {
        this.price = price;
    }

    /**
     * @return URL to meal image (nullable)
     */
    public String getImageUrl() {
        return imageUrl;
    }

    /**
     * Sets the meal image URL
     * @param imageUrl URL string
     */
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    /**
     * @return Time when meal is available (e.g., "Lunch: 12PM-2PM")
     */
    public String getAvailableTime() {
        return availableTime;
    }

    /**
     * Sets the available time
     * @param availableTime Time description string
     */
    public void setAvailableTime(String availableTime) {
        this.availableTime = availableTime;
    }

    /**
     * @return Whether meal is active and available for ordering
     */
    public Boolean getIsActive() {
        return isActive;
    }

    /**
     * Sets whether meal is active
     * @param isActive true if available, false if discontinued
     */
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    /**
     * @return Timestamp when meal was created
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
     * @return Timestamp when meal was last updated
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
