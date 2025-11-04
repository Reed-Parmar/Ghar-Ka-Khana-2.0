package com.gharkakhana.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "com.gharkakhana.backend.repository")
@EnableMongoAuditing
public class MongoConfig {
    // Custom MongoDB configuration can be added here if needed
    // For example, custom conversions, etc.
}