package com.yourapp.backend.repository;

import com.yourapp.backend.model.Meal;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MealRepository extends MongoRepository<Meal, String> {
    List<Meal> findByChefId(String chefId);
}
