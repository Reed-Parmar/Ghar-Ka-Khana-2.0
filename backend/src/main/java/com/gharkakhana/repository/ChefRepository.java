package com.gharkakhana.repository;

import com.gharkakhana.entity.Chef;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ChefRepository extends JpaRepository<Chef, Long> {
    Optional<Chef> findByEmail(String email);
    Optional<Chef> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}

