package com.yourapp.backend.controller;

// Import models
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.yourapp.backend.model.Order;
import com.yourapp.backend.model.Order.OrderStatus;
import com.yourapp.backend.model.Order.PaymentStatus;
import com.yourapp.backend.service.OrderService;

import jakarta.validation.Valid;

/**
 * REST Controller for Order endpoints
 * 
 * Handles:
 * - POST /api/orders - Place order
 * - GET /api/orders/my-orders - User's order history
 * - GET /api/orders/chef-orders - Chef's orders
 * - GET /api/orders/:id - Get order by ID
 * - PUT /api/orders/:id/status - Update order status
 * - PUT /api/orders/:id/payment - Update payment status
 * - DELETE /api/orders/:id - Cancel order
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    // ===== DEPENDENCIES =====
    
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // ===== ENDPOINTS =====
    
    /**
     * Place a new order
     * 
     * Endpoint: POST /api/orders
     * Request Body: { mealId, quantity, deliveryNotes }
     * 
     * Process:
     * 1. Get user ID from JWT token
     * 2. Validate meal exists and is active
     * 3. Calculate total price
     * 4. Create order
     * 
     * @param request Order request with mealId, quantity, deliveryNotes
     * @param userDetails Authenticated user from JWT
     * @return ResponseEntity with created order or error
     */
    @PostMapping
    public ResponseEntity<?> placeOrder(
            @Valid @RequestBody OrderRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        // Check authentication
        if (userDetails == null) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Authentication required"));
        }
        
        try {
            // Get user email from JWT
            String userEmail = userDetails.getUsername();
            
            // Call service to place order
            // Service validates meal, calculates total, creates order
            Order created = orderService.placeOrder(
                userEmail,
                request.getMealId(),
                request.getQuantity(),
                request.getDeliveryNotes(),
                true
            );
            
            return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(created);
                
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        }
    }
    
    /**
     * Get authenticated user's order history
     * 
     * Endpoint: GET /api/orders/my-orders
     * 
     * @param userDetails Authenticated user
     * @return ResponseEntity with list of orders
     */
    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Authentication required"));
        }
        
        try {
            String userEmail = userDetails.getUsername();
            List<Order> orders = orderService.getOrdersByUser(userEmail, true);
            return ResponseEntity.ok(orders);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        }
    }
    
    /**
     * Get chef's orders (chef only)
     * 
     * Endpoint: GET /api/orders/chef-orders
     * 
     * @param userDetails Authenticated user (must be chef)
     * @return ResponseEntity with list of orders
     */
    @GetMapping("/chef-orders")
    public ResponseEntity<?> getChefOrders(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Authentication required"));
        }
        
        try {
            String chefEmail = userDetails.getUsername();
            List<Order> orders = orderService.getOrdersByChef(chefEmail, true);
            return ResponseEntity.ok(orders);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        }
    }
    
    /**
     * Get order by ID
     * 
     * Endpoint: GET /api/orders/:id
     * 
     * @param id Order ID
     * @param userDetails Authenticated user
     * @return ResponseEntity with order or error
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        if (userDetails == null) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Authentication required"));
        }
        
        try {
            String userEmail = userDetails.getUsername();
            Optional<Order> orderOpt = orderService.getOrderById(id, userEmail, true);
            
            if (orderOpt.isEmpty()) {
                return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Order not found"));
            }
            
            return ResponseEntity.ok(orderOpt.get());
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(Map.of("message", e.getMessage()));
        }
    }
    
    /**
     * Update order status
     * 
     * Endpoint: PUT /api/orders/:id/status
     * Request Body: { status: "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED" }
     * 
     * @param id Order ID
     * @param request Status update request
     * @param userDetails Authenticated user
     * @return ResponseEntity with updated order
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable String id,
            @RequestBody StatusUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        if (userDetails == null) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Authentication required"));
        }
        
        try {
            String userEmail = userDetails.getUsername();
            
            // Call service to update status
            Order updated = orderService.updateOrderStatus(id, request.getStatus(), userEmail, true);
            
            return ResponseEntity.ok(updated);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        }
    }
    
    /**
     * Update payment status
     * 
     * Endpoint: PUT /api/orders/:id/payment
     * Request Body: { paymentStatus: "PAID" | "FAILED" | "REFUNDED" }
     * 
     * @param id Order ID
     * @param request Payment status update
     * @return ResponseEntity with updated order
     */
    @PutMapping("/{id}/payment")
    public ResponseEntity<?> updatePaymentStatus(
            @PathVariable String id,
            @RequestBody PaymentUpdateRequest request) {
        
        try {
            Order updated = orderService.updatePaymentStatus(id, request.getPaymentStatus());
            return ResponseEntity.ok(updated);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        }
    }
    
    /**
     * Cancel an order
     * 
     * Endpoint: DELETE /api/orders/:id
     * 
     * @param id Order ID
     * @param userDetails Authenticated user
     * @return ResponseEntity with success message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelOrder(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        
        if (userDetails == null) {
            return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Authentication required"));
        }
        
        try {
            String userEmail = userDetails.getUsername();
            
            Order cancelled = orderService.cancelOrder(id, userEmail, true);
            
            return ResponseEntity.ok(Map.of(
                "message", "Order cancelled successfully",
                "order", cancelled
            ));
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        }
    }
    
    // ===== REQUEST DTOs (Inner Classes) =====
    
    /**
     * DTO for placing an order
     */
    public static class OrderRequest {
        private String mealId;
        private Integer quantity;
        private String deliveryNotes;
        
        // Getters and setters
        public String getMealId() { return mealId; }
        public void setMealId(String mealId) { this.mealId = mealId; }
        
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        
        public String getDeliveryNotes() { return deliveryNotes; }
        public void setDeliveryNotes(String deliveryNotes) { this.deliveryNotes = deliveryNotes; }
    }
    
    /**
     * DTO for updating order status
     */
    public static class StatusUpdateRequest {
        private OrderStatus status;
        
        public OrderStatus getStatus() { return status; }
        public void setStatus(OrderStatus status) { this.status = status; }
    }
    
    /**
     * DTO for updating payment status
     */
    public static class PaymentUpdateRequest {
        private PaymentStatus paymentStatus;
        
        public PaymentStatus getPaymentStatus() { return paymentStatus; }
        public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }
    }
}
