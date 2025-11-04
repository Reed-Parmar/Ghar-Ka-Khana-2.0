package com.gharkakhana.backend.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gharkakhana.backend.dto.UserDTO;
import com.gharkakhana.backend.model.User;
import com.gharkakhana.backend.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    private final UserService userService;

    public UsersController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<UserDTO>> listUsers() {
        List<UserDTO> users = userService.findAll().stream()
            .map(user -> new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
            ))
            .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUser(@PathVariable String userId) {
        return userService.findById(userId)
            .map(user -> new UserDTO(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
            ))
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable String userId,
            @RequestBody User userDetails) {
        User updated = userService.update(userId, userDetails);
        return ResponseEntity.ok(new UserDTO(
            updated.getId(),
            updated.getName(),
            updated.getEmail(),
            updated.getRole()
        ));
    }
}
