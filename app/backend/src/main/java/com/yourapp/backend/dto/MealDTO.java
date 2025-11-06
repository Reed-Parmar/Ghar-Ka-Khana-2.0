package com.yourapp.backend.dto;

import java.time.Instant;

/**
 * Lightweight DTO for browse-meals responses that does not rely on DBRef mapping.
 */
public class MealDTO {
    public String id;
    public String mealName;
    public String description;
    public Double price;
    public String imageUrl;
    public String availableTime;
    public Boolean isActive;
    public Instant createdAt;
    public ChefDTO chef;

    public MealDTO() {}

    public MealDTO(String id, String mealName, String description, Double price,
                   String imageUrl, String availableTime, Boolean isActive,
                   Instant createdAt, ChefDTO chef) {
        this.id = id;
        this.mealName = mealName;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.availableTime = availableTime;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.chef = chef;
    }

    public static class ChefDTO {
        public String id;
        public String name;
        public String email;

        public ChefDTO() {}

        public ChefDTO(String id, String name, String email) {
            this.id = id;
            this.name = name;
            this.email = email;
        }
    }
}
