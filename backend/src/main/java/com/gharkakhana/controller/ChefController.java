package com.gharkakhana.controller;

import com.gharkakhana.entity.User;
import com.gharkakhana.entity.UserRole;
import com.gharkakhana.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/chefs")
@CrossOrigin(origins = "*")
public class ChefController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> registerChef(@RequestBody User chef) {
        chef.setRole(UserRole.CHEF);
        User savedChef = userService.registerUser(chef);
        return ResponseEntity.ok(savedChef);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginChef(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        
        String token = userService.loginUser(email, password);
        if (token != null) {
            return ResponseEntity.ok(Map.of("token", token));
        }
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getChefById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}