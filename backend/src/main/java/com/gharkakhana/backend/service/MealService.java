package com.gharkakhana.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.gharkakhana.backend.model.Meal;
import com.gharkakhana.backend.repository.MealRepository;

@Service
public class MealService {

    private final MealRepository mealRepository;

    public MealService(MealRepository mealRepository) {
        this.mealRepository = mealRepository;
    }

    public List<Meal> findAll() {
        return mealRepository.findAll();
    }

    public Optional<Meal> findById(String id) {
        return mealRepository.findById(id);
    }

    public List<Meal> findByChef(String chefId) {
        return mealRepository.findByChefId(chefId);
    }

    public List<Meal> findByTag(String tag) {
        return mealRepository.findByTagsContaining(tag);
    }

    public List<Meal> findByPriceRange(double minPrice, double maxPrice) {
        return mealRepository.findByPriceBetween(minPrice, maxPrice);
    }

    public Meal save(Meal meal) {
        return mealRepository.save(meal);
    }

    public void delete(String id) {
        mealRepository.deleteById(id);
    }
}