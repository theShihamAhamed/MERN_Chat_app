<div align="center">

# 💬 Toki

### Real-Time Chat App

A full-stack MERN chat application with real-time messaging, JWT authentication, image sharing, and production-grade security.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-toki--frontend--tawny.vercel.app-cyan?style=for-the-badge&logo=vercel)](https://toki-frontend-tawny.vercel.app/)
[![Node.js](https://img.shields.io/badge/Node.js-22+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.x-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

</div>

---

## ✨ Features

- **Real-time messaging** — instant message delivery via Socket.IO with no polling
- **Online presence** — see who's online across multiple tabs and devices
- **JWT authentication** — secure HTTP-only cookie auth with session persistence
- **Image sharing** — send images in messages; uploaded and served via Cloudinary
- **Profile pictures** — upload and update your avatar, stored on Cloudinary
- **Welcome email** — automated onboarding email on signup via Resend
- **Optimistic UI** — messages appear instantly before the server confirms
- **Sound effects** — optional keyboard typing sounds, mouse clicks, and notifications
- **Chats list** — smart list showing recent conversations with latest-message previews
- **Contacts tab** — browse all users to start new conversations
- **Arcjet security** — rate limiting, bot detection, and shield protection on all API routes
- **Smooth animations** — Framer Motion transitions throughout the UI

---

## 🛠 Tech Stack

### Backend
| Package | Purpose |
|---|---|
| **Express** | REST API framework |
| **MongoDB + Mongoose** | Database and ODM |
| **Socket.IO** | Real-time bidirectional messaging |
| **JWT + bcryptjs** | Authentication and password hashing |
| **Cloudinary** | Image upload and CDN hosting |
| **Resend** | Transactional welcome email |
| **Arcjet** | Rate limiting, bot detection, shield |
| **Pino** | Structured JSON logging |
| **cookie-parser** | HTTP-only cookie handling |

### Frontend
| Package | Purpose |
|---|---|
| **React 19 + Vite** | UI framework and build tool |
| **Zustand** | Global state management |
| **Socket.IO Client** | Real-time connection |
| **Axios** | HTTP client with credentials |
| **React Router v7** | Client-side routing |
| **Tailwind CSS v4** | Utility-first styling |
| **Framer Motion** | Animations and transitions |
| **React Hook Form** | Form validation |
| **Lucide React** | Icon library |
| **React Hot Toast** | Toast notifications |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Browser (React SPA)                    │
│                                                          │
│  Zustand Store ←→ Axios (REST) ←→ Socket.IO Client      │
│  useAuthStore       /api/*          ws://backend         │
│  useChatStore                                            │
└────────────────────┬────────────────────────────────────┘
                     │  HTTPS + WSS
┌────────────────────▼────────────────────────────────────┐
│               Express + Socket.IO Server                 │
│                                                          │
│  Arcjet Middleware → Route Handlers → Controllers        │
│                                                          │
│  /api/auth/*       /api/messages/*    /api/health        │
│  signup, login,    send, contacts,                       │
│  logout, profile   chats, history                        │
│                                                          │
│  Socket.IO (JWT cookie auth middleware)                  │
│  userId → Set<socketId> (multi-tab aware)                │
└──────────┬─────────────────────┬───────────────────────┘
           │                     │
    ┌──────▼──────┐    ┌─────────▼──────────┐
    │  MongoDB    │    │  External Services  │
    │  Atlas      │    │  Cloudinary (imgs)  │
    │  users      │    │  Resend (email)     │
    │  messages   │    │  Arcjet (security)  │
    └─────────────┘    └────────────────────┘
```

### Real-Time Message Flow

1. User logs in → backend sets `token` as an HTTP-only cookie
2. Frontend opens a Socket.IO connection with `withCredentials: true`
3. Socket middleware reads and verifies the JWT cookie
4. Server maps `userId → Set<socketId>` (supports multi-tab)
5. On `sendMessage`, backend saves to MongoDB, then emits `newMessage` to all receiver sockets
6. Frontend shows the message optimistically, then replaces it with the confirmed copy
7. On disconnect, only that socket ID is removed — other tabs stay online

---

## 📁 Project Structure

```
toki/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js      # signup, login, logout, updateProfile
│   │   │   └── message.controller.js   # sendMessage, getMessages, getChatPartners
│   │   ├── lib/
│   │   │   ├── arcjet.js               # rate limit + bot detection config
│   │   │   ├── cloudinary.js           # Cloudinary client init
│   │   │   ├── config.js               # env var parsing and exports
│   │   │   ├── db.js                   # MongoDB connection
│   │   │   ├── logger.js               # Pino logger
│   │   │   ├── resend.js               # Resend client init
│   │   │   └── socket.js               # Socket.IO server + online user map
│   │   ├── middleware/
│   │   │   ├── arcjet.middleware.js    # Arcjet route protection
│   │   │   ├── auth.middleware.js      # JWT cookie verification
│   │   │   └── socket.auth.middleware.js # Socket.IO JWT auth
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   └── message.model.js
│   │   ├── routes/
│   │   │   ├── auth.route.js
│   │   │   └── message.route.js
│   │   ├── utils/
│   │   │   ├── authCookie.js
│   │   │   ├── generateTokenAndSetCookie.js
│   │   │   ├── validators.js
│   │   │   └── email/
│   │   │       ├── emailHandler.js
│   │   │       └── createWelcomeEmailTemplate.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── avatar.png
│   │   └── sounds/                     # keystroke, notification, click audio
│   ├── src/
│   │   ├── components/                 # chatContainer, chatHeader, messageInput…
│   │   ├── hooks/
│   │   │   └── useKeyboardSound.js     # random keystroke sound player
│   │   ├── layouts/
│   │   │   └── rootLayout.jsx
│   │   ├── lib/
│   │   │   ├── axios.js                # Axios instance with withCredentials
│   │   │   └── config.js
│   │   ├── pages/
│   │   │   ├── chatPage.jsx
│   │   │   ├── loginPage.jsx
│   │   │   └── signUpPage.jsx
│   │   ├── store/
│   │   │   ├── useAuthStore.js         # auth state + socket lifecycle
│   │   │   └── useChatStore.js         # messages, chats, contacts, sounds
│   │   ├── utils/
│   │   │   └── socket.js               # Socket.IO client factory
│   │   └── App.jsx
│   ├── .env.example
│   ├── vercel.json                     # SPA rewrite rule for Vercel
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started (Local)

### Prerequisites

- Node.js 18+
- MongoDB running locally **or** a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string
- [Cloudinary](https://cloudinary.com/) account (free tier works)
- [Resend](https://resend.com/) account for emails (optional — signup still works without it)
- [Arcjet](https://arcjet.com/) key (optional — middleware safely no-ops without it)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/toki.git
cd toki
```

### 2. Install dependencies

```bash
npm install --prefix backend
npm install --prefix frontend
```

### 3. Configure environment variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` with your values (see [Environment Variables](#-environment-variables) below).

The frontend `.env` defaults to `http://localhost:5000` — no changes needed for local dev.

### 4. Start the servers

**Backend** (runs on port 5000):
```bash
npm run dev --prefix backend
```

**Frontend** (runs on port 5173):
```bash
npm run dev --prefix frontend
```

### 5. Open the app

```
http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend — `backend/.env`

```env
# Server
NODE_ENV=development
PORT=5000
LOG_LEVEL=info
TRUST_PROXY=false

# Database
MONGODB_URI=mongodb://127.0.0.1:27017/Toki

# Auth
JWT_SECRET=replace-with-a-long-random-secret

# CORS / Cookie
CLIENT_URL=http://localhost:5173
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
SERVE_FRONTEND=false

# Resend (welcome email)
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=onboarding@yourdomain.com
EMAIL_FROM_NAME=Toki

# Cloudinary (image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Arcjet (security)
ARCJET_KEY=ajkey_xxxxx
ARCJET_MODE=DRY_RUN

# Upload limits
MAX_IMAGE_UPLOAD_BYTES=5242880
JSON_BODY_LIMIT=10mb
```

**Key variable notes:**

| Variable | Description |
|---|---|
| `MONGODB_URI` | Local MongoDB or MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string — never commit the real value |
| `CLIENT_URL` | Frontend origin allowed by CORS. Comma-separate multiple URLs |
| `COOKIE_SECURE` | `false` for HTTP locally; `true` for HTTPS production |
| `COOKIE_SAME_SITE` | `lax` for same-domain; `none` for cross-domain frontend/backend |
| `TRUST_PROXY` | Set to `1` on hosted platforms (Render, Railway, etc.) |
| `SERVE_FRONTEND` | `true` only when `frontend/dist` is present in the backend service |
| `ARCJET_MODE` | `DRY_RUN` to observe, `LIVE` to enforce |

### Frontend — `frontend/.env`

```env
# Only needed for split frontend/backend deployments
VITE_API_BASE_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
```

For same-domain production (Express serving the SPA), both variables can be omitted.

---

## 📡 API Reference

### Auth — `/api/auth`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/signup` | — | Register a new user |
| `POST` | `/login` | — | Authenticate and set cookie |
| `POST` | `/logout` | — | Clear auth cookie |
| `GET` | `/profile` | ✅ | Get current user profile |
| `PUT` | `/update-profile` | ✅ | Upload new profile picture |

### Messages — `/api/messages`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/send/:id` | ✅ | Send a message to user `:id` |
| `GET` | `/chats` | ✅ | Get chat partners with latest messages |
| `GET` | `/contacts` | ✅ | Get all users (for starting new chats) |
| `GET` | `/:id` | ✅ | Get full message history with user `:id` |

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns `200 OK` — use for deployment health checks |

---

## 🌐 Deployment

### Option A — Split (Vercel + Render) ← *Live demo uses this*

This is the recommended approach for a portfolio deployment. The React frontend lives on Vercel; the Express API runs on Render with WebSocket support.

**Render backend:**

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| WebSocket support | Required — enable in Render settings |

Backend environment variables on Render:

```env
NODE_ENV=production
PORT=10000
TRUST_PROXY=1
SERVE_FRONTEND=false
CLIENT_URL=https://your-frontend.vercel.app
COOKIE_SECURE=true
COOKIE_SAME_SITE=none
# ... plus MongoDB, JWT, Cloudinary, Resend, Arcjet
```

**Vercel frontend:**

```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api
VITE_BACKEND_URL=https://your-backend.onrender.com
```

`vercel.json` in `frontend/` already includes the SPA rewrite rule — no extra config needed.

> **Cross-domain cookie note:** Both frontend and backend must be on HTTPS. Axios and Socket.IO must send credentials. `COOKIE_SAME_SITE=none` is required for cross-domain cookies.

---

### Option B — Single Full-Stack Service (Render / Railway / Fly.io)

Express serves both the API and the compiled React SPA from the same process and domain.

**Build command:**
```bash
npm run build
```

**Start command:**
```bash
npm start
```

Backend environment variables:

```env
NODE_ENV=production
PORT=<platform-assigned>
TRUST_PROXY=1
SERVE_FRONTEND=true
CLIENT_URL=https://your-app.example.com
COOKIE_SECURE=true
COOKIE_SAME_SITE=lax
```

Leave `VITE_API_BASE_URL` and `VITE_BACKEND_URL` empty — the frontend defaults to relative paths.

---

## 🔒 Auth & Cookie Reference

| Environment | `COOKIE_SECURE` | `COOKIE_SAME_SITE` | `CLIENT_URL` |
|---|---|---|---|
| Local dev | `false` | `lax` | `http://localhost:5173` |
| Same-domain production | `true` | `lax` | `https://your-app.com` |
| Cross-domain production | `true` | `none` | `https://your-frontend.vercel.app` |

Logout clears the `token` cookie using the same options as login, so the browser removes it correctly.

---

## 🛡 Arcjet Security

Arcjet protects all `/api/auth/*` and `/api/messages/*` routes with:

- **Shield** — blocks common attack patterns
- **Bot detection** — denies spoofed bots; allows search engine crawlers
- **Sliding window rate limit** — 100 requests per 60 seconds per client

Without `ARCJET_KEY`, the middleware no-ops safely — useful for local dev without an account. Arcjet errors also fail open so a provider outage never takes your API offline.

```env
# Start in dry-run to observe decisions without blocking
ARCJET_MODE=DRY_RUN

# Switch to live once you've reviewed the Arcjet dashboard
ARCJET_MODE=LIVE
```

---

## 🔧 Useful Commands

```bash
# Install all dependencies
npm install --prefix backend && npm install --prefix frontend

# Development
npm run dev --prefix backend        # Start backend with nodemon
npm run dev --prefix frontend       # Start frontend with Vite HMR

# Lint
npm run lint --prefix backend       # Syntax check (backend)
npm run lint --prefix frontend      # ESLint (frontend)

# Production build
npm run build --prefix frontend     # Build frontend to frontend/dist
npm run build                       # Install deps + build frontend (root)
npm start                           # Start production backend

# Health check
curl http://localhost:5000/api/health
```

---

## 🐛 Troubleshooting

**Cookie not set after login**
- Confirm `COOKIE_SECURE=false` for local HTTP (`true` requires HTTPS)
- For cross-domain deployments, set `COOKIE_SAME_SITE=none` and ensure both sides are on HTTPS
- Check that Axios is configured with `withCredentials: true`

**CORS error**
- `CLIENT_URL` must be the exact frontend origin (e.g. `https://your-app.vercel.app`) — no trailing slash
- For multiple origins, use comma-separated values: `CLIENT_URL=https://a.com,https://b.com`

**Socket.IO won't connect**
- `VITE_BACKEND_URL` must point to the backend origin
- Confirm the hosting platform supports WebSockets
- The JWT cookie must be set before the socket connection is attempted

**Images fail to upload**
- Verify all three Cloudinary env vars are set
- Supported types: PNG, JPG/JPEG, GIF, WebP
- Increase `JSON_BODY_LIMIT` if large base64 payloads are rejected (default `10mb`)

**Welcome email not delivered**
- Verify `RESEND_API_KEY` and that `EMAIL_FROM` uses a verified sender domain in Resend
- Signup still succeeds if email delivery fails — check backend logs for warnings

**Arcjet blocking unexpectedly**
- Set `ARCJET_MODE=DRY_RUN` to log decisions without blocking traffic
- Ensure `TRUST_PROXY` is correct for your host (usually `1` on Render, Railway, etc.)

---

## 🚧 Known Limitations & Roadmap

**Current limitations:**
- No unread message counts or read receipts
- No typing indicators
- No message editing or deletion
- Frontend bundle has a large chunk warning (not yet code-split)

**Planned improvements:**
- [ ] Message pagination for long conversations
- [ ] Typing indicators
- [ ] Read receipts
- [ ] Code-split frontend bundle
- [ ] CI pipeline (lint, build, audit)

---

## 📝 License

[ISC](LICENSE) · Built by [ShihamAhamed](https://github.com/ShihamAhamed)
