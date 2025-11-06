package com.yourapp.backend.repository;

// Import the Meal and User models
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.yourapp.backend.model.Meal;
import com.yourapp.backend.model.User;

/**
 * Repository interface for Meal entity
 * Extends MongoRepository for automatic CRUD operations
 * 
 * Spring Data MongoDB generates implementations automatically based on method names
 * Supports complex queries using field relationships (@DBRef)
 */
public interface MealRepository extends MongoRepository<Meal, String> {
    
    /**
     * Find all meals created by a specific chef
     * Used for: Chef dashboard to show their own meals
     * 
     * MongoDB query: db.meals.find({ chef: ObjectId("...") })
     * Note: Uses @DBRef relationship - Spring automatically handles the chef reference
     * 
     * @param chef User object with role="chef"
     * @return List<Meal> - all meals by this chef
     */
    List<Meal> findByChef(User chef);
    
    /**
     * Find active/inactive meals by a specific chef
     * Used for: Filtering chef's active vs discontinued meals
     * 
     * MongoDB query: db.meals.find({ chef: ObjectId("..."), isActive: true })
     * 
     * @param chef User object with role="chef"
     * @param isActive true for active meals, false for discontinued
     * @return List<Meal> - filtered meals
     */
    List<Meal> findByChefAndIsActive(User chef, Boolean isActive);
    
    /**
     * Find all active meals, sorted by creation date (newest first)
     * Used for: Browse meals page showing recent additions
     * 
     * MongoDB query: db.meals.find({ isActive: true }).sort({ createdAt: -1 })
     * 
     * @param isActive true to get only active meals
     * @return List<Meal> - active meals ordered by newest first
     */
    List<Meal> findByIsActiveOrderByCreatedAtDesc(Boolean isActive);
    
    /**
     * Find active meals with pagination support
     * Used for: Browse meals page with infinite scroll or page navigation
     * Prevents loading all meals at once - loads in chunks (e.g., 20 per page)
     * 
     * MongoDB query: db.meals.find({ isActive: true }).limit(20).skip(0)
     * 
     * @param isActive true for active meals
     * @param pageable Pagination info (page number, size, sorting)
     * @return Page<Meal> - paginated results with metadata (total pages, current page, etc.)
     */
    Page<Meal> findByIsActive(Boolean isActive, Pageable pageable);
    
    /**
     * Count active meals by a specific chef
     * Used for: Chef statistics, admin analytics
     * 
     * MongoDB query: db.meals.count({ chef: ObjectId("..."), isActive: true })
     * 
     * @param chef User object with role="chef"
     * @param isActive true to count only active meals
     * @return long - number of meals
     */
    long countByChefAndIsActive(User chef, Boolean isActive);
    
    /**
     * Find meals by chef with pagination and sorting
     * Used for: Chef dashboard with pagination
     * 
     * @param chef User object with role="chef"
     * @param pageable Pagination and sorting parameters
     * @return Page<Meal> - paginated meals
     */
    Page<Meal> findByChef(User chef, Pageable pageable);
    
    /**
     * Find meals by price range (between min and max price)
     * Used for: Price filter on browse meals page
     * 
     * MongoDB query: db.meals.find({ price: { $gte: minPrice, $lte: maxPrice }, isActive: true })
     * 
     * @param minPrice Minimum price (inclusive)
     * @param maxPrice Maximum price (inclusive)
     * @param isActive true for active meals only
     * @return List<Meal> - meals within price range
     */
    List<Meal> findByPriceBetweenAndIsActive(Double minPrice, Double maxPrice, Boolean isActive);
}
