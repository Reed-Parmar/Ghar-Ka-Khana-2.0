package com.yourapp.backend.service;

import com.yourapp.backend.model.Meal;
import com.yourapp.backend.repository.MealRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MealService {

    private final MealRepository mealRepository;

    public MealService(MealRepository mealRepository) {
        this.mealRepository = mealRepository;
    }

    public Meal createMeal(Meal meal) {
        return mealRepository.save(meal);
    }

    public List<Meal> getAllMeals() {
        return mealRepository.findAll();
    }

    public List<Meal> getMealsByChef(String chefId) {
        return mealRepository.findByChefId(chefId);
    }
}
