package com.gharkakhana.service;

import com.gharkakhana.entity.Order;
import com.gharkakhana.entity.Meal;
import com.gharkakhana.entity.User;
import com.gharkakhana.repository.OrderRepository;
import com.gharkakhana.repository.MealRepository;
import com.gharkakhana.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private MealRepository mealRepository;
    
    @Autowired
    private UserRepository userRepository;

    public Order placeOrder(Order order) {
        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getOrdersByChefId(Long chefId) {
        return orderRepository.findByMealChefId(chefId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
}
