package com.yourapp.backend.service;

// Import Meal and User models
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import com.yourapp.backend.dto.MealDTO;
import com.yourapp.backend.dto.MealDTO.ChefDTO;
import com.yourapp.backend.model.Meal;
import com.yourapp.backend.model.User;
import com.yourapp.backend.repository.MealRepository;
import com.yourapp.backend.repository.UserRepository;

/**
 * Service layer for Meal-related business logic
 * 
 * Responsibilities:
 * - Create/update/delete meals (with chef authorization)
 * - Retrieve meals by various filters (chef, active status, price range)
 * - Validate meal data before saving
 * - Handle meal activation/deactivation
 */
@Service
public class MealService {

    // ===== DEPENDENCIES =====
    
    /**
     * MealRepository for meal database operations
     */
    private final MealRepository mealRepository;
    
    /**
     * UserRepository for chef validation
     * Needed to verify that the chef exists and has role="chef"
     */
    private final UserRepository userRepository;
    private final MongoTemplate mongoTemplate;

    /**
     * Constructor for dependency injection
     * 
     * @param mealRepository Injected by Spring
     * @param userRepository Injected by Spring
     */
    public MealService(MealRepository mealRepository, UserRepository userRepository, MongoTemplate mongoTemplate) {
        this.mealRepository = mealRepository;
        this.userRepository = userRepository;
        this.mongoTemplate = mongoTemplate;
    }

    // ===== BUSINESS METHODS =====
    
    /**
     * Create a new meal
     * 
     * Process:
     * 1. Validate that chef exists and has role="chef"
     * 2. Set chef reference in meal
     * 3. Set defaults (isActive=true)
     * 4. Validate price is positive
     * 5. Save to database
     * 
     * Used by: ChefController for creating new meals
     * 
     * @param meal Meal object with mealName, description, price, etc.
     * @param chefId Chef's user ID (from JWT token)
     * @return Meal The saved meal
     * @throws IllegalArgumentException if chef not found or not a chef role
     */
    public Meal createMeal(Meal meal, String chefId) {
        // Step 1: Fetch chef from database
        Optional<User> chefOpt = userRepository.findById(chefId);
        if (chefOpt.isEmpty()) {
            throw new IllegalArgumentException("Chef not found with ID: " + chefId);
        }
        
        User chef = chefOpt.get();
        
        // Step 2: Verify user has chef role
        // Security check: prevent students/admins from creating meals
        if (!"chef".equals(chef.getRole())) {
            throw new IllegalArgumentException("User is not a chef. Role: " + chef.getRole());
        }
        
        // Step 3: Validate price
        if (meal.getPrice() == null || meal.getPrice() <= 0) {
            throw new IllegalArgumentException("Price must be greater than 0");
        }
        
        // Step 4: Set chef reference
        // This creates the @DBRef relationship in MongoDB
        meal.setChef(chef);
        
        // Step 5: Set defaults
        // New meals are active by default
        if (meal.getIsActive() == null) {
            meal.setIsActive(true);
        }
        
        // Step 6: Save to database
        // @CreatedDate and @LastModifiedDate are auto-set by Spring auditing
        return mealRepository.save(meal);
    }
    
    /**
     * Update an existing meal
     * 
     * Process:
     * 1. Verify meal exists
     * 2. Verify the chef owns this meal (authorization)
     * 3. Update fields
     * 4. Save changes
     * 
     * @param mealId ID of meal to update
     * @param updatedMeal New meal data
     * @param chefId Chef's user ID (from JWT)
     * @return Meal Updated meal
     * @throws IllegalArgumentException if meal not found or chef doesn't own it
     */
    public Meal updateMeal(String mealId, Meal updatedMeal, String chefId) {
        // Step 1: Fetch existing meal
        Optional<Meal> existingMealOpt = mealRepository.findById(mealId);
        if (existingMealOpt.isEmpty()) {
            throw new IllegalArgumentException("Meal not found with ID: " + mealId);
        }
        
        Meal existingMeal = existingMealOpt.get();
        
        // Step 2: Authorization check - verify chef owns this meal
        // Get the chef from the meal's @DBRef and compare IDs
        if (!existingMeal.getChef().getId().equals(chefId)) {
            throw new IllegalArgumentException("Not authorized to update this meal");
        }
        
        // Step 3: Update fields (only non-null fields)
        if (updatedMeal.getMealName() != null) {
            existingMeal.setMealName(updatedMeal.getMealName());
        }
        if (updatedMeal.getDescription() != null) {
            existingMeal.setDescription(updatedMeal.getDescription());
        }
        if (updatedMeal.getPrice() != null && updatedMeal.getPrice() > 0) {
            existingMeal.setPrice(updatedMeal.getPrice());
        }
        if (updatedMeal.getImageUrl() != null) {
            existingMeal.setImageUrl(updatedMeal.getImageUrl());
        }
        if (updatedMeal.getAvailableTime() != null) {
            existingMeal.setAvailableTime(updatedMeal.getAvailableTime());
        }
        if (updatedMeal.getIsActive() != null) {
            existingMeal.setIsActive(updatedMeal.getIsActive());
        }
        
        // Step 4: Save updated meal
        // @LastModifiedDate is automatically updated by Spring auditing
        return mealRepository.save(existingMeal);
    }
    
    /**
     * Get all active meals sorted by newest first
     * Used for: Browse meals page
     * 
     * @return List<Meal> Active meals
     */
    public List<Meal> getAllActiveMeals() {
        // true = only active meals, sorted by createdAt descending (newest first)
        return mealRepository.findByIsActiveOrderByCreatedAtDesc(true);
    }

    /**
     * Return active meals as DTOs without requiring DBRef mapping (legacy tolerance).
     */
    public List<MealDTO> getAllActiveMealsDTO() {
        Query q = new Query();
        q.addCriteria(Criteria.where("isActive").is(true));
        q.with(Sort.by(Sort.Direction.DESC, "createdAt", "_id"));
        List<Document> docs = mongoTemplate.find(q, Document.class, "meals");
        List<MealDTO> result = new ArrayList<>(docs.size());
        for (Document d : docs) {
            ObjectId oid = d.getObjectId("_id");
            String id = oid != null ? oid.toHexString() : null;
            String mealName = d.getString("mealName");
            String description = d.getString("description");
            Double price = d.get("price") instanceof Number ? ((Number)d.get("price")).doubleValue() : null;
            String imageUrl = d.getString("imageUrl");
            String availableTime = d.getString("availableTime");
            Boolean isActive = d.getBoolean("isActive", Boolean.TRUE);
            java.time.Instant createdAt = null;
            Object created = d.get("createdAt");
            if (created instanceof java.util.Date) {
                createdAt = ((java.util.Date)created).toInstant();
            }
            if (createdAt == null && oid != null) {
                createdAt = new java.util.Date(oid.getTimestamp()*1000L).toInstant();
            }
            // Chef resolution
            ChefDTO chefDto = null;
            Object chefField = d.get("chef");
            String chefId = null;
            if (chefField instanceof ObjectId) {
                chefId = ((ObjectId)chefField).toHexString();
            } else if (chefField instanceof String) {
                chefId = (String) chefField;
            } else if (chefField instanceof Document) {
                Document chefDoc = (Document) chefField;
                Object inner = chefDoc.get("_id");
                if (inner instanceof ObjectId) chefId = ((ObjectId)inner).toHexString();
                else if (inner instanceof String) chefId = (String) inner;
            }
            if (chefId != null) {
                var opt = userRepository.findById(chefId);
                if (opt.isPresent()) {
                    var u = opt.get();
                    chefDto = new ChefDTO(u.getId(), u.getName(), u.getEmail());
                } else {
                    chefDto = new ChefDTO(chefId, null, null);
                }
            }
            result.add(new MealDTO(id, mealName, description, price, imageUrl, availableTime, isActive, createdAt, chefDto));
        }
        return result;
    }
    
    /**
     * Get all meals by a specific chef
     * Used for: Chef dashboard showing their meals
     * 
     * @param chefId Chef's user ID
     * @return List<Meal> All meals by this chef (active and inactive)
     * @throws IllegalArgumentException if chef not found
     */
    public List<Meal> getMealsByChef(String chefId) {
        // Fetch chef
        Optional<User> chefOpt = userRepository.findById(chefId);
        if (chefOpt.isEmpty()) {
            throw new IllegalArgumentException("Chef not found");
        }
        
        User chef = chefOpt.get();
        
        // Use chef object (not chefId string) because of @DBRef
        return mealRepository.findByChef(chef);
    }
    
    /**
     * Get active meals by a chef
     * Used for: Filtering chef's active meals only
     * 
     * @param chefId Chef's user ID
     * @return List<Meal> Active meals by this chef
     * @throws IllegalArgumentException if chef not found
     */
    public List<Meal> getActiveMealsByChef(String chefId) {
        // Fetch chef
        Optional<User> chefOpt = userRepository.findById(chefId);
        if (chefOpt.isEmpty()) {
            throw new IllegalArgumentException("Chef not found");
        }
        
        User chef = chefOpt.get();
        
        // Use chef object and isActive=true
        return mealRepository.findByChefAndIsActive(chef, true);
    }
    
    /**
     * Get a single meal by ID
     * Used for: Meal details page
     * 
     * @param mealId Meal ID
     * @return Optional<Meal> Meal if found
     */
    public Optional<Meal> getMealById(String mealId) {
        return mealRepository.findById(mealId);
    }
    
    /**
     * Delete a meal (soft delete - set isActive=false)
     * 
     * Why soft delete instead of hard delete?
     * - Preserve order history (orders reference this meal)
     * - Analytics data remains intact
     * - Can be restored if deleted accidentally
     * 
     * @param mealId Meal ID to delete
     * @param chefId Chef's user ID (for authorization)
     * @throws IllegalArgumentException if meal not found or chef doesn't own it
     */
    public void deactivateMeal(String mealId, String chefId) {
        // Fetch meal
        Optional<Meal> mealOpt = mealRepository.findById(mealId);
        if (mealOpt.isEmpty()) {
            throw new IllegalArgumentException("Meal not found");
        }
        
        Meal meal = mealOpt.get();
        
        // Authorization check
        if (!meal.getChef().getId().equals(chefId)) {
            throw new IllegalArgumentException("Not authorized to delete this meal");
        }
        
        // Soft delete - set isActive to false
        meal.setIsActive(false);
        mealRepository.save(meal);
    }
    
    /**
     * Reactivate a previously deactivated meal
     * 
     * @param mealId Meal ID to reactivate
     * @param chefId Chef's user ID (for authorization)
     * @throws IllegalArgumentException if meal not found or chef doesn't own it
     */
    public void reactivateMeal(String mealId, String chefId) {
        // Fetch meal
        Optional<Meal> mealOpt = mealRepository.findById(mealId);
        if (mealOpt.isEmpty()) {
            throw new IllegalArgumentException("Meal not found");
        }
        
        Meal meal = mealOpt.get();
        
        // Authorization check
        if (!meal.getChef().getId().equals(chefId)) {
            throw new IllegalArgumentException("Not authorized to reactivate this meal");
        }
        
        // Reactivate
        meal.setIsActive(true);
        mealRepository.save(meal);
    }
    
    /**
     * Search meals by price range
     * Used for: Price filter on browse page
     * 
     * @param minPrice Minimum price (inclusive)
     * @param maxPrice Maximum price (inclusive)
     * @return List<Meal> Meals within price range
     */
    public List<Meal> getMealsByPriceRange(Double minPrice, Double maxPrice) {
        return mealRepository.findByPriceBetweenAndIsActive(minPrice, maxPrice, true);
    }
    
    /**
     * Get active meals with pagination
     * Used for: Browse meals page with infinite scroll or pagination
     * 
     * @param page Page number (0-indexed)
     * @param size Number of meals per page
     * @return Page<Meal> Paginated results with metadata
     */
    public Page<Meal> getActiveMealsPaginated(int page, int size) {
        // Create Pageable with page number, size, and sorting
        // Sort by createdAt descending = newest meals first
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        return mealRepository.findByIsActive(true, pageable);
    }
    
    /**
     * Count active meals by chef
     * Used for: Chef dashboard statistics
     * 
     * @param chefId Chef's user ID
     * @return long Number of active meals
     * @throws IllegalArgumentException if chef not found
     */
    public long countActiveMealsByChef(String chefId) {
        // Fetch chef
        Optional<User> chefOpt = userRepository.findById(chefId);
        if (chefOpt.isEmpty()) {
            throw new IllegalArgumentException("Chef not found");
        }
        
        User chef = chefOpt.get();
        
        return mealRepository.countByChefAndIsActive(chef, true);
    }
    
    // ===== HELPER METHODS FOR EMAIL-BASED LOOKUPS =====
    
    /**
     * Helper method to get user ID from email
     * Used by controllers that receive email from JWT token
     * 
     * @param email User email
     * @return String User ID
     * @throws IllegalArgumentException if user not found
     */
    private String getUserIdFromEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found with email: " + email);
        }
        return userOpt.get().getId();
    }
    
    /**
     * Create meal using chef email (overload for controller use)
     * 
     * @param meal Meal object
     * @param chefEmail Chef's email from JWT
     * @return Meal Created meal
     */
    public Meal createMeal(Meal meal, String chefEmail, boolean isEmail) {
        if (isEmail) {
            String chefId = getUserIdFromEmail(chefEmail);
            return createMeal(meal, chefId);
        }
        return createMeal(meal, chefEmail);
    }
    
    /**
     * Update meal using chef email (overload for controller use)
     * 
     * @param mealId Meal ID
     * @param meal Updated meal
     * @param chefEmail Chef's email from JWT
     * @return Meal Updated meal
     */
    public Meal updateMeal(String mealId, Meal meal, String chefEmail, boolean isEmail) {
        if (isEmail) {
            String chefId = getUserIdFromEmail(chefEmail);
            return updateMeal(mealId, meal, chefId);
        }
        return updateMeal(mealId, meal, chefEmail);
    }
    
    /**
     * Deactivate meal using chef email (overload for controller use)
     * 
     * @param mealId Meal ID
     * @param chefEmail Chef's email from JWT
     */
    public void deactivateMeal(String mealId, String chefEmail, boolean isEmail) {
        if (isEmail) {
            String chefId = getUserIdFromEmail(chefEmail);
            deactivateMeal(mealId, chefId);
        } else {
            deactivateMeal(mealId, chefEmail);
        }
    }
}
