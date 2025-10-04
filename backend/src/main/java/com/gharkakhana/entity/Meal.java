package com.gharkakhana.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "meals")
public class Meal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String name;

    @NotBlank
    @Size(max = 1000)
    private String description;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal price;

    @NotNull
    @Min(1)
    private Integer availableQuantity;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private CuisineType cuisineType;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private MealType mealType;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private DietaryPreference dietaryPreference;

    @Min(1)
    @Max(5)
    private Integer spiceLevel = 3;

    @NotBlank
    @Size(max = 200)
    private String servingSize;

    @Column(length = 1000)
    private String components;

    @Column(length = 500)
    private String allergens;

    @NotNull
    private LocalDate availableDate;

    @NotNull
    private LocalTime pickupTimeStart;

    @NotNull
    private LocalTime pickupTimeEnd;

    @NotBlank
    @Size(max = 200)
    private String pickupLocation;

    @Column(length = 1000)
    private String imageUrls;

    private Boolean isPublished = false;
    private Boolean isActive = true;
    private Double rating = 0.0;
    private Integer totalOrders = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chef_id", nullable = false)
    private Chef chef;

    @OneToMany(mappedBy = "meal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> orderItems = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Constructors
    public Meal() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Integer getAvailableQuantity() { return availableQuantity; }
    public void setAvailableQuantity(Integer availableQuantity) { this.availableQuantity = availableQuantity; }

    public CuisineType getCuisineType() { return cuisineType; }
    public void setCuisineType(CuisineType cuisineType) { this.cuisineType = cuisineType; }

    public MealType getMealType() { return mealType; }
    public void setMealType(MealType mealType) { this.mealType = mealType; }

    public DietaryPreference getDietaryPreference() { return dietaryPreference; }
    public void setDietaryPreference(DietaryPreference dietaryPreference) { this.dietaryPreference = dietaryPreference; }

    public Integer getSpiceLevel() { return spiceLevel; }
    public void setSpiceLevel(Integer spiceLevel) { this.spiceLevel = spiceLevel; }

    public String getServingSize() { return servingSize; }
    public void setServingSize(String servingSize) { this.servingSize = servingSize; }

    public String getComponents() { return components; }
    public void setComponents(String components) { this.components = components; }

    public String getAllergens() { return allergens; }
    public void setAllergens(String allergens) { this.allergens = allergens; }

    public LocalDate getAvailableDate() { return availableDate; }
    public void setAvailableDate(LocalDate availableDate) { this.availableDate = availableDate; }

    public LocalTime getPickupTimeStart() { return pickupTimeStart; }
    public void setPickupTimeStart(LocalTime pickupTimeStart) { this.pickupTimeStart = pickupTimeStart; }

    public LocalTime getPickupTimeEnd() { return pickupTimeEnd; }
    public void setPickupTimeEnd(LocalTime pickupTimeEnd) { this.pickupTimeEnd = pickupTimeEnd; }

    public String getPickupLocation() { return pickupLocation; }
    public void setPickupLocation(String pickupLocation) { this.pickupLocation = pickupLocation; }

    public String getImageUrls() { return imageUrls; }
    public void setImageUrls(String imageUrls) { this.imageUrls = imageUrls; }

    public Boolean getIsPublished() { return isPublished; }
    public void setIsPublished(Boolean isPublished) { this.isPublished = isPublished; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public Integer getTotalOrders() { return totalOrders; }
    public void setTotalOrders(Integer totalOrders) { this.totalOrders = totalOrders; }

    public Chef getChef() { return chef; }
    public void setChef(Chef chef) { this.chef = chef; }

    public List<OrderItem> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItem> orderItems) { this.orderItems = orderItems; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}

enum CuisineType {
    NORTH_INDIAN, SOUTH_INDIAN, BENGALI, PUNJABI, GUJARATI, CHINESE, CONTINENTAL, OTHER
}

enum MealType {
    BREAKFAST, LUNCH, DINNER, SNACK
}

enum DietaryPreference {
    VEG, NON_VEG, VEGAN
}

