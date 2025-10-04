# Ghar Ka Khana 2.0 - Production-Ready Next.js App

A full-stack homemade food delivery platform built with Next.js 14, MongoDB, and NextAuth.js v5.

## 🚀 Features

- **Frontend:** Next.js 14 with App Router
- **Styling:** Tailwind CSS + ShadCN UI components
- **Authentication:** NextAuth.js v5 with MongoDB adapter
- **Database:** MongoDB with Mongoose ODM
- **API:** Next.js API routes
- **TypeScript:** Full TypeScript support
- **Development Tools:** ESLint, Prettier, and proper linting

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Google OAuth credentials (optional)

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory using `.env.local.example` as template:

```bash
cp .env.local.example .env.local
```

Update the following variables in `.env.local`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ghar-ka-khana
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ghar-ka-khana?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_SECRET=your-super-secret-key-here-generate-new-one
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Express Server
EXPRESS_PORT=5000
```

### 3. Generate NextAuth Secret

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

### 4. MongoDB Setup

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/ghar-ka-khana`

#### Option B: MongoDB Atlas
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in `.env.local`

### 5. Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
6. Update `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`

## 🏃‍♂️ Running the Application

### Development Mode

Start the Next.js development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Mode

```bash
npm run build
npm start
```

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/
│   │   │   └── register/
│   │   ├── meals/
│   │   ├── chefs/
│   │   └── health/
│   ├── dashboard/
│   ├── login/
│   ├── register/
│   ├── layout.tsx
│   └── page.tsx
├── components/                   # React components
│   ├── ui/                      # ShadCN UI components
│   ├── Navbar.tsx
│   ├── SessionProvider.tsx
│   └── theme-provider.tsx
├── lib/                         # Utilities and configurations
│   ├── models/
│   ├── auth.ts                  # NextAuth configuration
│   ├── mongodb.ts               # MongoDB connection
│   └── utils.ts
├── types/                       # TypeScript type definitions
└── hooks/                       # Custom React hooks
```

## 🔐 Authentication

### User Registration
- Navigate to `/register`
- Fill in name, email, and password
- Account will be created and stored in MongoDB

### User Login
- Navigate to `/login`
- Login with email/password or Google OAuth
- Redirected to `/dashboard` on success

### Protected Routes
- `/dashboard` - User dashboard (requires authentication)
- Automatic redirects to `/login` for unauthenticated users

## 🛠️ Available Scripts

```bash
npm run dev          # Start Next.js development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run type-check   # Run TypeScript type checking
```

## 🎨 UI Components

The app uses ShadCN UI components which are already configured:

- **Forms:** Input, Label, Button, Checkbox, etc.
- **Layout:** Card, Dialog, Sheet, Tabs, etc.
- **Feedback:** Alert, Toast, Badge, etc.
- **Navigation:** Dropdown Menu, Navigation Menu, etc.

## 🗄️ Database Schema

### User Model
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  image?: string
  emailVerified?: Date
  provider: string (default: 'credentials')
  createdAt: Date
  updatedAt: Date
}
```

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔧 Customization

### Adding New Pages
1. Create page in `app/` directory
2. Add navigation links in `components/Navbar.tsx`

### Adding New Components
1. Create component in `components/`
2. Use ShadCN components: `npx shadcn-ui add [component-name]`

### Database Models
1. Add new models in `lib/models/`
2. Import and use in API routes

### API Routes
1. Create routes in `app/api/`
2. Use Next.js API route handlers for backend functionality

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check MongoDB is running
   - Verify connection string in `.env.local`
   - Check network connectivity for Atlas

2. **NextAuth Session Issues**
   - Verify `NEXTAUTH_SECRET` is set
   - Check `NEXTAUTH_URL` matches your domain
   - Clear browser cookies and try again

3. **Type Errors**
   - Run `npm run type-check`
   - Check import paths are correct
   - Ensure all dependencies are installed

4. **Build Errors**
   - Run `npm run lint:fix`
   - Check for missing dependencies
   - Verify environment variables

## 📚 Tech Stack Details

- **Next.js 14:** React framework with App Router
- **TypeScript:** Type safety and better DX
- **Tailwind CSS:** Utility-first CSS framework
- **ShadCN UI:** High-quality, accessible components
- **NextAuth.js v5:** Authentication solution
- **MongoDB:** NoSQL database
- **Mongoose:** MongoDB ODM
- **Zod:** Schema validation
- **React Hook Form:** Form handling
- **Lucide React:** Beautiful icons

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Happy Coding! 🍽️**