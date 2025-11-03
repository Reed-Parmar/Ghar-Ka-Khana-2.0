package com.yourapp.backend.repository;

import com.yourapp.backend.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByMealId(String mealId);
}
