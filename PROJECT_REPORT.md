# 🛒 NextBuy — Full-Stack eCommerce Project Report

> **Author:** Yash Singh  
> **Project Type:** Full-Stack Web Application (MERN Stack with TypeScript)  
> **Report Updated:** April 2026  
> **Project Path:** `c:\Yash\STUDY\Project\NextBuy`

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Backend Architecture](#4-backend-architecture)
   - [Entry Point](#41-entry-point)
   - [Database Configuration](#42-database-configuration)
   - [Data Models](#43-data-models)
   - [Controllers](#44-controllers)
   - [Middleware](#45-middleware)
   - [API Routes](#46-api-routes)
5. [Frontend Architecture](#5-frontend-architecture)
   - [App Entry & Routing](#51-app-entry--routing)
   - [Context (State Management)](#52-context-state-management)
   - [Pages](#53-pages)
   - [Components](#54-components)
   - [Services](#55-services)
6. [API Reference](#6-api-reference)
7. [Authentication & Authorization Flow](#7-authentication--authorization-flow)
8. [Role-Based Access Control (RBAC)](#8-role-based-access-control-rbac)
9. [Environment Variables](#9-environment-variables)
10. [How to Run the Project](#10-how-to-run-the-project)
11. [Improvements Made (v2)](#11-improvements-made-v2)
12. [Known Limitations & Future Improvements](#12-known-limitations--future-improvements)

---

## 1. Project Overview

**NextBuy** is a full-stack eCommerce web application built using the MERN stack with TypeScript on both ends. It simulates a real-world online shopping platform with:

- User registration and login (JWT-based authentication)
- Product browsing and detail views (real data from MongoDB)
- Shopping cart with **localStorage persistence** (survives page refresh)
- Order history (demo data — orders API planned)
- Admin panel for **real** product CRUD (create/read/update/delete via API)
- Role-based access control (regular user vs. admin)

---

## 2. Technology Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | — | Runtime environment |
| Express.js | ^4.18.2 | REST API framework |
| TypeScript | ^5.2.0 | Type safety |
| MongoDB | — | NoSQL database |
| Mongoose | ^7.8.9 | ODM for MongoDB |
| jsonwebtoken | ^9.0.0 | JWT authentication |
| bcryptjs | ^2.4.3 | Password hashing |
| dotenv | ^16.0.0 | Environment variable management |
| cors | ^2.8.6 | Cross-Origin Resource Sharing |
| ts-node-dev | ^2.0.0 | Dev server with hot-reload |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | ^19.2.4 | UI library |
| TypeScript | ~6.0.2 | Type safety |
| Vite | ^8.0.4 | Build tool & dev server |
| React Router DOM | ^7.14.0 | Client-side routing |
| Axios | ^1.15.0 | HTTP client for API calls |
| Bootstrap | ^5.3.8 | Responsive CSS framework |

---

## 3. Project Structure

```
NextBuy/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts               # MongoDB connection setup
│   │   ├── controllers/
│   │   │   ├── authController.ts   # Register & Login logic
│   │   │   ├── productController.ts# CRUD operations for products
│   │   │   ├── userController.ts   # Get current user (/me)
│   │   │   └── healthController.ts # Health check endpoint
│   │   ├── middleware/
│   │   │   ├── auth.ts             # JWT verification middleware
│   │   │   └── admin.ts            # Admin privilege check
│   │   ├── models/
│   │   │   ├── userModel.ts        # Mongoose User schema
│   │   │   └── productModel.ts     # Mongoose Product schema
│   │   ├── routes/
│   │   │   ├── index.ts            # Main router
│   │   │   ├── auth.ts             # Auth routes
│   │   │   └── products.ts         # Products CRUD routes
│   │   └── index.ts                # Express server entry point
│   ├── .env                        # Secret environment variables
│   ├── .env.example                # Template (safe to share)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.tsx          # Auth-aware navigation bar
    │   │   ├── ProductCard.tsx     # Product display card
    │   │   ├── ProtectedRoute.tsx  # Guards logged-in routes
    │   │   └── AdminRoute.tsx      # Guards admin-only routes
    │   ├── context/
    │   │   ├── AuthContext.tsx     # Global auth state (JWT + user)
    │   │   └── CartContext.tsx     # Cart state with localStorage persistence ✨
    │   ├── pages/
    │   │   ├── Products.tsx        # Product listing (real API)
    │   │   ├── ProductDetail.tsx   # Single product (real API)
    │   │   ├── Cart.tsx            # Cart (persistent across refresh) ✨
    │   │   ├── Orders.tsx          # Order history (demo data)
    │   │   ├── Profile.tsx         # User profile
    │   │   ├── Login.tsx           # Login form
    │   │   ├── Register.tsx        # Registration form
    │   │   └── admin/
    │   │       ├── AdminDashboard.tsx  # Stats + real product count ✨
    │   │       ├── AdminProducts.tsx   # Full CRUD via real API ✨
    │   │       └── AdminOrders.tsx     # Order management (demo)
    │   ├── services/
    │   │   ├── api.ts              # Axios client + all API functions ✨
    │   │   ├── authHelpers.ts      # localStorage auth utilities
    │   │   ├── mockData.ts         # Mock orders & users (demo)
    │   │   └── productData.ts      # Mock products (no longer used in main pages)
    │   ├── App.tsx                 # Root component with routing
    │   └── main.tsx                # React app entry point
    └── package.json
```

> ✨ = Updated in v2 improvements

---

## 4. Backend Architecture

### 4.1 Entry Point

**File:** `backend/src/index.ts`

- Configures CORS for `localhost:5173` and `localhost:5174`
- Parses JSON request bodies
- Mounts all routes under `/api`
- Connects to MongoDB before starting the HTTP server

### 4.2 Database Configuration

**File:** `backend/src/config/db.ts`

- Uses Mongoose to connect to MongoDB
- Reads `MONGO_URI` from environment variables
- Throws immediately if `MONGO_URI` is not set

### 4.3 Data Models

#### User Model

| Field | Type | Required | Default |
|---|---|---|---|
| `name` | String | ✅ | — |
| `email` | String | ✅ | — (unique) |
| `password` | String | ✅ | — (bcrypt hash) |
| `isAdmin` | Boolean | — | `false` |
| `createdAt` | Date | — | `Date.now` |

#### Product Model

| Field | Type | Required | Default |
|---|---|---|---|
| `name` | String | ✅ | — |
| `price` | Number | ✅ | — |
| `description` | String | — | — |
| `image` | String | — | — |
| `createdAt` | Date | — | `Date.now` |

### 4.4 Controllers

#### `authController.ts`

| Function | HTTP | Description |
|---|---|---|
| `register` | `POST /api/auth/register` | Validates fields, hashes password, creates user, returns JWT |
| `login` | `POST /api/auth/login` | Verifies credentials, returns JWT + user object |

**v2 improvements:**
- Descriptive validation messages (`"Name, email and password are required"`)
- All errors labelled in `console.error` (`"Error in register:"`)
- Generic login message: `"Invalid email or password"` (prevents user enumeration)

#### `productController.ts`

| Function | HTTP | Auth | Description |
|---|---|---|---|
| `getProducts` | `GET /api/products` | None | Returns all products, **sorted newest first** |
| `getProduct` | `GET /api/products/:id` | None | Returns single product by MongoDB `_id` |
| `createProduct` | `POST /api/products` | Admin | Creates a new product |
| `updateProduct` | `PUT /api/products/:id` | Admin | Updates product, returns updated doc |
| `deleteProduct` | `DELETE /api/products/:id` | Admin | Deletes product |

**v2 improvement:** Products are now sorted newest-first (`sort({ createdAt: -1 })`).

#### `userController.ts`

| Function | HTTP | Auth | Description |
|---|---|---|---|
| `me` | `GET /api/me` | JWT | Returns current user without password |

#### `healthController.ts`

```json
// GET /api/health response:
{ "status": "ok", "message": "NextBuy API is running", "timestamp": "..." }
```

### 4.5 Middleware

#### `auth.ts` — JWT Middleware
1. Reads `Authorization: Bearer <token>` header
2. Verifies JWT with `JWT_SECRET`
3. Attaches `req.userId` for controllers to use
4. Returns `401` if missing or invalid

#### `admin.ts` — Admin Middleware
1. Reads `userId` from request (set by `auth`)
2. Looks up user in MongoDB
3. Returns `403` if `isAdmin` is `false`

**Always used after `auth` middleware:**
```
Request → auth → admin → controller
```

### 4.6 API Routes

**Base URL:** `http://localhost:3000/api`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | None | Health check |
| `POST` | `/auth/register` | None | Register user |
| `POST` | `/auth/login` | None | Login user |
| `GET` | `/me` | JWT | Get current user |
| `GET` | `/products` | None | Get all products |
| `GET` | `/products/:id` | None | Get one product |
| `POST` | `/products` | Admin | Create product |
| `PUT` | `/products/:id` | Admin | Update product |
| `DELETE` | `/products/:id` | Admin | Delete product |

---

## 5. Frontend Architecture

### 5.1 App Entry & Routing

**File:** `frontend/src/App.tsx`

```
<AuthProvider>            ← manages JWT + user state globally
  <CartProvider>          ← manages cart state globally
    <BrowserRouter>
      <Navbar />
      <Routes>...</Routes>
    </BrowserRouter>
  </CartProvider>
</AuthProvider>
```

**Route Table:**

| Path | Component | Access |
|---|---|---|
| `/` | `Products` | 🌐 Public |
| `/product/:id` | `ProductDetail` | 🌐 Public |
| `/login` | `Login` | 🌐 Public |
| `/register` | `Register` | 🌐 Public |
| `/cart` | `Cart` | 🔒 Logged In |
| `/orders` | `Orders` | 🔒 Logged In |
| `/profile` | `Profile` | 🔒 Logged In |
| `/admin` | `AdminDashboard` | 🛡️ Admin Only |
| `/admin/products` | `AdminProducts` | 🛡️ Admin Only |
| `/admin/orders` | `AdminOrders` | 🛡️ Admin Only |

### 5.2 Context (State Management)

#### `AuthContext.tsx`

Provides global authentication state across the app.

| Key | Type | Description |
|---|---|---|
| `user` | `AuthUser \| null` | Logged-in user (`id`, `email`, `isAdmin`) |
| `token` | `string \| null` | JWT string |
| `isLoggedIn` | `boolean` | `true` if token exists |
| `login(token, user)` | function | Saves to localStorage + updates state |
| `logout()` | function | Clears localStorage + resets state |

**Session persistence:** Reads from `localStorage` on first load — session survives page refresh.

#### `CartContext.tsx` ✨ (v2 — rewritten)

**Key changes from v1:**
- Product type now uses `string _id` (MongoDB ObjectId) instead of a hashed numeric `id`
- Cart is automatically saved to `localStorage` on every change via `useEffect`
- Cart is loaded from `localStorage` on page load — **cart survives refresh**
- Added `clearCart()` function

```typescript
// Product type (v2)
type Product = {
  _id: string;        // MongoDB ObjectId — e.g. "663abc12..."
  name: string;
  price: number;
  image: string;
  description: string;
};
```

**How localStorage persistence works:**
```
User adds item → setCartItems() → useEffect detects change
→ localStorage.setItem('cart', JSON.stringify(cartItems))

Page refresh → useState initializer runs loadCart()
→ localStorage.getItem('cart') → parse → restore cart
```

### 5.3 Pages

| Page | Data Source | Loading Spinner | Error Handling |
|---|---|---|---|
| `Products` | ✅ Real API | ✅ | ✅ Retry button |
| `ProductDetail` | ✅ Real API | ✅ | ✅ |
| `Cart` | Context (localStorage) | — | ✅ Image fallback |
| `Orders` | 🟡 Mock data | — | Info banner shown |
| `Profile` | Context | — | — |
| `Login` | API call | ✅ | ✅ |
| `Register` | API call | ✅ | ✅ |
| `AdminDashboard` | Products: ✅ Real API; Orders/Users: 🟡 Mock | ✅ (products card) | ✅ |
| `AdminProducts` | ✅ Real API (full CRUD) | ✅ | ✅ Form + page errors |
| `AdminOrders` | 🟡 Mock data | — | — |

### 5.4 Components

#### `Navbar.tsx`
Responsive Bootstrap navbar that changes based on auth state:

| State | Links shown |
|---|---|
| Guest | Products, Cart, Login, Register |
| Logged in | Products, Orders, Cart (badge), Profile, Logout |
| Admin | + 🛠️ Admin link |

#### `ProtectedRoute.tsx`
- Not logged in → redirect to `/login`

#### `AdminRoute.tsx`
- Not logged in → redirect to `/login`
- Logged in but not admin → redirect to `/`

### 5.5 Services

#### `api.ts` ✨ (v2 — extended)

All API functions in one place:

```typescript
// Auth
registerUser(data)          // POST /auth/register
loginUser(data)             // POST /auth/login

// Products (public)
fetchProducts()             // GET /products
fetchProductById(id)        // GET /products/:id

// Products (admin)
createProduct(data)         // POST /products
updateProduct(id, data)     // PUT /products/:id
deleteProduct(id)           // DELETE /products/:id

// Error helper (NEW in v2)
getErrorMessage(err)        // extracts message string from any Axios error
```

**`getErrorMessage` — how it works:**
```typescript
// Instead of ugly if-chains in every catch block, use:
} catch (err) {
  setError(getErrorMessage(err));
  // Returns backend message if available, or a generic fallback
}
```

**`BackendProduct` type (v2 — simplified):**
```typescript
interface BackendProduct {
  _id: string;         // always a string — no more optional fields
  name: string;
  price: number;
  description: string;
  image: string;
  createdAt?: string;
}
```

> **v1 problem:** `_id` was optional, causing hacky numeric id hashing in `Products.tsx` and `ProductDetail.tsx`. **v2 fix:** `_id` is always a required string.

#### `authHelpers.ts`

Utility functions for reading auth data anywhere outside React:

| Function | Returns | Description |
|---|---|---|
| `getUser()` | `AuthUser \| null` | Read user from localStorage |
| `getToken()` | `string \| null` | Read JWT token |
| `isAuthenticated()` | `boolean` | Check if logged in |
| `isAdmin()` | `boolean` | Check if user is admin |
| `saveAuth(token, user)` | `void` | Save token + user to localStorage |
| `clearAuth()` | `void` | Remove from localStorage |

---

## 6. API Reference

### Request/Response Examples

**Register:**
```json
POST /api/auth/register
Body: { "name": "Yash Singh", "email": "yash@example.com", "password": "pass123" }

Success (201):
{ "token": "<jwt>", "user": { "id": "...", "name": "Yash Singh", "email": "yash@example.com", "isAdmin": false } }

Error (400): { "message": "Email is already registered" }
```

**Login:**
```json
POST /api/auth/login
Body: { "email": "yash@example.com", "password": "pass123" }

Success (200):
{ "token": "<jwt>", "user": { "id": "...", "email": "yash@example.com", "isAdmin": false } }

Error (400): { "message": "Invalid email or password" }
```

**Create Product (Admin):**
```json
POST /api/products
Headers: { "Authorization": "Bearer <admin-jwt>" }
Body: { "name": "Wireless Mouse", "price": 1499, "description": "Ergonomic design", "image": "https://..." }

Success (201): { "_id": "...", "name": "Wireless Mouse", "price": 1499, ... }
Error (403): { "message": "Admin privileges required" }
```

**Get All Products:**
```json
GET /api/products
Success (200): [ { "_id": "...", "name": "...", "price": 999, ... }, ... ]
```

---

## 7. Authentication & Authorization Flow

```
User fills login form (email + password)
        │
        ▼
POST /api/auth/login
        │
        ├── ❌ Wrong password → 400 "Invalid email or password"
        │
        └── ✅ Valid →
                │
        JWT signed with userId, expires in 7 days
                │
        Response: { token, user }
                │
        Frontend: saveAuth(token, user) → localStorage
                │
        AuthContext: setToken + setUser
                │
        All future API requests:
        Axios interceptor → Authorization: Bearer <token>
                │
        auth middleware verifies on each protected request
```

---

## 8. Role-Based Access Control (RBAC)

| Role | `isAdmin` | Access Level |
|---|---|---|
| **Guest** | N/A | Public pages only |
| **User** | `false` | + Cart, Orders, Profile |
| **Admin** | `true` | + Admin Dashboard, Products, Orders |

**Frontend guards:**
```
ProtectedRoute → checks isLoggedIn (token exists in localStorage)
AdminRoute     → checks isLoggedIn AND user.isAdmin === true
```

**Backend guards:**
```
auth middleware  → verifies JWT signature
admin middleware → queries DB to confirm user.isAdmin === true
```

**To create an admin account** (via register with secret code):
```json
POST /api/auth/register
{ "name": "Admin", "email": "admin@nextbuy.com", "password": "adminpass", "adminCode": "your_admin_code_here" }
```

---

## 9. Environment Variables

**File:** `backend/.env` (copy from `.env.example`)

| Variable | Example | Description |
|---|---|---|
| `PORT` | `3000` | Express server port |
| `NODE_ENV` | `development` | App environment |
| `MONGO_URI` | `mongodb://localhost:27017/nextbuy` | MongoDB connection string |
| `JWT_SECRET` | `mysecretkey123` | Secret for JWT signing |
| `ADMIN_CODE` | `myadmincode` | Secret code to register admin users |

> ⚠️ Never commit your `.env` file — it's in `.gitignore`.

---

## 10. How to Run the Project

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### Step 1: Backend
```bash
cd c:\Yash\STUDY\Project\NextBuy\backend

# Copy env file and fill in your values
copy .env.example .env

# Install dependencies
npm install

# Start dev server (hot-reload)
npm run dev
# → Server runs at http://localhost:3000
```

### Step 2: Frontend
```bash
cd c:\Yash\STUDY\Project\NextBuy\frontend
npm install
npm run dev
# → App runs at http://localhost:5173
```

### Step 3: Verify
1. `http://localhost:3000/api/health` → `{ "status": "ok" }`
2. `http://localhost:5173` → Products page loads
3. Register → Login → Add items to cart → Refresh → Cart should still be there ✅

---

## 11. Improvements Made (v2)

### Fix 1 — Cart localStorage Persistence ✅
**File:** `CartContext.tsx`
- Cart items now saved to `localStorage` after every change via `useEffect`
- Cart loaded from `localStorage` on page load — survives browser refresh
- Changed product identifier from `id: number` to `_id: string` (MongoDB ObjectId)
- Added `clearCart()` function + "Clear Cart" button in Cart page

### Fix 2 — Product Type Fixed to Use `_id` Consistently ✅
**Files:** `api.ts`, `CartContext.tsx`, `Products.tsx`, `ProductDetail.tsx`
- `BackendProduct._id` is now always a required `string`
- Removed the hacky `Math.abs(hash)` conversion that turned `_id` into a number
- All pages now use `_id` directly for React keys, routing, and cart operations

### Fix 3 — Admin Product CRUD via Real API ✅
**File:** `AdminProducts.tsx`
- Replaced `mockProducts` state with real `fetchProducts()` on mount
- Create product calls `createProduct()` API
- Edit product calls `updateProduct()` API
- Delete product calls `deleteProduct()` API
- Added loading spinner, form-level error display, save spinner button

### Fix 4 — Admin Dashboard Shows Real Product Count ✅
**File:** `AdminDashboard.tsx`
- Fetches real product list from the backend
- Shows loading spinner in the Products stat card while fetching
- Orders/Users/Revenue still use mock data (no orders API yet) — clearly documented

### Fix 5 — Reusable `getErrorMessage` Helper ✅
**File:** `api.ts`
- Replaces 10-line `if` chains in every `catch` block
- Extracts backend error message or returns a clean fallback string
- Used in: `Products.tsx`, `ProductDetail.tsx`, `AdminProducts.tsx`, `AdminDashboard.tsx`

### Fix 6 — Backend Controller Improvements ✅
**Files:** `authController.ts`, `productController.ts`, `userController.ts`, `healthController.ts`
- All controllers have `try-catch` with labelled `console.error` messages
- `getProducts` now sorts results newest-first
- Auth messages improved (no user enumeration, clear required-field messages)
- Health endpoint returns `message` field for easy debugging

### Fix 7 — UI Improvements ✅
- Cart empty state shows a 🛒 emoji icon
- Orders empty state shows a 📦 emoji icon
- Orders page shows info banner explaining demo data
- Image `onError` fallbacks added to Cart page
- Admin Products shows "No products yet" message when list is empty
- Admin Dashboard Products card shows spinner while loading

### Fix 8 — User Profile Editing via Real API ✅
**Files:** `userController.ts`, `api.ts`, `AuthContext.tsx`, `Profile.tsx`, `routes/index.ts`
- Built `PUT /api/me` backend endpoint to safely update name, email, and conditionally hash a new password.
- Added `updateProfile()` API service function.
- Added `updateUser()` context function to immediately sync UI state (like navbar display name) across the app without requiring a re-login.
- Repurposed the UI in `Profile.tsx` to handle true API calls, complete with loading spinners, success alerts, and duplicate email error handling.
- Persisted non-DB fields (`phone` and `address`) correctly to `localStorage` per user ID so form inputs survive page refreshes.

---

## 12. Known Limitations & Future Improvements

| Area | Current State | Improvement Needed |
|---|---|---|
| **Orders** | Mock data | Build `POST /api/orders` + `GET /api/orders/my` endpoints |
| **Admin Orders** | Mock data | Connect to real orders API |
| **Admin Users** | Mock data | Build `GET /api/users` admin endpoint |
| **Cart** | localStorage only | Sync cart with backend on login |
| **Admin Revenue** | Mock calculation | Real MongoDB aggregation query |
| **Image Upload** | URL string only | Add Cloudinary or S3 file upload |
| **Payment** | Placeholder button | Integrate Razorpay or Stripe |
| **Pagination** | All products at once | Add limit/page query params |
| **Search** | Not implemented | Add search bar + server-side filter |
| **Testing** | No tests | Add Jest + React Testing Library |
| **Deployment** | Local only | Railway (backend) + Vercel (frontend) |

---

*Report updated by Antigravity AI — April 2026*
