# Backend Directory Structure

The `server` directory is highly organized to promote scalability.

## File Tree

```text
server/
├── config/
│   └── db.js              # Database connection logic
├── controllers/
│   ├── authController.js  # Registration, Login
│   ├── rideController.js  # Booking, Completing rides
│   └── driverController.js# Location updates, stats
├── middleware/
│   ├── auth.js            # JWT verification and RBAC
│   └── errorHandler.js    # Global error catching
├── models/
│   ├── User.js            # Mongoose Schemas
│   ├── Ride.js
│   └── Driver.js
├── routes/
│   ├── authRoutes.js      # Express Routers
│   ├── rideRoutes.js
│   └── driverRoutes.js
├── socket/
│   └── socketHandler.js   # WebSocket event listeners
├── utils/
│   ├── generateToken.js   # JWT generation
│   └── fareCalculator.js  # Distance/Time pricing math
├── .env                   # Secrets (Not committed to Git)
└── server.js              # Application entry point
```
