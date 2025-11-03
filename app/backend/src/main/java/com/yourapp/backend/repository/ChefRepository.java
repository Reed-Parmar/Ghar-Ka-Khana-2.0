package com.yourapp.backend.repository;

import com.yourapp.backend.model.Chef;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChefRepository extends MongoRepository<Chef, String> {
    List<Chef> findByApprovedTrue();
}
