/**
 * Socket.IO event handler for real-time ride updates
 */
const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    /**
     * Join a ride room to receive real-time updates
     */
    socket.on('join-ride', (rideId) => {
      socket.join(rideId);
      console.log(`Socket ${socket.id} joined ride room: ${rideId}`);
    });

    /**
     * Leave a ride room
     */
    socket.on('leave-ride', (rideId) => {
      socket.leave(rideId);
      console.log(`Socket ${socket.id} left ride room: ${rideId}`);
    });

    /**
     * Handle driver location updates.
     * Broadcasts as 'driver-location' so RideTracking.jsx receives it correctly.
     * @param {object} data - { rideId, latitude, longitude }
     */
    socket.on('update-location', (data) => {
      const { rideId, latitude, longitude } = data;
      // Emit to ride room so the tracking page receives the update
      socket.to(rideId).emit('driver-location', {
        lat: latitude,
        lng: longitude,
        timestamp: new Date(),
      });
    });

    /**
     * Handle ride status changes
     */
    socket.on('ride-status-change', (data) => {
      const { rideId, status, message } = data;
      socket.to(rideId).emit('ride-status-changed', {
        status,
        message,
        timestamp: new Date(),
      });
    });

    /**
     * Handle client disconnect
     */
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = setupSocket;
