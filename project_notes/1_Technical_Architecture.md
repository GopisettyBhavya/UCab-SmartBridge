# Technical Architecture

The Ucab application follows a traditional Client-Server architecture utilizing the **MERN Stack** (MongoDB, Express, React, Node.js) with WebSockets for real-time bidirectional communication.

## Key Components
- **Client Application:** A React SPA (Single Page Application) built with Vite, responsible for rendering the UI and maintaining user state.
- **REST API Server:** An Express.js application handling authentication, data processing, and business logic.
- **Database:** MongoDB NoSQL database to store dynamic JSON-like document data for users, drivers, and rides.
- **WebSocket Server:** A Socket.IO server integrated with Node.js to push live location updates and ride status changes instantly to clients.

## Architecture Diagram

<img width="1500" height="857" alt="image" src="https://github.com/user-attachments/assets/7684ffe4-e745-458c-9f8c-768dfe22383d" />
