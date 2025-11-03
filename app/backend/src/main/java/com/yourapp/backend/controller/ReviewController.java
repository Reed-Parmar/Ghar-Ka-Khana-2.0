package com.yourapp.backend.controller;

import com.yourapp.backend.model.Review;
import com.yourapp.backend.repository.ReviewRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meals")
public class ReviewController {

    private final ReviewRepository reviewRepository;

    public ReviewController(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    @GetMapping("/{mealId}/reviews")
    public ResponseEntity<List<Review>> getReviews(@PathVariable String mealId) {
        return ResponseEntity.ok(reviewRepository.findByMealId(mealId));
    }

    @PostMapping("/{mealId}/reviews")
    public ResponseEntity<Review> addReview(@PathVariable String mealId, @Valid @RequestBody Review review) {
        review.setMealId(mealId);
        Review saved = reviewRepository.save(review);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
}
