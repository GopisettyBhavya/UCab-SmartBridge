# Frontend Directory Structure

The `client` directory follows a feature-based and component-based layout.

## File Tree

```text
client/
├── src/
│   ├── components/
│   │   ├── MapView.jsx      # Reusable Leaflet map component
│   │   ├── Navbar.jsx       # Top navigation bar
│   │   └── ProtectedRoute.jsx# Router guard for authenticated pages
│   ├── context/
│   │   ├── AuthContext.jsx  # React Context for global user state
│   │   └── SocketContext.jsx# React Context for WebSocket instance
│   ├── pages/
│   │   ├── Login.jsx        # Authentication screens
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx    # User landing page
│   │   ├── BookRide.jsx     # Ride booking form
│   │   ├── RideTracking.jsx # Live tracking screen
│   │   ├── DriverDashboard.jsx # Driver landing page
│   │   └── DriverRideView.jsx  # Driver active ride execution
│   ├── services/
│   │   ├── api.js           # Axios interceptors and endpoints
│   │   └── socket.js        # Socket.io connection logic
│   ├── index.css            # Global CSS variables and glassmorphism styling
│   └── main.jsx             # React entry point
```
