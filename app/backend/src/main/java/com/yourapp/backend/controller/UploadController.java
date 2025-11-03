package com.yourapp.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/meals")
public class UploadController {

    // Placeholder: adapt to file storage (local, S3, etc.) used in your Node app
    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) return ResponseEntity.badRequest().body("File required");
        // store file and return URL in production
        return ResponseEntity.ok(java.util.Map.of("message", "Upload endpoint stub", "filename", file.getOriginalFilename()));
    }
}
