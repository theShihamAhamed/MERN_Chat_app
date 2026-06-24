# Toki MERN Real-Time Chat App

Toki is a MERN real-time chat application built as a learning project for authentication, WebSockets, email delivery, image uploads, and production deployment basics.

The app includes JWT HTTP-only cookie authentication, Socket.IO real-time messaging, MongoDB message storage, Cloudinary image uploads, Resend welcome emails, and Arcjet request protection.

## Learning Goals

- Understand MERN stack authentication with JWT cookies.
- Build real-time messaging with Socket.IO.
- Manage React chat state with Zustand.
- Send transactional welcome email with Resend.
- Upload profile and message images through Cloudinary.
- Add request protection with Arcjet.
- Prepare a full-stack app for deployment.

## Features

- Sign up, log in, log out, and restore session from cookie.
- HTTP-only JWT auth cookie.
- Real-time online users and message delivery.
- Multi-tab aware online-user tracking.
- Contacts list for starting first conversations.
- Chats list with latest-message previews.
- Text messages and image messages.
- Profile image upload.
- Resend welcome email on signup.
- Arcjet security middleware for auth and message routes.
- Optional production static serving of the frontend from Express.

## Tech Stack

Backend:

- Node.js
- Express
- MongoDB and Mongoose
- Socket.IO
- JWT
- bcryptjs
- Cookie parser
- Cloudinary
- Resend
- Arcjet
- Pino logging

Frontend:

- React
- Vite
- Zustand
- Axios
- Socket.IO client
- React Router
- Tailwind CSS
- Lucide icons

## Folder Structure

```text
chatApp/
  backend/
    src/
      controllers/
      lib/
      middleware/
      models/
      routes/
      utils/
      server.js
    .env.example
    package.json
  frontend/
    src/
      components/
      const/
      hooks/
      layouts/
      lib/
      pages/
      store/
      utils/
    .env.example
    package.json
  package.json
  README.md
```

## Architecture Overview

The frontend talks to the backend REST API with Axios and sends cookies by using `withCredentials`.

The backend exposes:

- `/api/auth/*` for auth/profile routes.
- `/api/messages/*` for contacts, chats, message history, and sending messages.
- `/api/health` for deployment health checks.

Socket.IO runs on the same HTTP server as Express. The socket connection authenticates by reading the JWT cookie from the socket handshake. After a user connects, the server stores the user ID with all active socket IDs so multiple tabs/devices remain online correctly.

In production, Express runs safely as an API-only service by default. It can also serve `frontend/dist` for a single full-stack deployment when `SERVE_FRONTEND=true` and `frontend/dist/index.html` exists. The frontend can be deployed separately by setting Vite backend URL env vars.

## Environment Variables

Never commit a real `.env` file. Use the example files as templates.

### Backend

Create `backend/.env` from `backend/.env.example`.

```env
NODE_ENV=development
PORT=5000
LOG_LEVEL=info
TRUST_PROXY=false
SERVE_FRONTEND=false

MONGODB_URI=mongodb://127.0.0.1:27017/Toki
JWT_SECRET=replace-with-a-long-random-secret

CLIENT_URL=http://localhost:5173
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax

RESEND_API_KEY=re_xxxxx
EMAIL_FROM=onboarding@example.com
EMAIL_FROM_NAME=Toki

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

ARCJET_KEY=ajkey_xxxxx
ARCJET_MODE=DRY_RUN

MAX_IMAGE_UPLOAD_BYTES=5242880
JSON_BODY_LIMIT=10mb
```

Important backend variables:

- `MONGODB_URI`: local MongoDB or MongoDB Atlas connection string.
- `JWT_SECRET`: long random secret used to sign auth cookies.
- `CLIENT_URL`: allowed frontend origin for CORS and Socket.IO. Use comma-separated URLs if needed.
- `SERVE_FRONTEND`: keep `false` for backend-only deployments; set `true` only when `frontend/dist/index.html` exists in the backend service.
- `COOKIE_SECURE`: `false` for local HTTP, `true` for HTTPS production.
- `COOKIE_SAME_SITE`: `lax` for same-site usage, `none` for cross-domain frontend/backend cookies.
- `TRUST_PROXY`: set to `1` or `true` on most hosted Node platforms behind a proxy.
- `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_FROM_NAME`: welcome email settings.
- `CLOUDINARY_*`: Cloudinary upload credentials.
- `ARCJET_KEY`, `ARCJET_MODE`: Arcjet protection settings.
- `MAX_IMAGE_UPLOAD_BYTES`: max decoded image payload size.
- `JSON_BODY_LIMIT`: Express JSON body limit. Keep this high enough for base64 image overhead.

### Frontend

Create `frontend/.env` from `frontend/.env.example` only when you need to override defaults.

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_BACKEND_URL=http://localhost:5000
```

For a same-domain production build served by Express, these can be omitted because the frontend defaults to `/api` and `/`.

For split frontend/backend deployment:

```env
VITE_API_BASE_URL=https://your-backend.example.com/api
VITE_BACKEND_URL=https://your-backend.example.com
```

## Local Setup

Install dependencies:

```bash
npm install --prefix backend
npm install --prefix frontend
```

Create env files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Edit the new `.env` files with your local values.

Run backend:

```bash
npm run dev --prefix backend
```

Run frontend:

```bash
npm run dev --prefix frontend
```

Open:

```text
http://localhost:5173
```

## Local MongoDB

Use this backend value if MongoDB is running locally:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/Toki
```

Then start the backend normally.

## MongoDB Atlas

1. Create a MongoDB Atlas cluster.
2. Create a database user.
3. Allow your deployment IP address or local IP address in Network Access.
4. Copy the connection string.
5. Set:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/Toki
```

Do not commit the real connection string.

## Real-Time Socket.IO Flow

1. User logs in or signs up.
2. Backend sets a JWT HTTP-only cookie.
3. Frontend creates a Socket.IO connection with `withCredentials: true`.
4. Socket middleware reads and verifies the JWT cookie.
5. Server maps `userId -> Set<socketId>`.
6. When a message is saved, the backend emits `newMessage` to every socket for the receiver.
7. Frontend updates the active conversation and refreshes chat previews.
8. On disconnect, the server removes only that socket ID, so other tabs stay online.

Deployment note: your hosting platform must support WebSockets. If it does not, real-time chat will not work reliably.

## Auth and Cookies

The app uses a JWT stored in a cookie named `token`.

Local development:

```env
COOKIE_SECURE=false
COOKIE_SAME_SITE=lax
CLIENT_URL=http://localhost:5173
```

Same-domain production, such as one Express service serving both frontend and API:

```env
NODE_ENV=production
COOKIE_SECURE=true
COOKIE_SAME_SITE=lax
CLIENT_URL=https://your-app.example.com
TRUST_PROXY=1
```

Split frontend/backend production, such as Vercel frontend plus Render backend:

```env
NODE_ENV=production
COOKIE_SECURE=true
COOKIE_SAME_SITE=none
CLIENT_URL=https://your-frontend.example.com
TRUST_PROXY=1
```

For cross-domain cookies, both the frontend and backend must be HTTPS, Axios/Socket.IO must send credentials, and CORS must allow the exact frontend origin.

Logout clears the cookie with the same cookie options used by login/signup.

## Cloudinary Image Uploads

Profile images and message images are sent to the backend as image data URLs. The backend validates the image type and size before uploading to Cloudinary.

Supported data URL image types:

- PNG
- JPG/JPEG
- GIF
- WebP

Tune upload size with:

```env
MAX_IMAGE_UPLOAD_BYTES=5242880
JSON_BODY_LIMIT=10mb
```

## Resend Welcome Email

On successful signup, the backend sends a welcome email through Resend. Email delivery is non-blocking: if Resend fails, signup still succeeds and the error is logged.

For production, verify your sender/domain in Resend and set:

```env
RESEND_API_KEY=
EMAIL_FROM=
EMAIL_FROM_NAME=
```

## Arcjet Protection

Arcjet middleware protects auth and message routes. Without `ARCJET_KEY`, the middleware safely no-ops.

Recommended rollout:

```env
ARCJET_MODE=DRY_RUN
```

Use dry run first to observe behavior, then switch to:

```env
ARCJET_MODE=LIVE
```

Arcjet errors fail open so a provider/runtime issue does not take the app offline.

## Verification Commands

Backend syntax/lint check:

```bash
npm run lint --prefix backend
```

Frontend lint:

```bash
npm run lint --prefix frontend
```

Frontend production build:

```bash
npm run build --prefix frontend
```

Root production build:

```bash
npm run build
```

Health check after starting backend:

```text
GET http://localhost:5000/api/health
```

Manual browser verification:

- Sign up or log in.
- Open Contacts.
- Select another user.
- Send a first message.
- Confirm the chat appears in Chats.
- Confirm real-time receive works in another browser or incognito window.
- Refresh and confirm auth, chats, and messages reload.

## Production Build

Build the frontend:

```bash
npm run build --prefix frontend
```

The backend runs in API-only mode by default, even when `NODE_ENV=production`.

To serve the frontend from the backend in a single-service deployment, build the frontend and set:

```env
NODE_ENV=production
SERVE_FRONTEND=true
```

If `SERVE_FRONTEND=true` but `frontend/dist/index.html` is missing, the backend logs a warning and stays in API-only mode instead of throwing an `ENOENT` error.

Root build installs backend/frontend dependencies and builds the frontend:

```bash
npm run build
```

Start production backend:

```bash
npm start
```

## Deployment Guide

### Option A: Single Full-Stack Service

Good for Render, Railway, Fly.io, or similar platforms that can run a Node server and support WebSockets.

Build command:

```bash
npm run build
```

Start command:

```bash
npm start
```

Important env:

```env
NODE_ENV=production
PORT=<provided-by-platform>
TRUST_PROXY=1
CLIENT_URL=https://your-app.example.com
SERVE_FRONTEND=true
COOKIE_SECURE=true
COOKIE_SAME_SITE=lax
VITE_API_BASE_URL=
VITE_BACKEND_URL=
```

In this setup, Express serves the frontend and API from the same domain.

### Option B: Vercel Frontend and Separate Backend

Use this when the React frontend is deployed separately from the Express backend, such as Vercel frontend plus Render backend.

Render backend service example:

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- WebSocket support: required

Backend env:

```env
NODE_ENV=production
TRUST_PROXY=1
CLIENT_URL=https://your-frontend.vercel.app
SERVE_FRONTEND=false
COOKIE_SECURE=true
COOKIE_SAME_SITE=none
```

Frontend env:

```env
VITE_API_BASE_URL=https://your-backend.example.com/api
VITE_BACKEND_URL=https://your-backend.example.com
```

Requirements:

- Backend must use HTTPS.
- Backend CORS must allow the exact frontend URL.
- Backend should keep `SERVE_FRONTEND=false` because `frontend/dist` is not present in a backend-only service.
- Frontend requests must include credentials.
- Backend host must support WebSockets.
- Cookies may be affected by browser third-party cookie restrictions if frontend/backend are on unrelated domains.

### MongoDB Atlas

- Create a production cluster.
- Use a strong database password.
- Restrict Network Access where practical.
- Store `MONGODB_URI` as a platform secret.

### Cloudinary

- Use production Cloudinary credentials.
- Keep API secret server-side only.
- Confirm upload limits match your plan and app needs.

### Resend

- Verify a sender/domain.
- Use the verified sender in `EMAIL_FROM`.
- Keep the API key server-side only.

### Arcjet

- Start with `ARCJET_MODE=DRY_RUN`.
- Review Arcjet decisions/logs.
- Switch to `ARCJET_MODE=LIVE` after tuning.

## Troubleshooting

Cookie not set:

- Confirm backend is HTTPS in production.
- Confirm `COOKIE_SECURE=true` only on HTTPS.
- For cross-domain deployment, use `COOKIE_SAME_SITE=none`.
- Confirm frontend requests use credentials.

CORS error:

- Set `CLIENT_URL` to the exact frontend origin, including protocol.
- Do not include a trailing path.
- For multiple origins, use comma-separated values.

Socket not connecting:

- Confirm `VITE_BACKEND_URL` points to the backend origin.
- Confirm backend supports WebSockets.
- Confirm cookie auth works before socket connection.
- Check that the backend allows the frontend origin.

Images fail to upload:

- Confirm Cloudinary env vars are set.
- Confirm image type is PNG, JPG/JPEG, GIF, or WebP.
- Increase `JSON_BODY_LIMIT` if large base64 payloads are blocked.

Welcome email not sent:

- Confirm Resend API key and verified sender.
- Check backend logs.
- Signup can still succeed if email delivery fails.

Arcjet blocks or logs unexpected decisions:

- Use `ARCJET_MODE=DRY_RUN` while tuning.
- Confirm `TRUST_PROXY` is set correctly on the host.
- Check Arcjet dashboard/logs.

## Known Remaining Limitations

- No unread counts or read receipts yet.
- No typing indicators.
- No message deletion or editing.
- Frontend bundle currently has a large chunk warning.
- Browser-level deployment verification should be done after choosing a hosting platform.

## Future Improvements

- Add message pagination for long conversations.
- Add typing indicators and read receipts.
- Add upload progress for images.
- Split frontend chunks to reduce bundle size.
- Add CI for lint, build, and audit checks.
