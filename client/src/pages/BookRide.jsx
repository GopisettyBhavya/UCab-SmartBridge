import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiMapPin, FiNavigation, FiCheckCircle, FiX } from 'react-icons/fi';
import MapView from '../components/MapView';
import VehicleSelector from '../components/VehicleSelector';
import FareEstimate from '../components/FareEstimate';
import { rideService, driverService } from '../services/api';

/* ── Nominatim autocomplete search ─────────────────────────── */
const searchPlaces = async (query) => {
  if (!query || query.length < 3) return [];
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    return data.map((item) => ({
      label: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
    }));
  } catch {
    return [];
  }
};

/* ── Reverse geocode coords → address string ────────────────── */
const reverseGeocode = async (lat, lng) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`
    );
    const data = await res.json();
    if (data?.display_name) {
      // Shorten: first two comma-separated parts
      return data.display_name.split(',').slice(0, 2).join(',').trim();
    }
  } catch {}
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
};

/* ── Haversine distance (km) ────────────────────────────────── */
const getDistance = (p1, p2) => {
  const R = 6371;
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/* ── LocationInput component ────────────────────────────────── */
const LocationInput = ({ placeholder, value, onChange, onSelect, onClear, dotClass }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val);
    clearTimeout(debounceRef.current);
    if (val.length < 3) { setSuggestions([]); setOpen(false); return; }
    setSearching(true);
    debounceRef.current = setTimeout(async () => {
      const results = await searchPlaces(val);
      setSuggestions(results);
      setOpen(results.length > 0);
      setSearching(false);
    }, 400);
  };

  const handleSelect = (item) => {
    onChange(item.label.split(',').slice(0, 2).join(',').trim());
    onSelect({ lat: item.lat, lng: item.lng });
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div className={`location-dot ${dotClass}`} style={{ flexShrink: 0 }} />
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            className="form-input"
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            style={{ paddingRight: value ? '2.5rem' : '1rem' }}
            autoComplete="off"
          />
          {searching && (
            <div className="spinner spinner-sm" style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
          )}
          {value && !searching && (
            <button
              onClick={() => { onChange(''); onClear(); setSuggestions([]); setOpen(false); }}
              style={{ position: 'absolute', right: '0.5rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}
            >
              <FiX size={14} />
            </button>
          )}
        </div>
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 9999,
          background: 'var(--bg-surface)', border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)', marginTop: '4px',
          boxShadow: 'var(--shadow-lg)', overflow: 'hidden',
        }}>
          {suggestions.map((item, i) => (
            <div
              key={i}
              onClick={() => handleSelect(item)}
              style={{
                padding: '0.75rem 1rem', cursor: 'pointer',
                borderBottom: i < suggestions.length - 1 ? '1px solid var(--glass-border)' : 'none',
                fontSize: '0.875rem', color: 'var(--text-secondary)',
                display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <FiMapPin size={14} style={{ color: 'var(--primary)', marginTop: '2px', flexShrink: 0 }} />
              <span style={{ lineHeight: 1.4 }}>
                <strong style={{ color: 'var(--text-primary)', display: 'block', fontSize: '0.9rem' }}>
                  {item.label.split(',')[0]}
                </strong>
                {item.label.split(',').slice(1, 3).join(',').trim()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Main BookRide page ─────────────────────────────────────── */
const BookRide = () => {
  const navigate = useNavigate();
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [vehicleType, setVehicleType] = useState(null);
  const [fareEstimate, setFareEstimate] = useState(null);
  const [fareEstimates, setFareEstimates] = useState(null);
  const [nearbyDrivers, setNearbyDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [clickMode, setClickMode] = useState('pickup');
  const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]); // Bengaluru default

  /* Fetch nearby drivers when pickup changes */
  useEffect(() => {
    if (!pickup) return;
    driverService.getNearby(pickup.lat, pickup.lng, 5000)
      .then(res => {
        const drivers = res.data?.data || res.data?.drivers || res.data || [];
        const normalised = Array.isArray(drivers) ? drivers.map(d => ({
          ...d,
          lat: d.lat ?? d.currentLocation?.coordinates?.[1],
          lng: d.lng ?? d.currentLocation?.coordinates?.[0],
        })).filter(d => d.lat != null && d.lng != null) : [];
        setNearbyDrivers(normalised);
      })
      .catch(() => setNearbyDrivers([]));
  }, [pickup]);

  /* Recalculate fare estimate when both locations are set */
  useEffect(() => {
    if (!pickup || !dropoff) return;
    const distance = getDistance(pickup, dropoff);
    setFareEstimates({
      auto: Math.round(30 + distance * 12),
      bike: Math.round(20 + distance * 8),
      sedan: Math.round(50 + distance * 15),
      suv: Math.round(80 + distance * 20),
    });
  }, [pickup, dropoff]);

  useEffect(() => {
    if (!pickup || !dropoff || !vehicleType || !fareEstimates) return;
    const distance = getDistance(pickup, dropoff);
    const ratePerKm = { bike: 8, auto: 12, sedan: 15, suv: 20 }[vehicleType];
    const base = { bike: 20, auto: 30, sedan: 50, suv: 80 }[vehicleType];
    setFareEstimate({
      baseFare: base,
      distanceFare: Math.round(distance * ratePerKm),
      timeFare: Math.round(distance * 2),
      surgeFare: 0,
      discount: 0,
      totalFare: fareEstimates[vehicleType],
    });
  }, [vehicleType, fareEstimates]);

  /* Map click handler */
  const handleMapClick = async ({ lat, lng }) => {
    const addr = await reverseGeocode(lat, lng);
    if (clickMode === 'pickup') {
      setPickup({ lat, lng });
      setPickupAddress(addr);
      setMapCenter([lat, lng]);
      setClickMode('dropoff');
    } else {
      setDropoff({ lat, lng });
      setDropoffAddress(addr);
      setMapCenter([lat, lng]);
      setClickMode('pickup');
    }
  };

  /* Use browser geolocation for pickup */
  const useMyLocation = () => {
    if (!navigator.geolocation) { alert('Geolocation not supported'); return; }
    setPickupAddress('Detecting location…');
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude: lat, longitude: lng } }) => {
        const addr = await reverseGeocode(lat, lng);
        setPickup({ lat, lng });
        setPickupAddress(addr);
        setMapCenter([lat, lng]);
        setClickMode('dropoff');
      },
      () => {
        setPickupAddress('');
        alert('Could not get location. Please type your pickup address or click the map.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  /* Book ride */
  const handleBook = async () => {
    if (!pickup || !dropoff || !vehicleType) return;
    setLoading(true);
    try {
      const res = await rideService.create({
        pickupCoordinates: [pickup.lng, pickup.lat],
        pickupAddress,
        dropoffCoordinates: [dropoff.lng, dropoff.lat],
        dropoffAddress,
        vehicleType,
      });
      setBookingSuccess(res.data?.data || res.data?.ride || res.data);
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /* ── Booking success screen ── */
  if (bookingSuccess) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '70px' }}>
        <div className="glass-card animate-slide-up" style={{ maxWidth: '450px', textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ fontFamily: 'Outfit', marginBottom: '0.5rem' }}>Ride Booked!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Finding a driver for you now.
          </p>
          {bookingSuccess.otp && (
            <div className="otp-display">
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Your OTP</div>
              <div className="otp-code">{bookingSuccess.otp}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Share with your driver</div>
            </div>
          )}
          <button className="btn btn-primary btn-lg w-full mt-3" onClick={() => navigate(`/ride/${bookingSuccess._id}`)}>
            Track Your Ride
          </button>
        </div>
      </div>
    );
  }

  /* ── Main booking UI ── */
  return (
    <div className="booking-container">
      {/* ── Left panel ── */}
      <div className="booking-form">
        <h2 style={{ fontFamily: 'Outfit', marginBottom: '1.5rem' }}>Book a Ride</h2>

        {/* Pickup */}
        <LocationInput
          placeholder="Enter pickup location…"
          value={pickupAddress}
          onChange={setPickupAddress}
          onSelect={(coords) => { setPickup(coords); setMapCenter([coords.lat, coords.lng]); setClickMode('dropoff'); }}
          onClear={() => { setPickup(null); setFareEstimates(null); setFareEstimate(null); setVehicleType(null); }}
          dotClass="pickup"
        />

        <div style={{ marginLeft: '5px', margin: '0.4rem 0' }}>
          <div className="location-line" />
        </div>

        {/* Dropoff */}
        <LocationInput
          placeholder="Enter dropoff location…"
          value={dropoffAddress}
          onChange={setDropoffAddress}
          onSelect={(coords) => { setDropoff(coords); setMapCenter([coords.lat, coords.lng]); setClickMode('pickup'); }}
          onClear={() => { setDropoff(null); setFareEstimates(null); setFareEstimate(null); setVehicleType(null); }}
          dotClass="dropoff"
        />

        {/* Helper actions */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-secondary btn-sm" onClick={useMyLocation}>
            <FiNavigation size={14} /> Use My Location
          </button>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem', alignSelf: 'center' }}>
            or click the map to set <strong style={{ color: 'var(--text-secondary)' }}>{clickMode}</strong>
          </span>
        </div>

        {/* Status indicators */}
        {(pickup || dropoff) && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius: '50px', background: pickup ? 'rgba(0,230,118,0.15)' : 'rgba(255,255,255,0.05)', color: pickup ? 'var(--success)' : 'var(--text-muted)', border: `1px solid ${pickup ? 'rgba(0,230,118,0.3)' : 'var(--glass-border)'}` }}>
              {pickup ? '✓ Pickup set' : '○ Pickup not set'}
            </span>
            <span style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem', borderRadius: '50px', background: dropoff ? 'rgba(0,230,118,0.15)' : 'rgba(255,255,255,0.05)', color: dropoff ? 'var(--success)' : 'var(--text-muted)', border: `1px solid ${dropoff ? 'rgba(0,230,118,0.3)' : 'var(--glass-border)'}` }}>
              {dropoff ? '✓ Dropoff set' : '○ Dropoff not set'}
            </span>
          </div>
        )}

        {/* Vehicle selector */}
        {pickup && dropoff && (
          <VehicleSelector
            selectedType={vehicleType}
            onSelect={setVehicleType}
            fareEstimates={fareEstimates}
          />
        )}

        {/* Fare estimate */}
        {fareEstimate && <FareEstimate fare={fareEstimate} />}

        {/* Book button */}
        {pickup && dropoff && vehicleType && (
          <button className="btn btn-primary btn-lg w-full mt-3" onClick={handleBook} disabled={loading}>
            {loading
              ? <><div className="spinner spinner-sm" /> Booking…</>
              : <><FiCheckCircle size={18} /> Book Now</>}
          </button>
        )}
      </div>

      {/* ── Map ── */}
      <div className="booking-map">
        <MapView
          center={mapCenter}
          pickupLocation={pickup}
          dropoffLocation={dropoff}
          onMapClick={handleMapClick}
          nearbyDrivers={nearbyDrivers}
          height="100%"
          interactive={true}
        />
      </div>
    </div>
  );
};

export default BookRide;
