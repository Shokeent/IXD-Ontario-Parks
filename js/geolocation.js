// Geolocation & Proximity Manager
// Find nearby parks, calculate distances, estimate travel times

class GeolocationManager {
    constructor() {
        this.currentLocation = null;
        this.parks = this.loadParks();
        this.nearbyParks = [];
        this.watchId = null;
        this.permissionDenied = false;
    }

    // Get user's current location
    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                position => {
                    this.currentLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: new Date().toISOString()
                    };
                    localStorage.setItem('user-location', JSON.stringify(this.currentLocation));
                    resolve(this.currentLocation);
                },
                error => {
                    this.permissionDenied = true;
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    }

    // Watch user location changes
    watchLocation(callback) {
        if (!navigator.geolocation) return null;

        this.watchId = navigator.geolocation.watchPosition(
            position => {
                this.currentLocation = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: new Date().toISOString()
                };
                localStorage.setItem('user-location', JSON.stringify(this.currentLocation));

                if (callback) {
                    callback(this.currentLocation);
                }
            },
            error => {
                console.error('Location watch error:', error);
            },
            { enableHighAccuracy: true, timeout: 30000, maximumAge: 5000 }
        );

        return this.watchId;
    }

    // Stop watching location
    stopWatchingLocation() {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }

    // Calculate distance between two coordinates (Haversine formula)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return Math.round(distance * 10) / 10; // Round to 1 decimal place
    }

    // Find nearby parks
    findNearbyParks(radiusKm = 50) {
        if (!this.currentLocation) {
            return [];
        }

        const { latitude, longitude } = this.currentLocation;

        this.nearbyParks = this.parks
            .map(park => ({
                ...park,
                distance: this.calculateDistance(
                    latitude,
                    longitude,
                    park.latitude,
                    park.longitude
                ),
                travelTime: this.estimateTravelTime(
                    latitude,
                    longitude,
                    park.latitude,
                    park.longitude
                )
            }))
            .filter(park => park.distance <= radiusKm)
            .sort((a, b) => a.distance - b.distance);

        return this.nearbyParks;
    }

    // Estimate travel time (simple calculation: assumes 80km/h avg speed)
    estimateTravelTime(lat1, lon1, lat2, lon2) {
        const distance = this.calculateDistance(lat1, lon1, lat2, lon2);
        const averageSpeed = 80; // km/h
        const hours = distance / averageSpeed;
        const minutes = Math.round(hours * 60);

        if (minutes < 60) {
            return `${minutes} min`;
        } else {
            const h = Math.floor(minutes / 60);
            const m = minutes % 60;
            return `${h}h ${m}m`;
        }
    }

    // Get parks within radius
    getParksWithinRadius(radiusKm = 50) {
        return this.findNearbyParks(radiusKm);
    }

    // Get closest park
    getClosestPark() {
        const nearby = this.findNearbyParks();
        return nearby.length > 0 ? nearby[0] : null;
    }

    // Get parks by proximity level
    getParksByProximityLevel() {
        if (!this.currentLocation) return {};

        const nearby = this.findNearbyParks();

        return {
            veryClose: nearby.filter(p => p.distance <= 10),
            close: nearby.filter(p => p.distance > 10 && p.distance <= 30),
            moderate: nearby.filter(p => p.distance > 30 && p.distance <= 50),
            nearby: nearby
        };
    }

    // Calculate bearing between two points
    calculateBearing(lat1, lon1, lat2, lon2) {
        const y = Math.sin((lon2 - lon1) * Math.PI / 180) *
                  Math.cos(lat2 * Math.PI / 180);
        const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
                  Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.cos((lon2 - lon1) * Math.PI / 180);

        const bearing = Math.atan2(y, x) * 180 / Math.PI;
        return (bearing + 360) % 360;
    }

    // Get direction name from bearing
    getDirectionName(bearing) {
        const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                          'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
        const index = Math.round(bearing / 22.5) % 16;
        return directions[index];
    }

    // Load parks with coordinates
    loadParks() {
        const parksData = [
            { id: 'algonquin-park', name: 'Algonquin Provincial Park', latitude: 45.3170, longitude: -78.0850 },
            { id: 'killarney-park', name: 'Killarney Provincial Park', latitude: 46.0500, longitude: -81.1000 },
            { id: 'bon-echo-park', name: 'Bon Echo Provincial Park', latitude: 44.8739, longitude: -77.3297 },
            { id: 'sandbanks-park', name: 'Sandbanks Provincial Park', latitude: 44.0500, longitude: -77.3000 },
            { id: 'pinery-park', name: 'Pinery Provincial Park', latitude: 43.8500, longitude: -81.8000 },
            { id: 'point-pelee-park', name: 'Point Pelee Provincial Park', latitude: 41.9500, longitude: -82.5500 },
            { id: 'kawartha-park', name: 'Kawartha Highlands Wilderness Park', latitude: 45.3800, longitude: -78.7500 },
            { id: 'muskoka-park', name: 'Muskoka Provincial Park', latitude: 45.1500, longitude: -79.5000 },
            { id: 'temagami-park', name: 'Temagami Provincial Park', latitude: 46.9500, longitude: -80.8000 }
        ];

        return parksData;
    }

    // Request location permission
    async requestLocationPermission() {
        try {
            const location = await this.getCurrentLocation();
            return { granted: true, location };
        } catch (error) {
            return { granted: false, error: error.message };
        }
    }

    // Check if location permission granted
    hasLocationPermission() {
        return this.currentLocation !== null;
    }

    // Get stored location
    getStoredLocation() {
        const stored = localStorage.getItem('user-location');
        if (stored) {
            this.currentLocation = JSON.parse(stored);
            return this.currentLocation;
        }
        return null;
    }

    // Clear stored location
    clearStoredLocation() {
        localStorage.removeItem('user-location');
        this.currentLocation = null;
    }

    // Get location stats
    getLocationStats() {
        return {
            currentLocation: this.currentLocation,
            nearbyParksCount: this.nearbyParks.length,
            closestPark: this.getClosestPark(),
            permissionDenied: this.permissionDenied
        };
    }

    // Render nearby parks list
    renderNearbyParks(containerId = 'nearby-parks', radiusKm = 50) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const parks = this.findNearbyParks(radiusKm);

        if (parks.length === 0) {
            container.innerHTML = '<p class="no-results">No parks found nearby</p>';
            return;
        }

        let html = '<div class="nearby-parks-list">';

        parks.forEach(park => {
            const direction = this.getDirectionName(
                this.calculateBearing(
                    this.currentLocation.latitude,
                    this.currentLocation.longitude,
                    park.latitude,
                    park.longitude
                )
            );

            html += `
                <div class="park-card nearby-park" data-park-id="${park.id}">
                    <div class="park-distance-badge">
                        <span class="distance">${park.distance} km</span>
                        <span class="direction">${direction}</span>
                    </div>
                    <div class="park-info">
                        <h3>${park.name}</h3>
                        <div class="park-meta">
                            <span class="travel-time">📍 ${park.travelTime}</span>
                        </div>
                    </div>
                    <button class="btn-primary" onclick="navigateToParkDetails('${park.id}')">
                        View Details
                    </button>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;

        if (window.gaManager) {
            window.gaManager.trackEvent('view_nearby_parks', {
                parks_found: parks.length,
                radius_km: radiusKm
            });
        }
    }

    // Track location changes for analytics
    trackLocationChanges(callback) {
        this.watchLocation((location) => {
            if (window.gaManager) {
                window.gaManager.trackEvent('location_updated', {
                    latitude: Math.round(location.latitude * 100) / 100,
                    longitude: Math.round(location.longitude * 100) / 100,
                    accuracy: Math.round(location.accuracy)
                });
            }

            if (callback) {
                callback(location);
            }
        });
    }

    // Create geofence alert
    createGeofenceAlert(parkId, radiusMeters = 1000, callback) {
        const park = this.parks.find(p => p.id === parkId);
        if (!park) return null;

        this.watchLocation((location) => {
            const distance = this.calculateDistance(
                location.latitude,
                location.longitude,
                park.latitude,
                park.longitude
            ) * 1000; // Convert to meters

            if (distance < radiusMeters) {
                callback({
                    park,
                    distance,
                    entered: true
                });
            }
        });
    }

    // Export location history
    exportLocationHistory() {
        const stored = localStorage.getItem('user-location');
        return stored ? JSON.parse(stored) : null;
    }
}

const geolocationManager = new GeolocationManager();
