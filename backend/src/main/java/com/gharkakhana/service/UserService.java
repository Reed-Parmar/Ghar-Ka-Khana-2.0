package com.gharkakhana.service;

import com.gharkakhana.entity.User;
import com.gharkakhana.entity.UserRole;
import com.gharkakhana.repository.UserRepository;
import com.gharkakhana.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;

    public User registerUser(User user) {
        // Set default role if not provided
        if (user.getRole() == null) {
            user.setRole(UserRole.USER);
        }
        return userRepository.save(user);
    }

    public String loginUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            UserRole role = user.get().getRole();
            if (role == null) {
                role = UserRole.USER; // Default role
            }
            return jwtUtil.generateToken(email, role.name());
        }
        return null;
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}