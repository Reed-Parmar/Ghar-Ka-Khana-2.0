package com.gharkakhana.backend.model;

import java.time.Instant;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("orders")
public class Order {

    @Id
    private String id;
    private String userId;
    private List<String> mealIds;
    private double total;
    private String status;
    private Instant createdAt;

    public Order() {}

    public Order(String userId, List<String> mealIds, double total, String status) {
        this.userId = userId;
        this.mealIds = mealIds;
        this.total = total;
        this.status = status;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public List<String> getMealIds() { return mealIds; }
    public void setMealIds(List<String> mealIds) { this.mealIds = mealIds; }

    public double getTotal() { return total; }
    public void setTotal(double total) { this.total = total; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}