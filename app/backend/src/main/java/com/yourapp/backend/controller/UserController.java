package com.yourapp.backend.controller;

import com.yourapp.backend.dto.UserDTO;
import com.yourapp.backend.model.User;
import com.yourapp.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) return ResponseEntity.status(401).body("Unauthorized");
        Optional<User> opt = userService.findByEmail(userDetails.getUsername());
        if (opt.isEmpty()) return ResponseEntity.status(404).body("Not found");
        User u = opt.get();
        UserDTO dto = new UserDTO(u.getId(), u.getName(), u.getEmail(), u.getRole());
        return ResponseEntity.ok(dto);
    }
}
