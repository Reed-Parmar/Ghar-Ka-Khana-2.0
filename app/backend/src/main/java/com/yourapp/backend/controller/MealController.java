package com.yourapp.backend.controller;

import com.yourapp.backend.model.Meal;
import com.yourapp.backend.service.MealService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meals")
public class MealController {

    private final MealService mealService;

    public MealController(MealService mealService) {
        this.mealService = mealService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Meal>> allMeals() {
        return ResponseEntity.ok(mealService.getAllMeals());
    }

    @PostMapping
    public ResponseEntity<Meal> createMeal(@Valid @RequestBody Meal meal) {
        Meal saved = mealService.createMeal(meal);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/chef/{chefId}")
    public ResponseEntity<List<Meal>> byChef(@PathVariable String chefId) {
        return ResponseEntity.ok(mealService.getMealsByChef(chefId));
    }
}
