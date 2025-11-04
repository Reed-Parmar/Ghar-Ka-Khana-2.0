package com.gharkakhana.backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.gharkakhana.backend.model.Order;

public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByUserId(String userId);
    List<Order> findByMealIdsContaining(String mealId);
    List<Order> findByStatus(String status);
}