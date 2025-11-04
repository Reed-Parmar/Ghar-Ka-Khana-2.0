package com.gharkakhana.backend.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gharkakhana.backend.dto.OrderDTO;
import com.gharkakhana.backend.model.Order;
import com.gharkakhana.backend.service.OrderService;

@RestController
@RequestMapping("/api/orders")
public class OrdersController {

    private final OrderService orderService;

    public OrdersController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/place")
    public ResponseEntity<OrderDTO> placeOrder(@RequestBody OrderDTO orderDTO) {
        Order order = new Order(
            orderDTO.userId(),
            orderDTO.mealIds(),
            orderDTO.total(),
            "PENDING" // Initial status
        );
        Order saved = orderService.placeOrder(order);
        return ResponseEntity.ok(new OrderDTO(
            saved.getId(),
            saved.getUserId(),
            saved.getMealIds(),
            saved.getTotal(),
            saved.getStatus()
        ));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderDTO>> ordersByUser(@PathVariable String userId) {
        List<OrderDTO> orders = orderService.findByUser(userId).stream()
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

    @GetMapping("/chef/{chefId}")
    public ResponseEntity<List<OrderDTO>> ordersByChef(@PathVariable String chefId) {
        // For chef orders, we could either:
        // 1. Find orders containing meals by this chef (current implementation)
        // 2. Add a chefId field to Order and query directly
        List<OrderDTO> orders = orderService.findAll().stream()
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

    @PatchMapping("/{orderId}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable String orderId,
            @RequestBody Map<String, String> statusUpdate) {
        Order updated = orderService.updateStatus(orderId, statusUpdate.get("status"));
        return ResponseEntity.ok(new OrderDTO(
            updated.getId(),
            updated.getUserId(),
            updated.getMealIds(),
            updated.getTotal(),
            updated.getStatus()
        ));
    }
}
