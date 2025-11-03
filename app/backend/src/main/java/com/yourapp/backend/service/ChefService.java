package com.yourapp.backend.service;

import com.yourapp.backend.model.Chef;
import com.yourapp.backend.repository.ChefRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChefService {

    private final ChefRepository chefRepository;

    public ChefService(ChefRepository chefRepository) {
        this.chefRepository = chefRepository;
    }

    public List<Chef> getAllApproved() {
        return chefRepository.findByApprovedTrue();
    }

    public Optional<Chef> findById(String id) {
        return chefRepository.findById(id);
    }

    public Chef save(Chef chef) {
        return chefRepository.save(chef);
    }
}
