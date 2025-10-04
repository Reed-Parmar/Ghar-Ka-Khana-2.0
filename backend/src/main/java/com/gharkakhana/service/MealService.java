package com.gharkakhana.service;

import com.gharkakhana.entity.Meal;
import com.gharkakhana.entity.User;
import com.gharkakhana.repository.MealRepository;
import com.gharkakhana.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MealService {
    @Autowired
    private MealRepository mealRepository;
    
    @Autowired
    private UserRepository userRepository;

    public Meal uploadMeal(Meal meal) {
        return mealRepository.save(meal);
    }

    public List<Meal> getAllMeals() {
        return mealRepository.findAll();
    }

    public List<Meal> getMealsByChefId(Long chefId) {
        return mealRepository.findByChefId(chefId);
    }

    public Optional<Meal> getMealById(Long id) {
        return mealRepository.findById(id);
    }
}
