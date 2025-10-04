package com.gharkakhana.service;

import com.gharkakhana.entity.User;
import com.gharkakhana.entity.Meal;
import com.gharkakhana.entity.Order;
import com.gharkakhana.repository.UserRepository;
import com.gharkakhana.repository.MealRepository;
import com.gharkakhana.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private MealRepository mealRepository;
    
    @Autowired
    private OrderRepository orderRepository;

    public User registerUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> loginUser(String email, String password) {
        return userRepository.findByEmail(email)
                .filter(user -> user.getPassword().equals(password) && user.getIsActive());
    }

    public List<Meal> getAvailableMeals() {
        return mealRepository.findByIsPublishedTrueAndIsActiveTrue();
    }

    public Order placeOrder(Order order) {
        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
}

