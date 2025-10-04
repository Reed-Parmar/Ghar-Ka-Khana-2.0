# Ghar Ka Khana Backend

Backend AP for the Ghar Ka Khana home-cooked meal delivery platform.
I
## Features

- **Chef Management**: Registration, login, meal upload and publishing
- **User Management**: Registration, login, meal browsing, order placement
- **Order Management**: Order tracking and chef dashboard
- **Meal Management**: CRUD operations for meals with filtering

## Tech Stack

- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- MySQL 8.0
- Maven

## Setup Instructions

### 1. Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE ghar_ka_khana;
```

2. Update `src/main/resources/application.properties` with your database credentials:
```properties
spring.datasource.url=jdbc:mysql://YOUR_DATABASE_IP:3306/ghar_ka_khana?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=YOUR_USERNAME
spring.datasource.password=YOUR_PASSWORD
```

### 2. Run the Application

```bash
# Navigate to backend directory
cd backend

# Install dependencies
mvn clean install

# Run the application
mvn spring-boot:run
```

The API will be available at: `http://localhost:8080/api`

## API Endpoints

### Chef APIs
- `POST /api/chef/register` - Register new chef
- `POST /api/chef/login` - Chef login
- `POST /api/chef/{chefId}/meals` - Upload meal
- `PUT /api/chef/meals/{mealId}/publish` - Publish meal
- `GET /api/chef/{chefId}/meals` - Get chef's meals
- `GET /api/chef/{chefId}/orders` - Get chef's orders

### User APIs
- `POST /api/user/register` - Register new user
- `POST /api/user/login` - User login
- `GET /api/user/meals` - Get available meals
- `POST /api/user/{userId}/orders` - Place order
- `GET /api/user/{userId}/orders` - Get user's orders

## Database Schema

The application will automatically create the following tables:
- `chefs` - Chef information
- `users` - User information
- `meals` - Meal information
- `orders` - Order information
- `order_items` - Order item details

## Development

The application uses Spring Boot DevTools for hot reloading during development.

