# Client Setup

The frontend was scaffolded using Vite for extremely fast Hot Module Replacement (HMR) and modern build tooling.

## Setup Commands
```bash
cd client
npm create vite@latest . -- --template react
npm install
```

## Key Dependencies Installed
- `react-router-dom`: For handling multi-page navigation (Login, Dashboard, Ride Tracking).
- `react-leaflet` & `leaflet`: For rendering the interactive map and markers.
- `socket.io-client`: For connecting to the backend WebSocket server.
- `axios`: For making HTTP requests to the REST API.
- `react-icons`: For SVG iconography.
