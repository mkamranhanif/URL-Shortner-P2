# Project Context: URL Shortener P2

## 1. Overview
**URL Shortener P2** is a Node.js & Express-based server-side rendered (SSR) web application. It allows registered users to shorten URLs, redirect to original destinations via short IDs, track link analytics (total clicks & timestamped access history), and restrict generated links so users can view only their own created short URLs.

---

## 2. Tech Stack & Dependencies

- **Runtime**: Node.js (CommonJS modules)
- **Framework**: Express.js (`v5.2.1`)
- **Database**: MongoDB with Mongoose (`v9.8.0`)
- **View Engine**: EJS (`v6.0.1`)
- **Authentication**: Stateless JWT via `jsonwebtoken` (`v9.0.3`) & `cookie-parser` (`v1.4.7`)
- **ID Generator**: `nanoid` (`v6.0.0`)
- **Development Tools**: `nodemon` (`v3.1.14`)

---

## 3. Directory Structure

```
d:\Kamran\Backend\URL Shortner P2
├── index.js                  # Main Express application entry point
├── connection.js             # MongoDB connection helper
├── package.json              # Project metadata, dependencies, and scripts
├── controllers/
│   ├── url.js                # Handlers for generating short links, redirecting, and analytics
│   └── user.js               # Handlers for user registration (signup) and login
├── middleware/
│   └── auth.js               # Auth middlewares (restrictToLoggedinUserOnly & checkAuth)
├── models/
│   ├── url.js                # Mongoose schema & model for URLs
│   └── user.js               # Mongoose schema & model for Users
├── routes/
│   ├── staticRoutes.js       # Routes rendering EJS views (/, /login, /signup)
│   ├── url.js                # POST route for generating short links
│   └── user.js               # POST routes for user authentication (/signup, /login)
├── service/
│   └── auth.js               # JWT utility functions (setUser, getUser)
└── views/
    ├── home.ejs              # Main user dashboard UI (URL generator & links table)
    ├── login.ejs             # User login form
    └── signup.ejs            # User registration form
```

---

## 4. Database Schemas & Data Models

### User Model (`models/user.js`)
Collection Name: `users`
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}
```

### URL Model (`models/url.js`)
Collection Name: `urls`
```javascript
{
  shortId: { type: String, required: true, unique: true },
  redirectURL: { type: String, required: true },
  visitHistory: [{ timestamp: { type: Number } }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  timestamps: true // adds createdAt and updatedAt
}
```

---

## 5. Authentication Architecture (JWT)

- **Mechanism**: Stateless JWT token stored in an HTTP cookie named `uid`.
- **Secret Key**: `kami$lo@ay` (defined in `service/auth.js`).
- **Token Payload**: `{ _id: user._id, email: user.email }`.

### Key Functions (`service/auth.js`)
- `setUser(user)`: Signs a JWT payload containing `_id` and `email`.
- `getUser(token)`: Verifies the JWT token safely within a `try...catch` block. Returns the decoded user payload or `null` if the token is missing, expired, or malformed.

### Middlewares (`middleware/auth.js`)
- `restrictToLoggedinUserOnly`: Inspects `req.cookies?.uid`. If token is missing/invalid, redirects to `/login`. Populates `req.user`.
- `checkAuth`: Soft authentication check. Extracts token from `req.cookies?.uid` and attaches `req.user` if valid without blocking unauthenticated requests.

---

## 6. API & Application Routes

| Method | Endpoint | Middleware | Handler / Controller | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/` | `checkAuth`, `restrictToLoggedinUserOnly` | Inline in `staticRoutes.js` | Renders `home.ejs` with URLs filtered by `createdBy: req.user._id` |
| `GET` | `/signup` | None | Inline in `staticRoutes.js` | Renders registration page `signup.ejs` |
| `GET` | `/login` | None | Inline in `staticRoutes.js` | Renders login page `login.ejs` |
| `POST` | `/signup` | None | `handleUserCreation` (`controllers/user.js`) | Creates new user record and redirects to `/` |
| `POST` | `/login` | None | `handleUserLogin` (`controllers/user.js`) | Validates credentials, sets `uid` cookie with JWT token, redirects to `/` |
| `POST` | `/` | `restrictToLoggedinUserOnly` | `handleGenerateShortUrl` (`controllers/url.js`) | Generates an 8-char nanoid short URL with `createdBy: req.user._id` & re-renders `home.ejs` |
| `GET` | `/:shortid` | None | `handleGetById` (`controllers/url.js`) | Resolves `shortId`, pushes timestamp to `visitHistory`, and redirects to `redirectURL` |
| `GET` | `/analytics/:shortid` | None | `handleDataView` (`controllers/url.js`) | Returns JSON response with `totalClicks` and timestamped click `history` |

---

## 7. Crucial Implementation Details & Fixes Applied

1. **User Link Isolation Fix**:
   - *Previous Issue*: `handleGenerateShortUrl` in `controllers/url.js` was running `URL.find({})`, displaying all database entries to any user after URL generation.
   - *Resolution*: Updated to `URL.find({ createdBy: req.user._id })` so users only see their own generated links across both GET and POST flows.

2. **Session-to-JWT Migration & Malformed Token Protection**:
   - *Previous Issue*: Transition from stateful in-memory map session storage to JWT caused unhandled `JsonWebTokenError: jwt malformed` when receiving legacy non-JWT UUID cookies.
   - *Resolution*: Added explicit `try...catch` in `getUser()` in `service/auth.js` to return `null` on invalid token formats, prompting seamless re-authentication.

---

## 8. Setup & Execution

1. **Prerequisites**: Node.js & local MongoDB server (`mongodb://127.0.0.1:27017/urlShortner`).
2. **Install Dependencies**: `npm install`
3. **Start Application**: `npm start` (Runs via `nodemon` on `http://localhost:8001`)
