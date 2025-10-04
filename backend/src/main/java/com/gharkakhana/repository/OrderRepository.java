package com.gharkakhana.repository;

import com.gharkakhana.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByChefIdOrderByCreatedAtDesc(Long chefId);
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Order> findByChefIdAndPickupDateOrderByPickupTime(Long chefId, LocalDate pickupDate);
    
    @Query("SELECT o FROM Order o WHERE o.chef.id = :chefId AND o.status = :status ORDER BY o.createdAt DESC")
    List<Order> findByChefIdAndStatus(@Param("chefId") Long chefId, @Param("status") String status);
}

