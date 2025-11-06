# 🍽️ Ghar Ka Khana 2.0

**A modern cloud kitchen marketplace platform connecting home chefs with food lovers**

## 🏗️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **State Management:** React Hooks
- **Authentication:** JWT (localStorage + Bearer tokens)

### Backend
- **Framework:** Spring Boot 3.5.7
- **Language:** Java 21/24
- **Database:** MongoDB
- **ORM:** Spring Data MongoDB
- **Security:** Spring Security + JWT
- **Password Hashing:** BCrypt
- **Build Tool:** Maven

### Database
- **MongoDB** - NoSQL database for flexible schema
- Collections: `users`, `meals`, `orders`
- Relationships: @DBRef for chef-meal and user-order associations

---

## 🚀 Quick Start

### Prerequisites
- Java 21 or 24
- Node.js 18+
- MongoDB running on `localhost:27017`
- pnpm or npm

### 1. Start MongoDB
```bash
# Make sure MongoDB is running
# Database name: ghar-ka-khana
```

### 2. Start Backend (Spring Boot)
```bash
cd app/backend
./mvnw spring-boot:run
# Or on Windows:
mvnw.cmd spring-boot:run
```
✅ Backend runs on **http://localhost:8080**

### 3. Start Frontend (Next.js)
```bash
# In project root
pnpm install
pnpm dev
# Or with npm:
npm install
npm run dev
```
✅ Frontend runs on **http://localhost:3000**

---

## 📱 Features

### For Students
- 🔍 Browse homemade meals from verified chefs
- 🛒 Place orders with custom delivery notes
- 📦 Track order status in real-time
- ⭐ Rate and review meals

### For Chefs
- 👨‍🍳 Upload meal offerings with images and pricing
- 📊 Manage incoming orders
- 💰 Track earnings and statistics
- 🔔 Get notified of new orders

### For Admins
- 👥 Manage users and chefs
- ✅ Approve chef applications
- 📈 View platform statistics
- 🔧 Monitor system health

---

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/register` | POST | No | Register new user |
| `/auth/login` | POST | No | Login (returns JWT) |
| `/auth/logout` | POST | No | Logout |

### User Endpoints
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/user/profile` | GET | Yes | Get authenticated user profile |

### Meal Endpoints
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/meals` | GET | No | Get all active meals |
| `/meals/:id` | GET | No | Get meal by ID |
| `/meals` | POST | Chef | Create new meal |
| `/meals/:id` | PUT | Chef | Update meal |
| `/meals/:id` | DELETE | Chef | Deactivate meal |
| `/meals/chef/:chefId` | GET | No | Get chef's meals |
| `/meals/chef/:chefId/active` | GET | No | Get chef's active meals |

### Order Endpoints
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/orders` | POST | Yes | Place order |
| `/orders/my-orders` | GET | Yes | Get user's orders |
| `/orders/chef-orders` | GET | Chef | Get chef's orders |
| `/orders/:id` | GET | Yes | Get order by ID |
| `/orders/:id/status` | PUT | Yes | Update order status |
| `/orders/:id/payment` | PUT | Yes | Update payment status |
| `/orders/:id` | DELETE | Yes | Cancel order |

### Chef Endpoints
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/chefs` | GET | No | Get all approved chefs |
| `/chefs/:id` | GET | No | Get chef profile |

### Admin Endpoints
| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/admin/users` | GET | Admin | Get all users |
| `/admin/stats` | GET | Admin | Get platform statistics |
| `/admin/users/:id/status` | PUT | Admin | Update user status |
| `/admin/chefs/:id/approval` | POST | Admin | Approve/reject chef |
| `/admin/orders` | GET | Admin | Get all orders |

---

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

The frontend automatically handles this via the `authFetch()` function in `lib/authClient.tsx`.

---

## 🗂️ Project Structure

```
Ghar-Ka-Khana-2.0/
├── app/                          # Next.js App Router
│   ├── admin/dashboard/         # Admin dashboard
│   ├── chef/dashboard/          # Chef dashboard
│   ├── student/dashboard/       # Student dashboard
│   ├── meals/                   # Browse meals page
│   ├── chefs/                   # Chef profiles
│   ├── login/                   # Login page
│   ├── register/                # Registration page
│   └── backend/                 # Spring Boot Backend
│       ├── src/main/java/
│       │   └── com/yourapp/backend/
│       │       ├── controller/  # REST Controllers
│       │       ├── service/     # Business Logic
│       │       ├── repository/  # Data Access
│       │       ├── model/       # MongoDB Entities
│       │       ├── dto/         # Data Transfer Objects
│       │       ├── config/      # Configuration
│       │       └── util/        # Utilities (JWT)
│       └── pom.xml             # Maven dependencies
├── components/                  # React components
│   └── ui/                     # shadcn/ui components
├── lib/                        # Utility functions
│   ├── authClient.tsx          # Authentication client
│   ├── auth.ts                 # Auth helpers
│   └── utils.ts                # Utilities
├── hooks/                      # React hooks
├── public/                     # Static assets
├── scripts/                    # Database scripts
├── next.config.mjs            # Next.js config
├── tailwind.config.ts         # Tailwind config
└── package.json               # Frontend dependencies
```

---

## 🛠️ Development

### Frontend Development
```bash
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix linting issues
pnpm format       # Format with Prettier
```

### Backend Development
```bash
cd app/backend
./mvnw clean install      # Build project
./mvnw spring-boot:run    # Run application
./mvnw test              # Run tests
./mvnw package           # Create JAR file
```

---

## 🐛 Troubleshooting

### Backend won't start
- Verify Java 21/24 is installed: `java -version`
- Check MongoDB is running on port 27017
- Verify database name is `ghar-ka-khana` (with hyphen)

### Frontend won't connect
- Ensure backend is running on port 8080
- Check `next.config.mjs` has correct API rewrites
- Verify token in localStorage (key: `ghk_token`)

### Authentication issues
- Clear localStorage: `localStorage.clear()`
- Log out and log back in
- Check browser console for `[AuthClient]` logs

---

## 🔒 Environment Variables

Create `.env.local` in the root directory:

```env
# Optional: API URL (defaults to http://localhost:8080)
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## 📝 Creating Admin User

Use MongoDB Compass or the script in `scripts/createAdmin.ts`:

```bash
cd scripts
npx tsx createAdmin.ts
```

Default admin credentials:
- **Email:** admin@gharkaakhana.com
- **Password:** admin123

⚠️ **Change the password after first login!**

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
pnpm build
# Deploy to Vercel
```

### Backend (Docker)
```bash
cd app/backend
./mvnw clean package
docker build -t ghar-ka-khana-backend .
docker run -p 8080:8080 ghar-ka-khana-backend
```

---

## 📄 License

This project is private and proprietary.

---

## 👥 Contributors

- **Team Lead:** [Your Name]
- **Backend:** Spring Boot + MongoDB
- **Frontend:** Next.js + TypeScript

---

## 🎯 Future Enhancements

- [ ] Real-time notifications (WebSocket)
- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Email verification
- [ ] Review and rating system
- [ ] Image upload to cloud storage (AWS S3/Cloudinary)
- [ ] Redis caching for performance
- [ ] Docker Compose for easy deployment
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Mobile app (React Native)

---

**Made with ❤️ by the Ghar Ka Khana Team**
