# Real-Time Development Architecture

The most complex feature of the application is the real-time interaction between Passengers and Drivers. This is achieved using WebSockets.

## How it works
1. **Connection:** When a user logs in, the `SocketContext` establishes a persistent connection to the server.
2. **Rooms:** When a ride is booked, both the Driver and Passenger emit a `join-ride` event to subscribe to a specific "Room" identified by the Ride ID.
3. **Broadcasting:** When the Driver's phone detects a GPS location change, it emits `update-location` to the server.
4. **Relay:** The server instantly relays this location data exclusively to the Passenger's Room, updating their map without requiring a page refresh or HTTP polling.
