package com.gharkakhana.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.gharkakhana.backend.model.Meal;

public interface MealRepository extends MongoRepository<Meal, String> {
    List<Meal> findByChefId(String chefId);
    List<Meal> findByTagsContaining(String tag);
    List<Meal> findByPriceBetween(double minPrice, double maxPrice);
}