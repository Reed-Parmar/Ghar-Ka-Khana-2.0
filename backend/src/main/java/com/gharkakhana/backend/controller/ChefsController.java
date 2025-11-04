package com.gharkakhana.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chefs")
public class ChefsController {

    @GetMapping
    public ResponseEntity<List<Map<String, String>>> listChefs() {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/{chefId}")
    public ResponseEntity<Map<String, String>> getChef(@PathVariable String chefId) {
        return ResponseEntity.ok(Map.of("message", "get chef " + chefId + " not implemented"));
    }

    @GetMapping("/{chefId}/meals")
    public ResponseEntity<List<Map<String, String>>> chefMeals(@PathVariable String chefId) {
        return ResponseEntity.ok(List.of());
    }

    @GetMapping("/{chefId}/reviews")
    public ResponseEntity<List<Map<String, String>>> chefReviews(@PathVariable String chefId) {
        return ResponseEntity.ok(List.of());
    }
}
