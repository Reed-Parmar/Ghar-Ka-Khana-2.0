package com.gharkakhana.controller;

import com.gharkakhana.entity.Chef;
import com.gharkakhana.entity.Meal;
import com.gharkakhana.entity.Order;
import com.gharkakhana.service.ChefService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/chef")
@CrossOrigin(origins = "*")
public class ChefController {
    @Autowired
    private ChefService chefService;

    @PostMapping("/register")
    public ResponseEntity<Chef> registerChef(@RequestBody Chef chef) {
        Chef savedChef = chefService.registerChef(chef);
        return ResponseEntity.ok(savedChef);
    }

    @PostMapping("/login")
    public ResponseEntity<Chef> loginChef(@RequestBody LoginRequest request) {
        Optional<Chef> chef = chefService.loginChef(request.getEmail(), request.getPassword());
        return chef.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{chefId}/meals")
    public ResponseEntity<Meal> uploadMeal(@PathVariable Long chefId, @RequestBody Meal meal) {
        // Set chef for the meal
        Optional<Chef> chef = chefService.getChefById(chefId);
        if (chef.isPresent()) {
            meal.setChef(chef.get());
            Meal savedMeal = chefService.uploadMeal(meal);
            return ResponseEntity.ok(savedMeal);
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/meals/{mealId}/publish")
    public ResponseEntity<Meal> publishMeal(@PathVariable Long mealId) {
        Meal meal = chefService.publishMeal(mealId);
        if (meal != null) {
            return ResponseEntity.ok(meal);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{chefId}/meals")
    public ResponseEntity<List<Meal>> getChefMeals(@PathVariable Long chefId) {
        List<Meal> meals = chefService.getChefMeals(chefId);
        return ResponseEntity.ok(meals);
    }

    @GetMapping("/{chefId}/orders")
    public ResponseEntity<List<Order>> getChefOrders(@PathVariable Long chefId) {
        List<Order> orders = chefService.getChefOrders(chefId);
        return ResponseEntity.ok(orders);
    }
}

class LoginRequest {
    private String email;
    private String password;
    
    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

