package com.gharkakhana.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.gharkakhana.backend.model.Order;
import com.gharkakhana.backend.repository.OrderRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public Order placeOrder(Order order) {
        return orderRepository.save(order);
    }

    public Optional<Order> findById(String id) {
        return orderRepository.findById(id);
    }

    public List<Order> findByUser(String userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> findByMeal(String mealId) {
        return orderRepository.findByMealIdsContaining(mealId);
    }

    public List<Order> findByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    public List<Order> findAll() {
        return orderRepository.findAll();
    }

    public Order updateStatus(String orderId, String newStatus) {
        return orderRepository.findById(orderId)
                .map(order -> {
                    order.setStatus(newStatus);
                    return orderRepository.save(order);
                })
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
}