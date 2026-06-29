# Database Schemas

Schemas define the structure, validation rules, and default values for documents stored in MongoDB.

## Geospatial Indexing
The Driver model utilizes a special GeoJSON schema structure and a `2dsphere` index to allow for advanced spatial queries (finding drivers near a passenger).

```javascript
const driverSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  vehicleType: { type: String, enum: ['auto', 'bike', 'sedan', 'suv'] },
  currentLocation: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  }
});

// Create 2dsphere index for location-based queries
driverSchema.index({ currentLocation: '2dsphere' });
```
