# 🚗 UCAB — You Cab

A full-stack cab booking platform built with the **MERN stack**. UCAB connects passengers, drivers, and admins in one unified system with real-time ride tracking, JWT authentication, and role-based dashboards.

---

## ✨ Features

### Passenger
- Register and log in securely with JWT authentication
- Book rides with live address autocomplete (OpenStreetMap / Nominatim)
- Real-time fare estimation based on distance and vehicle type
- Live ride tracking with driver location updates via Socket.IO
- OTP-based ride verification for safety
- View booking history with status filters
- Rate completed rides and process payments
- Wallet top-up support

### Driver
- Register with vehicle details (type, number, color, license)
- Toggle online/offline availability
- Receive live ride requests via Socket.IO (no page refresh)
- Accept or reject incoming rides
- Verify passenger OTP before starting the ride
- Complete rides and track daily/total earnings

### Admin
- Overview dashboard — users, drivers, active rides, total revenue
- Verify or reject driver applications
- Browse all users, drivers, and rides
- Filter rides by status

### General
- Help & Support page with FAQ accordion and contact form
- Fully responsive dark glassmorphism UI
- Protected routes with role-based access control

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Real-time | Socket.IO |
| Auth | JWT (jsonwebtoken), bcryptjs |
| Maps | Leaflet, React-Leaflet, OpenStreetMap |
| Geocoding | Nominatim (free, no API key needed) |
| Styling | Custom CSS — dark glassmorphism design system |

---

## 🏗 Architecture

UCAB follows the **MVC pattern** with a decoupled frontend:

```
client/                        ← View (React)
└── src/
    ├── pages/                 ← Route-level screens
    ├── components/            ← Reusable UI components
    ├── context/               ← AuthContext, SocketContext
    └── services/api.js        ← Centralised Axios API layer

server/                        ← Model + Controller (Express)
├── models/                    ← Mongoose schemas (M)
├── controllers/               ← Business logic (C)
├── routes/                    ← URL → Controller mapping
├── middleware/                ← JWT auth, error handler
├── socket/                    ← Socket.IO real-time events
└── config/                    ← MongoDB connection
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas account

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ucab.git
cd ucab
```

### 2. Install dependencies
```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 3. Configure environment variables
Create a `.env` file inside the `server/` folder:
```env
MONGO_URI=mongodb://localhost:27017/ucab
JWT_SECRET=your_secret_key_here
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 4. Run the application
Open two terminals:

**Terminal 1 — Backend**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend**
```bash
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 👥 User Roles

| Role | Access |
|---|---|
| `user` | Book rides, track rides, view history, profile |
| `driver` | Receive requests, manage rides, view earnings |
| `admin` | Full platform oversight, driver verification |

Register normally to get `user` or `driver` role. To create an admin account, run:
```bash
cd server
node -e "const mongoose=require('mongoose');const bcrypt=require('bcryptjs');require('dotenv').config();mongoose.connect(process.env.MONGO_URI).then(async()=>{const User=require('./models/User');const salt=await bcrypt.genSalt(10);const hash=await bcrypt.hash('admin123',salt);await User.create({name:'Admin',email:'admin@ucab.com',password:hash,phone:'9999999999',role:'admin'});console.log('Admin created');process.exit();})"
```
Login with `admin@ucab.com` / `admin123`.

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user or driver |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/change-password` | Change password |
| POST | `/api/rides/book` | Book a new ride |
| GET | `/api/rides/history` | Get ride history |
| GET | `/api/rides/:id` | Get single ride |
| PUT | `/api/rides/:id/accept` | Driver accepts ride |
| PUT | `/api/rides/:id/start` | Verify OTP and start ride |
| PUT | `/api/rides/:id/complete` | Complete ride |
| PUT | `/api/rides/:id/cancel` | Cancel ride |
| PUT | `/api/rides/:id/rate` | Rate a completed ride |
| GET | `/api/drivers/nearby` | Get nearby available drivers |
| GET | `/api/drivers/stats` | Driver earnings and stats |
| PUT | `/api/drivers/availability` | Toggle driver availability |
| GET | `/api/admin/stats` | Platform statistics |
| GET | `/api/admin/users` | All users |
| GET | `/api/admin/drivers` | All drivers |
| PUT | `/api/admin/drivers/:id/verify` | Verify or reject driver |

---

## 🔌 Real-time Events (Socket.IO)

| Event | Direction | Description |
|---|---|---|
| `new-ride-request` | Server → Driver | New ride booked by passenger |
| `request-removed` | Server → Driver | Ride was accepted by another driver |
| `ride-status-changed` | Server → Passenger | Status update (accepted, in-progress, completed) |
| `ride-updated` | Server → Passenger | Full ride object update |
| `driver-location` | Server → Passenger | Driver location coordinates |
| `join-ride` | Client → Server | Join a ride room for updates |
| `update-location` | Driver → Server | Broadcast driver location |

---

## 📸 Screenshots

| Landing | Dashboard | Book a Ride |
|---|---|---|
| ![Landing](demo_screenshoots/Screenshot%202026-06-29%20151309.png) | ![Dashboard](demo_screenshoots/Screenshot%202026-06-29%20151635.png) | ![Book](demo_screenshoots/Screenshot%202026-06-29%20151922.png) |

---
## Team Members

Johny H
Gopisetty Bhavya
Deepak Cheruku
Harshitha Nallappagari
Gomithra Ekambaram

## 📄 License

This project is for educational purposes.
