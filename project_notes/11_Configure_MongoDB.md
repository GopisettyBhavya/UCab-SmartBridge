# Database Configuration

The application uses **MongoDB Atlas**, a fully managed cloud database service.

## Configuration Steps
1. A Cluster was provisioned on MongoDB Atlas.
2. A database user was created with a secure password.
3. Network access was configured to allow connections.
4. The Connection String URI was copied into the server's `.env` file as `MONGO_URI`.

## Connection Logic (config/db.js)
Mongoose is used to establish the connection asynchronously.

```javascript
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
```
