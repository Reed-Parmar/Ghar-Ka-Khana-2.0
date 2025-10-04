package com.gharkakhana.repository;

import com.gharkakhana.entity.Meal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface MealRepository extends JpaRepository<Meal, Long> {
    List<Meal> findByIsPublishedTrueAndIsActiveTrue();
    List<Meal> findByChefIdAndIsActiveTrue(Long chefId);
    List<Meal> findByAvailableDateAndIsPublishedTrueAndIsActiveTrue(LocalDate date);
    
    @Query("SELECT m FROM Meal m WHERE m.isPublished = true AND m.isActive = true AND " +
           "(:cuisineType IS NULL OR m.cuisineType = :cuisineType) AND " +
           "(:dietaryPreference IS NULL OR m.dietaryPreference = :dietaryPreference) AND " +
           "(:mealType IS NULL OR m.mealType = :mealType)")
    List<Meal> findFilteredMeals(@Param("cuisineType") String cuisineType,
                                @Param("dietaryPreference") String dietaryPreference,
                                @Param("mealType") String mealType);
}

