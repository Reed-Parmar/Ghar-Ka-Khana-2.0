# 🚀 Quick Start Guide - Ghar Ka Khana 2.0

## Start the Application (2 Steps)

### Step 1: Start Spring Boot Backend
```powershell
cd app\backend
.\mvnw.cmd spring-boot:run
```
✅ Wait for: `Started GharKaKhanaApplication in X seconds`  
✅ Backend: http://localhost:8080

### Step 2: Start Next.js Frontend
```powershell
# In project root (new terminal)
pnpm dev
```
✅ Wait for: `Ready in Xms`  
✅ Frontend: http://localhost:3000

---

## Test the Application

### 1. Register & Login
- Register as student: http://localhost:3000/register
- Login: http://localhost:3000/login

### 2. Browse Meals
- View all meals: http://localhost:3000/meals

### 3. Chef Dashboard (if registered as chef)
- Upload meals: http://localhost:3000/chef/dashboard
- View orders

### 4. Student Dashboard
- View orders: http://localhost:3000/student/dashboard
- Track order status

### 5. Admin Dashboard (if you have admin account)
- Manage users: http://localhost:3000/admin/dashboard
- Approve chefs
- View statistics

---

## Prerequisites Checklist

- [x] MongoDB running on `localhost:27017`
- [x] Database named `ghar-ka-khana` (with hyphen)
- [x] Java 21 or 24 installed
- [x] Node.js 18+ installed
- [x] pnpm or npm installed

---

## Troubleshooting

### Backend won't start?
```powershell
# Check Java version
java -version  # Should be 21 or 24

# Check MongoDB
# MongoDB should be running on localhost:27017
```

### Frontend won't connect?
```powershell
# Make sure backend is running first
# Check backend is on port 8080
# Check frontend is on port 3000
```

### Can't see meals?
- Make sure database name is `ghar-ka-khana` (with hyphen, not underscore)
- Check MongoDB Compass: database should have `users`, `meals`, `orders` collections

### Unauthorized errors?
- Check JWT token is stored in localStorage (key: `ghk_token`)
- Try logging out and logging back in
- Check browser console for errors

---

## File Reference

- **Backend Config:** `app/backend/src/main/resources/application.properties`
- **Frontend Config:** `next.config.mjs` and `.env.local`
- **Migration Report:** `app/backend/MIGRATION_STATUS.md`
- **Complete Guide:** `MIGRATION_COMPLETE.md`

---

## Important Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/register` | POST | No | Register new user |
| `/api/auth/login` | POST | No | Login (get JWT) |
| `/api/user/profile` | GET | Yes | Get user profile |
| `/api/meals` | GET | No | Browse all meals |
| `/api/meals` | POST | Yes | Upload meal (chef) |
| `/api/orders/my-orders` | GET | Yes | View my orders |
| `/api/orders/chef-orders` | GET | Yes | View chef orders |
| `/api/chefs` | GET | No | View all chefs |
| `/api/admin/users` | GET | Yes | Manage users (admin) |

---

**🎉 You're all set! Start both servers and test the application yourself.**
