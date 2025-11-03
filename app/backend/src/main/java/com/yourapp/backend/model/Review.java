package com.yourapp.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotNull;

@Document(collection = "reviews")
public class Review {
    @Id
    private String id;

    @NotNull
    private String mealId;

    private String userId;

    @NotNull
    private String comment;

    private int rating;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getMealId() { return mealId; }
    public void setMealId(String mealId) { this.mealId = mealId; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
}
