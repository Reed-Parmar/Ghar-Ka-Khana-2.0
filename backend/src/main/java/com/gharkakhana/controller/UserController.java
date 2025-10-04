package com.gharkakhana.controller;

import com.gharkakhana.entity.User;
import com.gharkakhana.entity.Meal;
import com.gharkakhana.entity.Order;
import com.gharkakhana.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User savedUser = userService.registerUser(user);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<User> loginUser(@RequestBody LoginRequest request) {
        Optional<User> user = userService.loginUser(request.getEmail(), request.getPassword());
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/meals")
    public ResponseEntity<List<Meal>> getAvailableMeals() {
        List<Meal> meals = userService.getAvailableMeals();
        return ResponseEntity.ok(meals);
    }

    @PostMapping("/{userId}/orders")
    public ResponseEntity<Order> placeOrder(@PathVariable Long userId, @RequestBody Order order) {
        // Set user for the order
        Optional<User> user = userService.getUserById(userId);
        if (user.isPresent()) {
            order.setUser(user.get());
            Order savedOrder = userService.placeOrder(order);
            return ResponseEntity.ok(savedOrder);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{userId}/orders")
    public ResponseEntity<List<Order>> getUserOrders(@PathVariable Long userId) {
        List<Order> orders = userService.getUserOrders(userId);
        return ResponseEntity.ok(orders);
    }
}

