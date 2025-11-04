package com.gharkakhana.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gharkakhana.backend.dto.OrderDTO;
import com.gharkakhana.backend.dto.UserDTO;
import com.gharkakhana.backend.model.User;
import com.gharkakhana.backend.service.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/chefs")
    public ResponseEntity<List<UserDTO>> adminListChefs() {
        List<UserDTO> chefs = adminService.getAllChefs().stream()
            .map(user -> new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
            ))
            .collect(Collectors.toList());
        return ResponseEntity.ok(chefs);
    }

    @GetMapping("/orders")
    public ResponseEntity<List<OrderDTO>> adminListOrders() {
        List<OrderDTO> orders = adminService.getAllOrders().stream()
            .map(order -> new OrderDTO(
                order.getId(),
                order.getUserId(),
                order.getMealIds(),
                order.getTotal(),
                order.getStatus()
            ))
            .collect(Collectors.toList());
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> stats() {
        int totalUsers = adminService.getAllUsers().size();
        int totalChefs = adminService.getAllChefs().size();
        int totalOrders = adminService.getAllOrders().size();

        return ResponseEntity.ok(Map.of(
            "totalUsers", totalUsers,
            "totalChefs", totalChefs,
            "totalOrders", totalOrders
        ));
    }

    @PostMapping("/chefs/{chefId}/approval")
    public ResponseEntity<UserDTO> approveChef(@PathVariable String chefId) {
        User chef = adminService.approveChef(chefId);
        return ResponseEntity.ok(new UserDTO(
            chef.getId(),
            chef.getName(),
            chef.getEmail(),
            chef.getRole()
        ));
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable String userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.noContent().build();
    }
}
