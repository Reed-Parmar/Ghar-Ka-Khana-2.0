package com.yourapp.backend.controller;

// Import models
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yourapp.backend.model.Meal;
import com.yourapp.backend.service.MealService;

import jakarta.validation.Valid;

/**
 * REST Controller for Meal endpoints
 * 
 * Handles:
 * - GET /api/meals - Get all active meals
 * - GET /api/meals/:id - Get meal by ID
 * - POST /api/meals - Create meal (chef only)
 * - PUT /api/meals/:id - Update meal (chef only)
 * - DELETE /api/meals/:id - Deactivate meal (chef only)
 * - GET /api/meals/chef/:chefId - Get meals by chef
 */
@RestController
@RequestMapping("/api/meals")
public class MealController {

    // ===== DEPENDENCIES =====
    
    private final MealService mealService;

    public MealController(MealService mealService) {
        this.mealService = mealService;
    }

    // ===== ENDPOINTS =====
    
    /**
     * Get all active meals
     * 
     * Endpoint: GET /api/meals
     * 
     * Returns all meals where isActive=true, sorted by newest first
     * Used for: Browse meals page
     * 
     * @return ResponseEntity with list of active meals
     */
    @GetMapping
    public ResponseEntity<?> getAllActiveMeals() {
        // Use DTO-based response to avoid DBRef mapping issues across legacy data
        return ResponseEntity.ok(mealService.getAllActiveMealsDTO());
    }
    
    /**
     * Get meal by ID
     * 
     * Endpoint: GET /api/meals/:id
     * 
     * @param id Meal ID
     * @return ResponseEntity with meal or 404
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getMealById(@PathVariable String id) {
        Optional<Meal> mealOpt = mealService.getMealById(id);
        
        if (mealOpt.isEmpty()) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Meal not found"));
        }
        
        return ResponseEntity.ok(mealOpt.get());
    }

    /**
     * Create a new meal (chef only)
     * 
     * Endpoint: POST /api/meals
     * Request Body: { mealName, description, price, imageUrl, availableTime }
     * 
     * Process:
     * 1. Get chef ID from JWT token (userDetails)
     * 2. Validate input using @Valid
     * 3. Call MealService.createMeal (validates chef, sets defaults)
     * 4. Return created meal
     * 
     * @param meal Meal object from request body
     * @param userDetails Authenticated user from JWT
     * @return ResponseEntity with created meal or error
     */
    @PostMapping
    public ResponseEntity<?> createMeal(
            @Valid @RequestBody Meal meal,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Check authentication
        if (userDetails == null) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Authentication required"));
        }
        
        try {
            // Get chef ID from authenticated user (email is username)
            // In real implementation, you'd get the actual user ID from database
            // For now, we'll need to lookup user by email to get ID
            String chefEmail = userDetails.getUsername();
            
            // Note: This is a temporary workaround - ideally JWT should contain user ID
            // For proper implementation, store user ID in JWT claims
            // For now, the service will lookup by email
            
            // Call service to create meal
            // Service validates chef role and sets relationships
            Meal saved = mealService.createMeal(meal, chefEmail, true);
            
            return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(saved);
                
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        }
    }
    
    /**
     * Update a meal (chef only, must own the meal)
     * 
     * Endpoint: PUT /api/meals/:id
     * 
     * @param id Meal ID
     * @param meal Updated meal data
     * @param userDetails Authenticated user
     * @return ResponseEntity with updated meal or error
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateMeal(
            @PathVariable String id,
            @Valid @RequestBody Meal meal,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        if (userDetails == null) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Authentication required"));
        }
        
        try {
            String chefEmail = userDetails.getUsername();
            
            // Call service to update meal
            // Service validates ownership
            Meal updated = mealService.updateMeal(id, meal, chefEmail, true);
            
            return ResponseEntity.ok(updated);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        }
    }
    
    /**
     * Deactivate a meal (soft delete, chef only)
     * 
     * Endpoint: DELETE /api/meals/:id
     * 
     * @param id Meal ID
     * @param userDetails Authenticated user
     * @return ResponseEntity with success message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deactivateMeal(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        if (userDetails == null) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Authentication required"));
        }
        
        try {
            String chefEmail = userDetails.getUsername();
            
            // Call service to deactivate meal
            mealService.deactivateMeal(id, chefEmail, true);
            
            return ResponseEntity.ok(Map.of("message", "Meal deactivated successfully"));
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * Get all meals by a specific chef
     * 
     * Endpoint: GET /api/meals/chef/:chefId
     * 
     * @param chefId Chef's user ID
     * @return ResponseEntity with list of meals
     */
    @GetMapping("/chef/{chefId}")
    public ResponseEntity<?> getMealsByChef(@PathVariable String chefId) {
        try {
            List<Meal> meals = mealService.getMealsByChef(chefId);
            return ResponseEntity.ok(meals);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        }
    }
    
    /**
     * Get active meals by chef
     * 
     * Endpoint: GET /api/meals/chef/:chefId/active
     * 
     * @param chefId Chef's user ID
     * @return ResponseEntity with active meals
     */
    @GetMapping("/chef/{chefId}/active")
    public ResponseEntity<?> getActiveMealsByChef(@PathVariable String chefId) {
        try {
            List<Meal> meals = mealService.getActiveMealsByChef(chefId);
            return ResponseEntity.ok(meals);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        }
    }
}
