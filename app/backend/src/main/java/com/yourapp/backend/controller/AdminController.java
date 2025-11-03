package com.yourapp.backend.controller;

import com.yourapp.backend.dto.UserDTO;
import com.yourapp.backend.model.Chef;
import com.yourapp.backend.model.User;
import com.yourapp.backend.repository.ChefRepository;
import com.yourapp.backend.repository.OrderRepository;
import com.yourapp.backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final ChefRepository chefRepository;
    private final OrderRepository orderRepository;

    public AdminController(UserRepository userRepository, ChefRepository chefRepository, OrderRepository orderRepository) {
        this.userRepository = userRepository;
        this.chefRepository = chefRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> allUsers() {
        List<UserDTO> list = userRepository.findAll().stream().map(u -> new UserDTO(u.getId(), u.getName(), u.getEmail(), u.getRole())).collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }

    @PutMapping("/users/{userId}/status")
    public ResponseEntity<?> setUserStatus(@PathVariable String userId, @RequestBody(required = false) String status) {
        var opt = userRepository.findById(userId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        User u = opt.get();
        // Assuming status stored in role or a custom field - here we set role for demo
        u.setRole(status == null ? u.getRole() : status);
        userRepository.save(u);
        return ResponseEntity.ok(new UserDTO(u.getId(), u.getName(), u.getEmail(), u.getRole()));
    }

    @GetMapping("/stats")
    public ResponseEntity<?> stats() {
        long users = userRepository.count();
        long chefs = chefRepository.count();
        long orders = orderRepository.count();
        return ResponseEntity.ok(java.util.Map.of("users", users, "chefs", chefs, "orders", orders));
    }

    @PostMapping("/chefs/{chefId}/approval")
    public ResponseEntity<?> approveChef(@PathVariable String chefId, @RequestBody(required = false) java.util.Map<String, Object> body) {
        var opt = chefRepository.findById(chefId);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Chef c = opt.get();
        boolean approve = true;
        if (body != null && body.containsKey("approved")) {
            approve = Boolean.parseBoolean(body.get("approved").toString());
        }
        c.setApproved(approve);
        chefRepository.save(c);
        return ResponseEntity.ok(c);
    }

    @GetMapping("/orders")
    public ResponseEntity<?> allOrders() {
        return ResponseEntity.ok(orderRepository.findAll());
    }
}
