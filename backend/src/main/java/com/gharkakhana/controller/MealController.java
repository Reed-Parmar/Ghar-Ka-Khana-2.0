package com.gharkakhana.controller;

import com.gharkakhana.entity.Meal;
import com.gharkakhana.service.MealService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/meals")
@CrossOrigin(origins = "*")
public class MealController {
    @Autowired
    private MealService mealService;

    @PostMapping("/upload")
    public ResponseEntity<Meal> uploadMeal(@RequestBody Meal meal) {
        Meal savedMeal = mealService.uploadMeal(meal);
        return ResponseEntity.ok(savedMeal);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Meal>> getAllMeals() {
        List<Meal> meals = mealService.getAllMeals();
        return ResponseEntity.ok(meals);
    }

    @GetMapping("/chef/{chefId}")
    public ResponseEntity<List<Meal>> getMealsByChefId(@PathVariable Long chefId) {
        List<Meal> meals = mealService.getMealsByChefId(chefId);
        return ResponseEntity.ok(meals);
    }
}
