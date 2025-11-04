package com.gharkakhana.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.gharkakhana.backend.model.User;
import com.gharkakhana.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> findAll() {
        return userRepository.findAll();
    }

    public Optional<User> findById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> findChefs() {
        return userRepository.findByRole("CHEF").stream().toList();
    }

    public User update(String id, User userDetails) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setName(userDetails.getName());
                    if (userDetails.getImage() != null) {
                        user.setImage(userDetails.getImage());
                    }
                    return userRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void delete(String id) {
        userRepository.deleteById(id);
    }
}