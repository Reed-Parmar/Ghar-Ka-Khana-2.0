package com.gharkakhana.service;

import com.gharkakhana.entity.Chef;
import com.gharkakhana.entity.Meal;
import com.gharkakhana.entity.Order;
import com.gharkakhana.repository.ChefRepository;
import com.gharkakhana.repository.MealRepository;
import com.gharkakhana.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ChefService {
    @Autowired
    private ChefRepository chefRepository;
    
    @Autowired
    private MealRepository mealRepository;
    
    @Autowired
    private OrderRepository orderRepository;

    public Chef registerChef(Chef chef) {
        return chefRepository.save(chef);
    }

    public Optional<Chef> loginChef(String email, String password) {
        return chefRepository.findByEmail(email)
                .filter(chef -> chef.getPassword().equals(password) && chef.getIsActive());
    }

    public Meal uploadMeal(Meal meal) {
        return mealRepository.save(meal);
    }

    public Meal publishMeal(Long mealId) {
        Optional<Meal> mealOpt = mealRepository.findById(mealId);
        if (mealOpt.isPresent()) {
            Meal meal = mealOpt.get();
            meal.setIsPublished(true);
            return mealRepository.save(meal);
        }
        return null;
    }

    public List<Meal> getChefMeals(Long chefId) {
        return mealRepository.findByChefIdAndIsActiveTrue(chefId);
    }

    public List<Order> getChefOrders(Long chefId) {
        return orderRepository.findByChefIdOrderByCreatedAtDesc(chefId);
    }

    public Optional<Chef> getChefById(Long id) {
        return chefRepository.findById(id);
    }
}

