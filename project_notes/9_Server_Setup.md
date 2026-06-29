# Server Setup

The backend is a Node.js environment utilizing the Express.js web framework.

## Setup Commands
```bash
cd server
npm init -y
```

## Key Dependencies Installed
- `express`: The core web server framework.
- `mongoose`: Object Data Modeling (ODM) library for MongoDB.
- `jsonwebtoken` & `bcryptjs`: For secure password hashing and stateless JWT authentication.
- `socket.io`: For the WebSocket server.
- `cors` & `dotenv`: For cross-origin resource sharing and environment variable management.
