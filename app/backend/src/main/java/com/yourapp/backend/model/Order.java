package com.yourapp.backend.model;

// Import Spring Data MongoDB annotations for entity mapping and relationships
import java.time.Instant;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * Order entity representing meal orders placed by users
 * This model matches the Mongoose Order schema from the Node.js backend
 * Collection name in MongoDB: "orders"
 * 
 * Indexes:
 * - Index on user + createdAt for user's order history (descending by date)
 * - Index on chef + createdAt for chef's order history (descending by date)
 * - Index on meal for meal popularity tracking
 * - Index on status for filtering orders by status
 */
@Document(collection = "orders") // Maps to "orders" collection in MongoDB
@CompoundIndexes({
    @CompoundIndex(name = "user_created_idx", def = "{'user': 1, 'createdAt': -1}"), // For user's order history
    @CompoundIndex(name = "chef_created_idx", def = "{'chef': 1, 'createdAt': -1}"), // For chef's order history
})
public class Order {

    // ==================== ENUMS ====================
    
    /**
     * Order status lifecycle:
     * pending -> confirmed -> preparing -> ready -> delivered (success)
     * OR any status -> cancelled (cancellation)
     */
    public enum OrderStatus {
        PENDING,    // Order placed, awaiting confirmation
        CONFIRMED,  // Chef confirmed the order
        PREPARING,  // Chef is preparing the meal
        READY,      // Meal is ready for pickup/delivery
        DELIVERED,  // Order completed successfully
        CANCELLED   // Order was cancelled
    }

    /**
     * Payment status tracking
     */
    public enum PaymentStatus {
        PENDING,   // Payment not yet processed
        PAID,      // Payment successful
        FAILED,    // Payment failed
        REFUNDED   // Payment was refunded
    }

    // ==================== FIELDS ====================
    
    @Id // MongoDB's ObjectId, auto-generated
    private String id;

    @DBRef // Reference to User document (the customer)
    @NotNull(message = "User reference is required")
    @Indexed // Index for faster queries by user
    private User user; // The student/customer who placed the order

    @DBRef // Reference to Meal document
    @NotNull(message = "Meal reference is required")
    @Indexed // Index for meal popularity tracking
    private Meal meal; // The meal being ordered

    @DBRef // Reference to User document (the chef)
    @NotNull(message = "Chef reference is required")
    @Indexed // Index for faster queries by chef
    private User chef; // The chef who will prepare this order

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1") // Minimum 1 item
    private Integer quantity; // Number of portions ordered

    @NotNull(message = "Total price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Total price cannot be negative")
    private Double totalPrice; // Total cost (meal price * quantity)

    @NotNull(message = "Order status is required")
    @Indexed // Index for filtering by status
    private OrderStatus status = OrderStatus.PENDING; // Current order status (default: PENDING)

    @NotNull(message = "Payment status is required")
    private PaymentStatus paymentStatus = PaymentStatus.PENDING; // Payment status (default: PENDING)

    @Size(max = 200, message = "Delivery notes cannot exceed 200 characters") // Matches Mongoose maxlength
    private String deliveryNotes; // Optional: Special instructions from customer

    @CreatedDate // Automatically set when order is created
    private Instant createdAt;

    @LastModifiedDate // Automatically updated when order is modified
    private Instant updatedAt;

    // ==================== CONSTRUCTORS ====================
    
    /**
     * Default constructor required by Spring Data MongoDB
     */
    public Order() {
        this.status = OrderStatus.PENDING;
        this.paymentStatus = PaymentStatus.PENDING;
    }

    /**
     * Constructor with essential fields
     * @param user The customer placing the order
     * @param meal The meal being ordered
     * @param chef The chef preparing the order
     * @param quantity Number of portions
     * @param totalPrice Total cost
     */
    public Order(User user, Meal meal, User chef, Integer quantity, Double totalPrice) {
        this.user = user;
        this.meal = meal;
        this.chef = chef;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
        this.status = OrderStatus.PENDING;
        this.paymentStatus = PaymentStatus.PENDING;
    }

    // ==================== GETTERS AND SETTERS ====================
    
    /**
     * @return MongoDB ObjectId as String
     */
    public String getId() {
        return id;
    }

    /**
     * Sets the order ID (typically only used by MongoDB)
     * @param id MongoDB ObjectId
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * @return The customer who placed the order
     */
    public User getUser() {
        return user;
    }

    /**
     * Sets the customer for this order
     * @param user User object (customer)
     */
    public void setUser(User user) {
        this.user = user;
    }

    /**
     * @return The meal being ordered
     */
    public Meal getMeal() {
        return meal;
    }

    /**
     * Sets the meal for this order
     * @param meal Meal object
     */
    public void setMeal(Meal meal) {
        this.meal = meal;
    }

    /**
     * @return The chef preparing this order
     */
    public User getChef() {
        return chef;
    }

    /**
     * Sets the chef for this order
     * @param chef User object with role="chef"
     */
    public void setChef(User chef) {
        this.chef = chef;
    }

    /**
     * @return Number of portions ordered
     */
    public Integer getQuantity() {
        return quantity;
    }

    /**
     * Sets the order quantity
     * @param quantity Number of portions (minimum 1)
     */
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    /**
     * @return Total price for this order
     */
    public Double getTotalPrice() {
        return totalPrice;
    }

    /**
     * Sets the total price
     * @param totalPrice Non-negative price value
     */
    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    /**
     * @return Current order status
     */
    public OrderStatus getStatus() {
        return status;
    }

    /**
     * Sets the order status
     * @param status OrderStatus enum value
     */
    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    /**
     * @return Current payment status
     */
    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    /**
     * Sets the payment status
     * @param paymentStatus PaymentStatus enum value
     */
    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    /**
     * @return Special delivery instructions (nullable)
     */
    public String getDeliveryNotes() {
        return deliveryNotes;
    }

    /**
     * Sets delivery notes/special instructions
     * @param deliveryNotes Instructions (max 200 characters)
     */
    public void setDeliveryNotes(String deliveryNotes) {
        this.deliveryNotes = deliveryNotes;
    }

    /**
     * @return Timestamp when order was created
     */
    public Instant getCreatedAt() {
        return createdAt;
    }

    /**
     * Sets creation timestamp (typically handled automatically by @CreatedDate)
     * @param createdAt Creation timestamp
     */
    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    /**
     * @return Timestamp when order was last updated
     */
    public Instant getUpdatedAt() {
        return updatedAt;
    }

    /**
     * Sets last modified timestamp (typically handled automatically by @LastModifiedDate)
     * @param updatedAt Last modification timestamp
     */
    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
