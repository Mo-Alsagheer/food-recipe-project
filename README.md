# Food Recipe Project

A full-stack web application for discovering, managing, and saving food recipes. Users can browse recipes by category, search by keyword, save favorites, and manage their profile. Admins have a dedicated panel for recipe and user management.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Frontend Pages](#frontend-pages)
- [Authentication Flow](#authentication-flow)
- [Data Models](#data-models)

---

## Tech Stack

### Backend
| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (ES Modules) |
| Framework | Express 5 |
| Database | MongoDB + Mongoose 9 |
| Auth | JWT (jsonwebtoken), bcrypt |
| OAuth | Passport.js + passport-google-oauth20 |
| Validation | Joi |
| File Upload | Multer |
| Email | Nodemailer (SMTP) |

### Frontend
| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite 6 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + shadcn/ui |
| Routing | React Router v7 |
| HTTP Client | Axios (with JWT interceptor) |
| State | React Context + useReducer |

---

## Features

### User-facing
- Browse recipes with category filtering and full-text search
- View recipe detail: ingredients, step-by-step instructions, cooking time, difficulty, rating
- Register / log in with email + password, or via Google OAuth
- Forgot password — 6-digit OTP sent by email, 15-minute expiry
- Save and remove favorite recipes
- Profile page with paginated favorites grid

### Admin panel
- Separate admin login (`POST /api/admin/login`)
- Dashboard with recipe count breakdown by category
- Full recipe CRUD with image upload
- User list with active/deactive status toggle
- View all favorites across all users

### Security
- Role-based JWT: users get 7-day tokens, admins get 1-day tokens
- Deactivated user accounts are blocked at sign-in
- All admin routes protected by `role === "admin"` middleware
- Input validation on every endpoint via Joi schemas

---

## Project Structure

```
food-recipe-project/
├── server/                     # Express API
│   ├── index.js                # Entry point
│   ├── package.json
│   └── src/
│       ├── config/
│       │   ├── dbConnection.js # Mongoose connect
│       │   └── passport.js     # Google OAuth strategy
│       ├── middleware/
│       │   ├── auth.js         # protect + restrictTo middleware
│       │   ├── globalErrorHandler.js
│       │   └── validate.js     # Joi validation middleware
│       ├── models/
│       │   ├── User.js
│       │   ├── Recipe.js
│       │   ├── Category.js
│       │   └── Favorite.js
│       ├── modules/
│       │   ├── auth/           # signup, signin, forgot/reset password, Google OAuth
│       │   ├── recipe/         # list, detail, search, filter
│       │   ├── category/       # CRUD categories
│       │   ├── favorite/       # add, remove, list favorites
│       │   ├── user/           # get profile, list users
│       │   └── admin/          # admin login, dashboard, recipe CRUD, user management
│       └── utils/
│           ├── jwt.js          # signToken with role-based expiry
│           ├── email.js        # sendOtpEmail via Nodemailer
│           ├── upload.js       # Multer config
│           ├── AppError.js
│           └── catchError.js
└── client/                     # React frontend
    ├── index.html
    ├── vite.config.ts          # Dev proxy: /api + /uploads → localhost:3000
    └── src/
        ├── App.tsx             # Router + AuthProvider + Navbar shell
        ├── context/
        │   └── AuthContext.tsx # useReducer auth state, localStorage persistence
        ├── lib/
        │   ├── axios.ts        # Axios instance with Bearer token interceptor
        │   └── utils.ts        # shadcn cn() helper
        ├── components/
        │   ├── Navbar.tsx
        │   ├── RecipeCard.tsx
        │   ├── ProtectedRoute.tsx
        │   └── ui/             # shadcn/ui primitives
        ├── pages/
        │   ├── HomePage.tsx
        │   ├── LoginPage.tsx
        │   ├── RegisterPage.tsx
        │   ├── ForgotPasswordPage.tsx
        │   ├── RecipeListPage.tsx
        │   ├── RecipeDetailPage.tsx
        │   ├── ProfilePage.tsx
        │   └── AdminRecipesPage.tsx
        ├── hooks/
        │   └── use-toast.ts
        └── types/
            └── recipe.ts
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend

```bash
cd server

# Install dependencies
npm install

# Create .env (see Environment Variables section)
cp .env.example .env

# Start development server
npm run dev
```

The API runs on `http://localhost:3000`.

### Frontend

```bash
cd client
npm install
npm run dev
```

The client runs on `http://localhost:5173` and proxies `/api` and `/uploads` to the backend automatically.

---

## Environment Variables

Create a `.env` file inside `server/`:

```env
# Server
PORT=3000

# MongoDB
MONGO_URI=mongodb://localhost:27017/food-recipe

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
JWT_ADMIN_EXPIRES_IN=1d

# Email (for OTP password reset)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your_smtp_password
EMAIL_FROM=no-reply@foodrecipe.com

# Google OAuth (optional — routes return 501 if not set)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

---

## API Reference

All routes are prefixed with `/api`.

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | — | Register a new user |
| POST | `/signin` | — | Log in, returns JWT |
| POST | `/forgot-password` | — | Send OTP to email |
| POST | `/reset-password` | — | Reset password with OTP |
| GET | `/google` | — | Redirect to Google OAuth |
| GET | `/google/callback` | — | OAuth callback, returns JWT |

### Recipes — `/api/recipes`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | — | List recipes (filter: `category`, `search`, `tags`; paginated) |
| GET | `/:id` | — | Get single recipe |
| GET | `/categories` | — | Recipe count per category |

### Favorites — `/api/favorites`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | User | List my favorites (paginated) |
| POST | `/` | User | Add a favorite `{ recipeId }` |
| DELETE | `/:recipeId` | User | Remove a favorite |

### Categories — `/api/categories`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | — | List all categories |
| POST | `/` | Admin | Create category |
| PUT | `/:id` | Admin | Update category |
| DELETE | `/:id` | Admin | Delete category |

### Users — `/api/users`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/` | Admin | List users (paginated) |
| GET | `/profile` | User | Get own profile |

### Admin — `/api/admin`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/login` | — | Admin sign in |
| GET | `/dashboard` | Admin | Recipe count by category |
| GET | `/favourites` | Admin | All favorites (paginated) |
| GET | `/recipes` | Admin | List recipes (paginated) |
| POST | `/recipes` | Admin | Create recipe (multipart) |
| PUT | `/recipes/:id` | Admin | Update recipe (multipart) |
| DELETE | `/recipes/:id` | Admin | Delete recipe |
| GET | `/users` | Admin | List users (paginated) |
| PATCH | `/users/:id/status` | Admin | Toggle active/deactive |

### Pagination response shape

```json
{
  "data": [...],
  "total": 42,
  "page": 1,
  "limit": 10,
  "pages": 5
}
```

---

## Frontend Pages

| Route | Component | Access |
|-------|-----------|--------|
| `/` | `HomePage` | Public |
| `/recipes` | `RecipeListPage` | Public |
| `/recipes/:id` | `RecipeDetailPage` | Public |
| `/login` | `LoginPage` | Public |
| `/register` | `RegisterPage` | Public |
| `/forgot-password` | `ForgotPasswordPage` | Public |
| `/profile` | `ProfilePage` | Logged-in users |
| `/admin/recipes` | `AdminRecipesPage` | Admin only |

---

## Authentication Flow

```
Register / Login
      │
      ▼
 POST /api/auth/signin
      │
      ▼
 JWT returned → stored in localStorage
      │
      ▼
 Axios interceptor attaches Bearer token on every request
      │
      ▼
 AuthContext (useReducer) holds { user, token, loading }
      │
      ├── ProtectedRoute  → redirects to /login if no user
      └── AdminRoute      → redirects to / if role ≠ admin
```

**Google OAuth flow:**
1. User clicks "Continue with Google" → `GET /api/auth/google`
2. Google redirects to `/api/auth/google/callback`
3. Passport finds or creates user, issues JWT
4. JWT returned in JSON response; client stores it and redirects

---

## Data Models

### User
```
_id, name, email, password (bcrypt, optional for OAuth),
role (user | admin), status (active | deactive),
provider, providerId, otpHash, otpExpiry
```

### Recipe
```
_id, title, description, ingredients [String],
steps [String], tags [String], cookingTime (Number, min),
difficulty (easy | medium | hard), rating (0–5),
image (filename), category (→ Category), createdBy (→ User)
```

### Category
```
_id, name (unique)
```

### Favorite
```
_id, userId (→ User), recipeId (→ Recipe), createdAt
```
