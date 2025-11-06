package com.yourapp.backend.service;

// Import models
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.yourapp.backend.model.Meal;
import com.yourapp.backend.model.Order;
import com.yourapp.backend.model.Order.OrderStatus;
import com.yourapp.backend.model.Order.PaymentStatus;
import com.yourapp.backend.model.User;
import com.yourapp.backend.repository.MealRepository;
import com.yourapp.backend.repository.OrderRepository;
import com.yourapp.backend.repository.UserRepository;

/**
 * Service layer for Order-related business logic
 * 
 * Responsibilities:
 * - Place new orders with total price calculation
 * - Update order status (PENDING → CONFIRMED → PREPARING → READY → DELIVERED)
 * - Update payment status (PENDING → PAID / FAILED / REFUNDED)
 * - Retrieve orders by user, chef, status
 * - Validate order data and authorization
 */
@Service
public class OrderService {

    // ===== DEPENDENCIES =====
    
    /**
     * OrderRepository for order database operations
     */
    private final OrderRepository orderRepository;
    
    /**
     * UserRepository for customer/chef validation
     */
    private final UserRepository userRepository;
    
    /**
     * MealRepository for meal validation and price lookup
     */
    private final MealRepository mealRepository;

    /**
     * Constructor for dependency injection
     * 
     * @param orderRepository Injected by Spring
     * @param userRepository Injected by Spring
     * @param mealRepository Injected by Spring
     */
    public OrderService(OrderRepository orderRepository, UserRepository userRepository, MealRepository mealRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.mealRepository = mealRepository;
    }

    // ===== BUSINESS METHODS =====
    
    /**
     * Place a new order
     * 
     * Process:
     * 1. Validate user exists (customer)
     * 2. Validate meal exists and is active
     * 3. Get chef from meal
     * 4. Calculate total price (meal price × quantity)
     * 5. Set order defaults (status, payment status)
     * 6. Save order
     * 
     * Used by: OrderController for placing orders
     * 
     * @param userId Customer's user ID (from JWT token)
     * @param mealId Meal ID being ordered
     * @param quantity Number of meals
     * @param deliveryNotes Optional delivery instructions
     * @return Order The saved order
     * @throws IllegalArgumentException if user/meal not found or meal inactive
     */
    public Order placeOrder(String userId, String mealId, Integer quantity, String deliveryNotes) {
        // Step 1: Validate quantity
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }
        
        // Step 2: Fetch and validate user (customer)
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found with ID: " + userId);
        }
        User user = userOpt.get();
        
        // Step 3: Fetch and validate meal
        Optional<Meal> mealOpt = mealRepository.findById(mealId);
        if (mealOpt.isEmpty()) {
            throw new IllegalArgumentException("Meal not found with ID: " + mealId);
        }
        Meal meal = mealOpt.get();
        
        // Step 4: Check if meal is active
        if (!meal.getIsActive()) {
            throw new IllegalArgumentException("Meal is not available");
        }
        
        // Step 5: Get chef from meal's @DBRef
        User chef = meal.getChef();
        
        // Step 6: Calculate total price
        // Example: meal price = ₹100, quantity = 3 → total = ₹300
        Double totalPrice = meal.getPrice() * quantity;
        
        // Step 7: Create new order
        Order order = new Order();
        
        // Set relationships using @DBRef
        order.setUser(user);        // Customer who placed order
        order.setMeal(meal);        // Meal being ordered
        order.setChef(chef);        // Chef who will prepare the meal
        
        // Set order details
        order.setQuantity(quantity);
        order.setTotalPrice(totalPrice);
        order.setDeliveryNotes(deliveryNotes);
        
        // Set initial statuses
        // New orders start as PENDING (waiting for chef confirmation)
        order.setStatus(OrderStatus.PENDING);
        // Payment is also PENDING (will be PAID after payment gateway success)
        order.setPaymentStatus(PaymentStatus.PENDING);
        
        // Step 8: Save to database
        // @CreatedDate and @LastModifiedDate are auto-set
        return orderRepository.save(order);
    }
    
    /**
     * Update order status
     * 
     * Status flow: PENDING → CONFIRMED → PREPARING → READY → DELIVERED
     * Only chefs can update to CONFIRMED/PREPARING/READY
     * Only customers can update to DELIVERED (after pickup)
     * 
     * @param orderId Order ID
     * @param newStatus New order status
     * @param userId User ID making the update (for authorization)
     * @return Order Updated order
     * @throws IllegalArgumentException if order not found or unauthorized
     */
    public Order updateOrderStatus(String orderId, OrderStatus newStatus, String userId) {
        // Step 1: Fetch order
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new IllegalArgumentException("Order not found");
        }
        Order order = orderOpt.get();
        
        // Step 2: Authorization check
        // Chefs can update to CONFIRMED, PREPARING, READY
        // Customers can update to DELIVERED (after pickup)
        boolean isChef = order.getChef().getId().equals(userId);
        boolean isCustomer = order.getUser().getId().equals(userId);
        
        if (!isChef && !isCustomer) {
            throw new IllegalArgumentException("Not authorized to update this order");
        }
        
        // Step 3: Validate status transitions
        if (newStatus == OrderStatus.DELIVERED && !isCustomer) {
            throw new IllegalArgumentException("Only customer can mark order as delivered");
        }
        if ((newStatus == OrderStatus.CONFIRMED || newStatus == OrderStatus.PREPARING || newStatus == OrderStatus.READY) && !isChef) {
            throw new IllegalArgumentException("Only chef can update to this status");
        }
        
        // Step 4: Update status
        order.setStatus(newStatus);
        
        // Step 5: Save and return
        // @LastModifiedDate is auto-updated
        return orderRepository.save(order);
    }
    
    /**
     * Update payment status
     * 
     * Used after payment gateway response
     * PENDING → PAID (success) or FAILED (failure)
     * 
     * @param orderId Order ID
     * @param newPaymentStatus New payment status
     * @return Order Updated order
     * @throws IllegalArgumentException if order not found
     */
    public Order updatePaymentStatus(String orderId, PaymentStatus newPaymentStatus) {
        // Fetch order
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new IllegalArgumentException("Order not found");
        }
        Order order = orderOpt.get();
        
        // Update payment status
        order.setPaymentStatus(newPaymentStatus);
        
        // Save and return
        return orderRepository.save(order);
    }
    
    /**
     * Get all orders by a user (customer's order history)
     * Used for: Student dashboard
     * 
     * @param userId Customer's user ID
     * @return List<Order> All orders by this user, sorted newest first
     * @throws IllegalArgumentException if user not found
     */
    public List<Order> getOrdersByUser(String userId) {
        // Fetch user
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }
        User user = userOpt.get();
        
        // Get orders sorted by creation date (newest first)
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }
    
    /**
     * Get all orders for a chef
     * Used for: Chef dashboard showing orders to prepare
     * 
     * @param chefId Chef's user ID
     * @return List<Order> All orders for this chef, sorted newest first
     * @throws IllegalArgumentException if chef not found
     */
    public List<Order> getOrdersByChef(String chefId) {
        // Fetch chef
        Optional<User> chefOpt = userRepository.findById(chefId);
        if (chefOpt.isEmpty()) {
            throw new IllegalArgumentException("Chef not found");
        }
        User chef = chefOpt.get();
        
        // Get orders sorted by creation date (newest first)
        return orderRepository.findByChefOrderByCreatedAtDesc(chef);
    }
    
    /**
     * Get a single order by ID
     * Used for: Order details page
     * 
     * @param orderId Order ID
     * @param userId User ID (for authorization)
     * @return Optional<Order> Order if found and authorized
     * @throws IllegalArgumentException if not authorized
     */
    public Optional<Order> getOrderById(String orderId, String userId) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            
            // Authorization: only customer, chef, or admin can view
            boolean isCustomer = order.getUser().getId().equals(userId);
            boolean isChef = order.getChef().getId().equals(userId);
            
            if (!isCustomer && !isChef) {
                // Check if user is admin
                Optional<User> userOpt = userRepository.findById(userId);
                if (userOpt.isEmpty() || !"admin".equals(userOpt.get().getRole())) {
                    throw new IllegalArgumentException("Not authorized to view this order");
                }
            }
        }
        
        return orderOpt;
    }
    
    /**
     * Get orders by status
     * Used for: Admin dashboard filtering
     * 
     * @param status Order status
     * @return List<Order> Orders with that status
     */
    public List<Order> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status);
    }
    
    /**
     * Get pending orders for a chef
     * Used for: Chef dashboard showing orders awaiting confirmation
     * 
     * @param chefId Chef's user ID
     * @return List<Order> Pending orders
     * @throws IllegalArgumentException if chef not found
     */
    public List<Order> getPendingOrdersByChef(String chefId) {
        Optional<User> chefOpt = userRepository.findById(chefId);
        if (chefOpt.isEmpty()) {
            throw new IllegalArgumentException("Chef not found");
        }
        User chef = chefOpt.get();
        
        return orderRepository.findByChefAndStatus(chef, OrderStatus.PENDING);
    }
    
    /**
     * Cancel an order
     * 
     * Business rules:
     * - Only PENDING or CONFIRMED orders can be cancelled
     * - Customer or chef can cancel
     * - If payment was PAID, change to REFUNDED
     * 
     * @param orderId Order ID
     * @param userId User ID making cancellation
     * @return Order Cancelled order
     * @throws IllegalArgumentException if order can't be cancelled
     */
    public Order cancelOrder(String orderId, String userId) {
        // Fetch order
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new IllegalArgumentException("Order not found");
        }
        Order order = orderOpt.get();
        
        // Authorization check
        boolean isCustomer = order.getUser().getId().equals(userId);
        boolean isChef = order.getChef().getId().equals(userId);
        if (!isCustomer && !isChef) {
            throw new IllegalArgumentException("Not authorized to cancel this order");
        }
        
        // Can only cancel PENDING or CONFIRMED orders
        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new IllegalArgumentException("Cannot cancel order in status: " + order.getStatus());
        }
        
        // Update status to CANCELLED
        order.setStatus(OrderStatus.CANCELLED);
        
        // If payment was made, mark for refund
        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            order.setPaymentStatus(PaymentStatus.REFUNDED);
        }
        
        return orderRepository.save(order);
    }
    
    /**
     * Count total orders by user
     * Used for: User statistics
     * 
     * @param userId User ID
     * @return long Number of orders
     * @throws IllegalArgumentException if user not found
     */
    public long countOrdersByUser(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found");
        }
        User user = userOpt.get();
        
        return orderRepository.countByUser(user);
    }
    
    /**
     * Count total orders for a chef
     * Used for: Chef statistics
     * 
     * @param chefId Chef's user ID
     * @return long Number of orders
     * @throws IllegalArgumentException if chef not found
     */
    public long countOrdersByChef(String chefId) {
        Optional<User> chefOpt = userRepository.findById(chefId);
        if (chefOpt.isEmpty()) {
            throw new IllegalArgumentException("Chef not found");
        }
        User chef = chefOpt.get();
        
        return orderRepository.countByChef(chef);
    }
    
    // ===== HELPER METHODS FOR EMAIL-BASED LOOKUPS =====
    
    /**
     * Helper method to get user ID from email
     * Used by controllers that receive email from JWT token
     * 
     * @param email User email
     * @return String User ID
     * @throws IllegalArgumentException if user not found
     */
    private String getUserIdFromEmail(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found with email: " + email);
        }
        return userOpt.get().getId();
    }
    
    /**
     * Place order using user email (overload for controller use)
     * 
     * @param userEmail User's email from JWT
     * @param mealId Meal ID
     * @param quantity Quantity
     * @param deliveryNotes Delivery notes
     * @return Order Created order
     */
    public Order placeOrder(String userEmail, String mealId, Integer quantity, String deliveryNotes, boolean isEmail) {
        if (isEmail) {
            String userId = getUserIdFromEmail(userEmail);
            return placeOrder(userId, mealId, quantity, deliveryNotes);
        }
        return placeOrder(userEmail, mealId, quantity, deliveryNotes);
    }
    
    /**
     * Get orders by user email (overload for controller use)
     * 
     * @param userEmail User's email from JWT
     * @return List<Order> Orders
     */
    public List<Order> getOrdersByUser(String userEmail, boolean isEmail) {
        if (isEmail) {
            String userId = getUserIdFromEmail(userEmail);
            return getOrdersByUser(userId);
        }
        return getOrdersByUser(userEmail);
    }
    
    /**
     * Get orders by chef email (overload for controller use)
     * 
     * @param chefEmail Chef's email from JWT
     * @return List<Order> Orders
     */
    public List<Order> getOrdersByChef(String chefEmail, boolean isEmail) {
        if (isEmail) {
            String chefId = getUserIdFromEmail(chefEmail);
            return getOrdersByChef(chefId);
        }
        return getOrdersByChef(chefEmail);
    }
    
    /**
     * Get order by ID with email-based auth (overload for controller use)
     * 
     * @param orderId Order ID
     * @param userEmail User email from JWT
     * @return Optional<Order> Order
     */
    public Optional<Order> getOrderById(String orderId, String userEmail, boolean isEmail) {
        if (isEmail) {
            String userId = getUserIdFromEmail(userEmail);
            return getOrderById(orderId, userId);
        }
        return getOrderById(orderId, userEmail);
    }
    
    /**
     * Update order status with email-based auth (overload for controller use)
     * 
     * @param orderId Order ID
     * @param newStatus New status
     * @param userEmail User email from JWT
     * @return Order Updated order
     */
    public Order updateOrderStatus(String orderId, OrderStatus newStatus, String userEmail, boolean isEmail) {
        if (isEmail) {
            String userId = getUserIdFromEmail(userEmail);
            return updateOrderStatus(orderId, newStatus, userId);
        }
        return updateOrderStatus(orderId, newStatus, userEmail);
    }
    
    /**
     * Cancel order with email-based auth (overload for controller use)
     * 
     * @param orderId Order ID
     * @param userEmail User email from JWT
     * @return Order Cancelled order
     */
    public Order cancelOrder(String orderId, String userEmail, boolean isEmail) {
        if (isEmail) {
            String userId = getUserIdFromEmail(userEmail);
            return cancelOrder(orderId, userId);
        }
        return cancelOrder(orderId, userEmail);
    }
}
