package com.gharkakhana.backend.model;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("meals")
public class Meal {

    @Id
    private String id;
    private String name;
    private String description;
    private double price;
    private String chefId;
    private List<String> tags;
    private String location;
    private String cookTime;

    public Meal() {}

    public Meal(String name, String description, double price, String chefId) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.chefId = chefId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getChefId() { return chefId; }
    public void setChefId(String chefId) { this.chefId = chefId; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCookTime() { return cookTime; }
    public void setCookTime(String cookTime) { this.cookTime = cookTime; }
}