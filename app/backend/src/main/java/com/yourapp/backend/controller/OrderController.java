package com.yourapp.backend.controller;

import com.yourapp.backend.model.Order;
import com.yourapp.backend.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/place")
    public ResponseEntity<Order> placeOrder(@Valid @RequestBody Order order, @AuthenticationPrincipal UserDetails userDetails) {
        // if auth present, tie to user
        if (userDetails != null) {
            order.setUserId(userDetails.getUsername());
        }
        Order saved = orderService.placeOrder(order);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> ordersByUser(@PathVariable String userId) {
        return ResponseEntity.ok(orderService.getOrdersByUser(userId));
    }
}
