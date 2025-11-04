package com.gharkakhana.backend.dto;

import java.util.List;

public record OrderDTO(String id, String userId, List<String> mealIds, double total, String status) {
}
