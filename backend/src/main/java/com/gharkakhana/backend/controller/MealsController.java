package com.gharkakhana.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gharkakhana.backend.dto.MealDTO;
import com.gharkakhana.backend.model.Meal;
import com.gharkakhana.backend.service.MealService;

@RestController
@RequestMapping("/api/meals")
public class MealsController {

    private final MealService mealService;

    public MealsController(MealService mealService) {
        this.mealService = mealService;
    }

    @GetMapping
    public ResponseEntity<List<MealDTO>> listMeals() {
        List<MealDTO> meals = mealService.findAll().stream()
            .map(meal -> new MealDTO(
                meal.getId(),
                meal.getName(),
                meal.getDescription(),
                meal.getPrice(),
                meal.getChefId()
            ))
            .collect(Collectors.toList());
        return ResponseEntity.ok(meals);
    }

    @GetMapping("/all")
    public ResponseEntity<List<MealDTO>> listAllMeals() {
        return listMeals(); // Same as above for now, could add filtering later
    }

    @GetMapping("/{mealId}")
    public ResponseEntity<?> getMeal(@PathVariable String mealId) {
        return mealService.findById(mealId)
            .map(meal -> ResponseEntity.ok(new MealDTO(
                meal.getId(),
                meal.getName(),
                meal.getDescription(),
                meal.getPrice(),
                meal.getChefId()
            )))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MealDTO> createMeal(@RequestBody MealDTO mealDTO) {
        Meal meal = new Meal(
            mealDTO.name(),
            mealDTO.description(),
            mealDTO.price(),
            mealDTO.chefId()
        );
        Meal saved = mealService.save(meal);
        return ResponseEntity.ok(new MealDTO(
            saved.getId(),
            saved.getName(),
            saved.getDescription(),
            saved.getPrice(),
            saved.getChefId()
        ));
    }

    @DeleteMapping("/{mealId}")
    public ResponseEntity<Void> deleteMeal(@PathVariable String mealId) {
        mealService.delete(mealId);
        return ResponseEntity.noContent().build();
    }
}
