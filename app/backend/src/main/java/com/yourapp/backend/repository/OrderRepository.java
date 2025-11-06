package com.yourapp.backend.repository;

// Import the Order, User, and Meal models
import java.time.Instant;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.yourapp.backend.model.Meal;
import com.yourapp.backend.model.Order;
import com.yourapp.backend.model.Order.OrderStatus;
import com.yourapp.backend.model.Order.PaymentStatus;
import com.yourapp.backend.model.User;

/**
 * Repository interface for Order entity
 * Extends MongoRepository for automatic CRUD operations
 * 
 * Handles complex queries involving multiple relationships (user, chef, meal)
 * All methods use @DBRef relationships - Spring Data handles the joins automatically
 */
public interface OrderRepository extends MongoRepository<Order, String> {
    
    /**
     * Find all orders by a specific user (customer)
     * Used for: Student dashboard showing order history
     * 
     * MongoDB query: db.orders.find({ user: ObjectId("...") })
     * 
     * @param user User object (customer who placed orders)
     * @return List<Order> - all orders by this user
     */
    List<Order> findByUser(User user);
    
    /**
     * Find all orders for a specific chef
     * Used for: Chef dashboard showing all orders to prepare
     * 
     * MongoDB query: db.orders.find({ chef: ObjectId("...") })
     * 
     * @param chef User object with role="chef"
     * @return List<Order> - all orders assigned to this chef
     */
    List<Order> findByChef(User chef);
    
    /**
     * Find orders by status (pending, confirmed, preparing, etc.)
     * Used for: Admin dashboard, filtering orders by status
     * 
     * MongoDB query: db.orders.find({ status: "PENDING" })
     * 
     * @param status Order status enum value
     * @return List<Order> - all orders with that status
     */
    List<Order> findByStatus(OrderStatus status);
    
    /**
     * Find user's orders sorted by creation date (newest first)
     * Used for: User order history page
     * 
     * MongoDB query: db.orders.find({ user: ObjectId("...") }).sort({ createdAt: -1 })
     * 
     * @param user User object
     * @return List<Order> - orders sorted newest to oldest
     */
    List<Order> findByUserOrderByCreatedAtDesc(User user);
    
    /**
     * Find chef's orders sorted by creation date (newest first)
     * Used for: Chef dashboard showing recent orders first
     * 
     * MongoDB query: db.orders.find({ chef: ObjectId("...") }).sort({ createdAt: -1 })
     * 
     * @param chef User object with role="chef"
     * @return List<Order> - orders sorted newest to oldest
     */
    List<Order> findByChefOrderByCreatedAtDesc(User chef);
    
    /**
     * Find orders by user and status
     * Used for: Filtering user's active vs completed orders
     * 
     * MongoDB query: db.orders.find({ user: ObjectId("..."), status: "PENDING" })
     * 
     * @param user User object
     * @param status Order status
     * @return List<Order> - filtered orders
     */
    List<Order> findByUserAndStatus(User user, OrderStatus status);
    
    /**
     * Find orders by chef and status
     * Used for: Chef filtering pending vs completed orders
     * 
     * MongoDB query: db.orders.find({ chef: ObjectId("..."), status: "CONFIRMED" })
     * 
     * @param chef User object with role="chef"
     * @param status Order status
     * @return List<Order> - filtered orders
     */
    List<Order> findByChefAndStatus(User chef, OrderStatus status);
    
    /**
     * Find all orders for a specific meal
     * Used for: Meal popularity analytics
     * 
     * MongoDB query: db.orders.find({ meal: ObjectId("...") })
     * 
     * @param meal Meal object
     * @return List<Order> - all orders for this meal
     */
    List<Order> findByMeal(Meal meal);
    
    /**
     * Count orders by user
     * Used for: User statistics (total orders placed)
     * 
     * MongoDB query: db.orders.count({ user: ObjectId("...") })
     * 
     * @param user User object
     * @return long - number of orders
     */
    long countByUser(User user);
    
    /**
     * Count orders by chef
     * Used for: Chef statistics (total orders received)
     * 
     * MongoDB query: db.orders.count({ chef: ObjectId("...") })
     * 
     * @param chef User object with role="chef"
     * @return long - number of orders
     */
    long countByChef(User chef);
    
    /**
     * Count orders by status
     * Used for: Admin dashboard statistics
     * 
     * MongoDB query: db.orders.count({ status: "DELIVERED" })
     * 
     * @param status Order status
     * @return long - number of orders
     */
    long countByStatus(OrderStatus status);
    
    /**
     * Find orders by payment status
     * Used for: Admin tracking unpaid/failed payments
     * 
     * MongoDB query: db.orders.find({ paymentStatus: "PENDING" })
     * 
     * @param paymentStatus Payment status enum
     * @return List<Order> - orders with that payment status
     */
    List<Order> findByPaymentStatus(PaymentStatus paymentStatus);
    
    /**
     * Find orders created after a certain date
     * Used for: Analytics, daily/weekly reports
     * 
     * MongoDB query: db.orders.find({ createdAt: { $gte: ISODate("2025-11-01") } })
     * 
     * @param date Start date (inclusive)
     * @return List<Order> - orders created after this date
     */
    List<Order> findByCreatedAtAfter(Instant date);
    
    /**
     * Find orders with pagination support
     * Used for: Admin dashboard with pagination
     * 
     * Note: This method is inherited from MongoRepository, just declared here for documentation
     * Spring Data automatically provides this implementation
     * 
     * @param pageable Pagination and sorting parameters
     * @return Page<Order> - paginated orders
     */
    @Override
    Page<Order> findAll(Pageable pageable);
}
