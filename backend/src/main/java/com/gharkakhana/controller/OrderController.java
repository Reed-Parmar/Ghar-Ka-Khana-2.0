package com.gharkakhana.controller;

import com.gharkakhana.entity.Order;
import com.gharkakhana.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping("/place")
    public ResponseEntity<Order> placeOrder(@RequestBody Order order) {
        Order savedOrder = orderService.placeOrder(order);
        return ResponseEntity.ok(savedOrder);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable Long userId) {
        List<Order> orders = orderService.getOrdersByUserId(userId);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/chef/{chefId}")
    public ResponseEntity<List<Order>> getOrdersByChefId(@PathVariable Long chefId) {
        List<Order> orders = orderService.getOrdersByChefId(chefId);
        return ResponseEntity.ok(orders);
    }
}
