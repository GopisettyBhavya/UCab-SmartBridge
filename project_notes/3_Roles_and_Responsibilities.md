# Roles and Responsibilities

The system defines strict Authorization barriers using JSON Web Tokens (JWT) and Role-Based Access Control (RBAC).

## Passenger (User)
- **Account Management:** Can create an account, log in, and manage their profile.
- **Booking:** Can view nearby drivers on a map, get fare estimates, and request rides.
- **Tracking:** Real-time map tracking of the assigned driver.
- **Post-Ride:** Can make payments and rate drivers.

## Driver
- **Availability:** Can toggle their status to Online/Offline to receive ride requests.
- **Location Broadcasting:** Automatically shares their live GPS coordinates with the server while online.
- **Ride Execution:** Receives incoming requests, accepts them, verifies the passenger's OTP, and marks the ride as completed.
- **Earnings:** Tracks completed rides and total revenue generated.

## Admin
- **Moderation:** Views all system users and rides.
- **Verification:** Approves driver accounts and verifies their license details before they can accept rides.
