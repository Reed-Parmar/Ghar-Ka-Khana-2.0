# Ghar Ka Khana - API Documentation

## Overview
Ghar Ka Khana is a platform connecting students & bachelors with home chefs. This document outlines the REST API endpoints built with Node.js, Next.js 14, and MongoDB.

## Tech Stack
- **Backend**: Node.js with Next.js 14 (App Router)
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js v5 with JWT
- **Validation**: Zod
- **UI**: React with ShadCN UI components

## Authentication & Roles

### User Roles
- **Student**: Can browse meals and place orders (default role)
- **Chef**: Can upload meals and view their orders
- **Admin**: Full access to all features

### Authentication
All protected endpoints require authentication via NextAuth.js session. Include session cookies in requests.

## Database Models

### User Schema
```typescript
{
  name: string;
  email: string;
  password: string;
  role: 'student' | 'admin' | 'chef';
  image?: string;
  emailVerified?: Date;
  provider?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Meal Schema
```typescript
{
  chef: ObjectId; // Reference to User
  mealName: string;
  description: string;
  price: number;
  imageUrl?: string;
  availableTime: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Order Schema
```typescript
{
  user: ObjectId; // Reference to User
  meal: ObjectId; // Reference to Meal
  chef: ObjectId; // Reference to User (chef)
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  deliveryNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
```
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" // optional, defaults to "student"
}
```

#### Login User
```http
POST /api/auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Chef Endpoints

#### Upload Meal (Chef Only)
```http
POST /api/meals/upload
```
**Authentication:** Required (Chef role)
**Body:**
```json
{
  "mealName": "Homemade Biryani",
  "description": "Delicious aromatic biryani with tender meat and fragrant rice",
  "price": 250,
  "imageUrl": "https://example.com/biryani.jpg", // optional
  "availableTime": "12:00 PM - 8:00 PM"
}
```
**Response:**
```json
{
  "message": "Meal uploaded successfully",
  "meal": {
    "id": "meal_id",
    "mealName": "Homemade Biryani",
    "description": "Delicious aromatic biryani...",
    "price": 250,
    "imageUrl": "https://example.com/biryani.jpg",
    "availableTime": "12:00 PM - 8:00 PM",
    "chef": {
      "id": "chef_id",
      "name": "Chef Name",
      "email": "chef@example.com"
    },
    "createdAt": "2025-10-04T..."
  }
}
```

#### Get Chef Orders
```http
GET /api/orders/chef/{chefId}
```
**Authentication:** Required (Chef can only view own orders, Admin can view any)
**Response:**
```json
{
  "message": "Orders retrieved successfully",
  "orders": [
    {
      "id": "order_id",
      "user": {
        "id": "user_id",
        "name": "Customer Name",
        "email": "customer@example.com"
      },
      "meal": {
        "id": "meal_id",
        "name": "Homemade Biryani",
        "price": 250,
        "imageUrl": "https://example.com/biryani.jpg"
      },
      "quantity": 2,
      "totalPrice": 500,
      "status": "pending",
      "paymentStatus": "paid",
      "deliveryNotes": "Room 201",
      "createdAt": "2025-10-04T...",
      "updatedAt": "2025-10-04T..."
    }
  ],
  "totalOrders": 1
}
```

### User Endpoints

#### Get All Meals
```http
GET /api/meals/all?page=1&limit=10&search=biryani&minPrice=100&maxPrice=500
```
**Authentication:** Not required
**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search in meal name and description
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter

**Response:**
```json
{
  "message": "Meals retrieved successfully",
  "meals": [
    {
      "id": "meal_id",
      "mealName": "Homemade Biryani",
      "description": "Delicious aromatic biryani...",
      "price": 250,
      "imageUrl": "https://example.com/biryani.jpg",
      "availableTime": "12:00 PM - 8:00 PM",
      "chef": {
        "id": "chef_id",
        "name": "Chef Name",
        "email": "chef@example.com"
      },
      "createdAt": "2025-10-04T..."
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalMeals": 45,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### Place Order (Student/Admin Only)
```http
POST /api/orders/place
```
**Authentication:** Required (Student or Admin role)
**Body:**
```json
{
  "mealId": "meal_id",
  "quantity": 2,
  "paymentStatus": "paid", // "pending" or "paid"
  "deliveryNotes": "Please deliver to hostel room 201" // optional
}
```
**Response:**
```json
{
  "message": "Order placed successfully",
  "order": {
    "id": "order_id",
    "user": {
      "id": "user_id",
      "name": "Customer Name",
      "email": "customer@example.com"
    },
    "meal": {
      "id": "meal_id",
      "name": "Homemade Biryani",
      "price": 250,
      "imageUrl": "https://example.com/biryani.jpg",
      "availableTime": "12:00 PM - 8:00 PM"
    },
    "chef": {
      "id": "chef_id",
      "name": "Chef Name",
      "email": "chef@example.com"
    },
    "quantity": 2,
    "totalPrice": 500,
    "status": "pending",
    "paymentStatus": "paid",
    "deliveryNotes": "Please deliver to hostel room 201",
    "createdAt": "2025-10-04T..."
  }
}
```

#### Get User Orders
```http
GET /api/orders/user/{userId}?status=pending&paymentStatus=paid
```
**Authentication:** Required (User can only view own orders, Admin can view any)
**Query Parameters:**
- `status`: Filter by order status
- `paymentStatus`: Filter by payment status

**Response:**
```json
{
  "message": "Orders retrieved successfully",
  "orders": [
    {
      "id": "order_id",
      "meal": {
        "id": "meal_id",
        "name": "Homemade Biryani",
        "price": 250,
        "imageUrl": "https://example.com/biryani.jpg",
        "availableTime": "12:00 PM - 8:00 PM"
      },
      "chef": {
        "id": "chef_id",
        "name": "Chef Name",
        "email": "chef@example.com"
      },
      "quantity": 2,
      "totalPrice": 500,
      "status": "pending",
      "paymentStatus": "paid",
      "deliveryNotes": "Please deliver to hostel room 201",
      "createdAt": "2025-10-04T...",
      "updatedAt": "2025-10-04T..."
    }
  ],
  "totalOrders": 1
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": [] // Optional validation details for Zod errors
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created successfully
- `400`: Bad request / Validation error
- `401`: Authentication required
- `403`: Access denied / Insufficient permissions
- `404`: Resource not found
- `500`: Internal server error

## Environment Variables

Create a `.env.local` file with:
```env
MONGODB_URI=mongodb://localhost:27017/ghar-ka-khana
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3001
```

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start MongoDB locally:**
   ```bash
   mongod
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3001
   - API Testing: http://localhost:3001/test-api

## Testing

The application includes a built-in API testing interface at `/test-api` where you can:
- Test all endpoints interactively
- View formatted API responses
- Test role-based permissions

## Features Implemented

### MVP Features ✅
- [x] Chef registration/login with role-based authentication
- [x] Meal upload functionality for chefs
- [x] View all orders for chef's meals
- [x] User registration/login with role selection
- [x] Browse all available meals with pagination and filtering
- [x] Place orders with payment status tracking
- [x] View user's order history
- [x] Role-based access control
- [x] MongoDB integration with proper schemas
- [x] Input validation and error handling

### Additional Features
- [x] Role-based registration (Student, Chef, Admin)
- [x] Advanced meal filtering (search, price range)
- [x] Pagination for meal listings
- [x] Order status tracking
- [x] Delivery notes for orders
- [x] Authorization checks for viewing orders
- [x] API testing interface

## Future Enhancements

Potential features to add:
- Real-time order status updates
- Chef ratings and reviews
- Payment gateway integration
- Availability time slots
- Order delivery tracking
- Admin dashboard
- Email notifications
- Image upload functionality
- Mobile app support