package com.yourapp.backend.controller;

import com.yourapp.backend.model.Chef;
import com.yourapp.backend.service.ChefService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chefs")
public class ChefController {

    private final ChefService chefService;

    public ChefController(ChefService chefService) {
        this.chefService = chefService;
    }

    @GetMapping
    public ResponseEntity<List<Chef>> listChefs() {
        return ResponseEntity.ok(chefService.getAllApproved());
    }

    @GetMapping("/{chefId}")
    public ResponseEntity<?> getChef(@PathVariable String chefId) {
        return chefService.findById(chefId).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}
