package com.yourapp.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotNull;

@Document(collection = "chefs")
public class Chef {
    @Id
    private String id;

    @NotNull
    private String name;

    private String bio;

    private boolean approved = false;

    private String userId; // reference to User

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public boolean isApproved() { return approved; }
    public void setApproved(boolean approved) { this.approved = approved; }
    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}
