package com.gharkakhana.backend.dto;

import java.util.Map;

import com.gharkakhana.backend.model.User;

public class AuthResponse {
    private String token;
    private Map<String, Object> user;

    public AuthResponse(String token, User user) {
        this.token = token;
        this.user = Map.of(
            "id", user.getId(),
            "name", user.getName(),
            "email", user.getEmail(),
            "role", user.getRole()
        );
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Map<String, Object> getUser() {
        return user;
    }

    public void setUser(Map<String, Object> user) {
        this.user = user;
    }
}