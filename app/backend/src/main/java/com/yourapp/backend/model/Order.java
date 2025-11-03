package com.yourapp.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotNull;
import java.util.List;

@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    @NotNull
    private String userId;

    @NotNull
    private List<String> mealIds;

    private String status; // e.g., PLACED, PREPARING, COMPLETED

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public List<String> getMealIds() {
        return mealIds;
    }

    public void setMealIds(List<String> mealIds) {
        this.mealIds = mealIds;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
