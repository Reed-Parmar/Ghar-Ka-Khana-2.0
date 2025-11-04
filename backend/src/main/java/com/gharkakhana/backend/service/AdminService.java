package com.gharkakhana.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.gharkakhana.backend.model.Order;
import com.gharkakhana.backend.model.User;
import com.gharkakhana.backend.repository.OrderRepository;
import com.gharkakhana.backend.repository.UserRepository;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public AdminService(UserRepository userRepository, OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    public List<User> getAllChefs() {
        return userRepository.findByRole("CHEF").stream().toList();
    }

    public User approveChef(String chefId) {
        return userRepository.findById(chefId)
                .map(chef -> {
                    // Additional logic for chef approval
                    return userRepository.save(chef);
                })
                .orElseThrow(() -> new RuntimeException("Chef not found"));
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }
}