// Offline Maps & Navigation Manager
// Downloadable park maps, trail navigation, waypoints

class OfflineMapsManager {
    constructor() {
        this.downloadedMaps = JSON.parse(localStorage.getItem('downloaded-maps') || '[]');
        this.waypoints = JSON.parse(localStorage.getItem('waypoints') || '[]');
        this.routes = JSON.parse(localStorage.getItem('saved-routes') || '[]');
        this.mapData = this.loadMapData();
    }

    loadMapData() {
        return {
            'algonquin-park': {
                name: 'Algonquin Provincial Park',
                center: { lat: 45.3170, lng: -78.0850 },
                zoom: 11,
                bounds: { north: 45.80, south: 44.85, east: -77.35, west: -78.80 },
                size: '24MB',
                lastUpdated: '2026-04-01',
                trails: [
                    { id: 'algo-1', name: 'Lake of Two Rivers', coordinates: [{ lat: 45.51, lng: -78.35 }, { lat: 45.52, lng: -78.34 }], color: '#4CAF50' },
                    { id: 'algo-2', name: 'Barron Canyon Trail', coordinates: [{ lat: 45.65, lng: -77.70 }, { lat: 45.67, lng: -77.68 }], color: '#FF9800' }
                ],
                pointsOfInterest: [
                    { id: 'poi-1', name: 'Visitor Centre', type: 'information', lat: 45.5153, lng: -78.3536, icon: 'ℹ️' },
                    { id: 'poi-2', name: 'Lake of Two Rivers Campground', type: 'camping', lat: 45.5120, lng: -78.3550, icon: '⛺' },
                    { id: 'poi-3', name: 'Canoe Lake', type: 'water', lat: 45.5420, lng: -78.4840, icon: '🚣' },
                    { id: 'poi-4', name: 'Mew Lake Campground', type: 'camping', lat: 45.5040, lng: -78.3190, icon: '⛺' }
                ]
            },
            'killarney-park': {
                name: 'Killarney Provincial Park',
                center: { lat: 46.0500, lng: -81.1000 },
                zoom: 12,
                bounds: { north: 46.25, south: 45.85, east: -80.75, west: -81.45 },
                size: '18MB',
                lastUpdated: '2026-03-15',
                trails: [
                    { id: 'kill-1', name: 'The Crack', coordinates: [{ lat: 46.01, lng: -81.28 }, { lat: 46.02, lng: -81.27 }], color: '#FF5722' }
                ],
                pointsOfInterest: [
                    { id: 'poi-5', name: 'Killarney Village', type: 'town', lat: 45.9780, lng: -81.5120, icon: '🏘️' },
                    { id: 'poi-6', name: 'George Lake Campground', type: 'camping', lat: 46.0120, lng: -81.3650, icon: '⛺' }
                ]
            },
            'pinery-park': {
                name: 'Pinery Provincial Park',
                center: { lat: 43.8500, lng: -81.8000 },
                zoom: 13,
                bounds: { north: 43.93, south: 43.77, east: -81.68, west: -81.92 },
                size: '12MB',
                lastUpdated: '2026-04-10',
                trails: [
                    { id: 'pin-1', name: 'Dunes Boardwalk', coordinates: [{ lat: 43.87, lng: -81.83 }, { lat: 43.87, lng: -81.84 }], color: '#4CAF50' }
                ],
                pointsOfInterest: [
                    { id: 'poi-7', name: 'Pinery Beach', type: 'swimming', lat: 43.8720, lng: -81.8410, icon: '🏖️' },
                    { id: 'poi-8', name: 'Outlet Beach', type: 'swimming', lat: 43.8650, lng: -81.8340, icon: '🏖️' }
                ]
            }
        };
    }

    // Download map for offline use
    async downloadMap(parkId) {
        const map = this.mapData[parkId];
        if (!map) return { success: false, error: 'Map not found' };

        if (this.isMapDownloaded(parkId)) {
            return { success: false, error: 'Map already downloaded' };
        }

        // Simulate download (in production would cache tiles via service worker)
        const downloadRecord = {
            parkId,
            name: map.name,
            size: map.size,
            downloadedAt: new Date().toISOString(),
            lastUpdated: map.lastUpdated,
            status: 'complete'
        };

        this.downloadedMaps.push(downloadRecord);
        localStorage.setItem('downloaded-maps', JSON.stringify(this.downloadedMaps));

        if (window.gaManager) {
            window.gaManager.trackEvent('map_downloaded', { park_id: parkId, size: map.size });
        }

        return { success: true, map: downloadRecord };
    }

    // Check if map is downloaded
    isMapDownloaded(parkId) {
        return this.downloadedMaps.some(m => m.parkId === parkId);
    }

    // Delete downloaded map
    deleteMap(parkId) {
        this.downloadedMaps = this.downloadedMaps.filter(m => m.parkId !== parkId);
        localStorage.setItem('downloaded-maps', JSON.stringify(this.downloadedMaps));
        return { success: true };
    }

    // Get storage used
    getStorageUsed() {
        const totalMB = this.downloadedMaps.reduce((sum, m) => {
            return sum + parseFloat(m.size.replace('MB', ''));
        }, 0);
        return `${totalMB.toFixed(1)}MB`;
    }

    // Add waypoint
    addWaypoint(name, lat, lng, type = 'custom', notes = '') {
        const waypoint = {
            id: 'wp_' + Date.now(),
            name,
            lat,
            lng,
            type,
            notes,
            createdAt: new Date().toISOString()
        };

        this.waypoints.push(waypoint);
        localStorage.setItem('waypoints', JSON.stringify(this.waypoints));

        return waypoint;
    }

    // Remove waypoint
    removeWaypoint(waypointId) {
        this.waypoints = this.waypoints.filter(w => w.id !== waypointId);
        localStorage.setItem('waypoints', JSON.stringify(this.waypoints));
    }

    // Get waypoints for park
    getWaypoints(parkId) {
        const map = this.mapData[parkId];
        if (!map) return this.waypoints;

        const { north, south, east, west } = map.bounds;
        return this.waypoints.filter(w =>
            w.lat <= north && w.lat >= south && w.lng <= east && w.lng >= west
        );
    }

    // Save route
    saveRoute(name, waypoints, parkId) {
        const route = {
            id: 'route_' + Date.now(),
            name,
            parkId,
            waypoints,
            distance: this.calculateRouteDistance(waypoints),
            createdAt: new Date().toISOString()
        };

        this.routes.push(route);
        localStorage.setItem('saved-routes', JSON.stringify(this.routes));

        return route;
    }

    // Calculate route distance
    calculateRouteDistance(waypoints) {
        if (waypoints.length < 2) return 0;
        let totalDistance = 0;

        for (let i = 0; i < waypoints.length - 1; i++) {
            const a = waypoints[i];
            const b = waypoints[i + 1];
            const R = 6371;
            const dLat = (b.lat - a.lat) * Math.PI / 180;
            const dLng = (b.lng - a.lng) * Math.PI / 180;
            const sinA = Math.sin(dLat / 2) ** 2 +
                         Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) *
                         Math.sin(dLng / 2) ** 2;
            totalDistance += R * 2 * Math.atan2(Math.sqrt(sinA), Math.sqrt(1 - sinA));
        }

        return Math.round(totalDistance * 10) / 10;
    }

    // Get park POIs
    getPointsOfInterest(parkId, type = null) {
        const map = this.mapData[parkId];
        if (!map) return [];
        const pois = map.pointsOfInterest || [];
        return type ? pois.filter(p => p.type === type) : pois;
    }

    // Get current position
    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }
            navigator.geolocation.getCurrentPosition(
                pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
                reject,
                { enableHighAccuracy: true, timeout: 10000 }
            );
        });
    }

    // Find nearest POI
    async findNearestPOI(parkId) {
        const position = await this.getCurrentPosition();
        const pois = this.getPointsOfInterest(parkId);

        return pois.map(poi => {
            const R = 6371000;
            const dLat = (poi.lat - position.lat) * Math.PI / 180;
            const dLng = (poi.lng - position.lng) * Math.PI / 180;
            const a = Math.sin(dLat / 2) ** 2 +
                      Math.cos(position.lat * Math.PI / 180) * Math.cos(poi.lat * Math.PI / 180) *
                      Math.sin(dLng / 2) ** 2;
            const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return { ...poi, distance: Math.round(distance) };
        }).sort((a, b) => a.distance - b.distance)[0];
    }

    // Render map panel
    renderMapPanel(parkId, containerId = 'map-panel') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const map = this.mapData[parkId];
        const isDownloaded = this.isMapDownloaded(parkId);
        const pois = this.getPointsOfInterest(parkId);

        let html = `
            <div class="map-panel">
                <div class="map-header">
                    <h3>${map?.name || 'Park Map'}</h3>
                    <div class="map-actions">
                        ${isDownloaded ? `
                            <span class="downloaded-badge">✓ Downloaded (${map?.size})</span>
                            <button class="btn-secondary btn-sm" onclick="offlineMapsManager.deleteMap('${parkId}')">Remove</button>
                        ` : `
                            <button class="btn-primary btn-sm" onclick="offlineMapsManager.downloadMap('${parkId}').then(() => location.reload())">
                                Download Offline Map (${map?.size})
                            </button>
                        `}
                    </div>
                </div>

                <div class="map-placeholder">
                    <div class="map-center-info">
                        <p>Interactive map would render here using Leaflet.js or Mapbox</p>
                        <p>Center: ${map?.center.lat}°N, ${Math.abs(map?.center.lng)}°W</p>
                    </div>
                </div>

                <div class="poi-list">
                    <h4>Points of Interest</h4>
                    ${pois.map(poi => `
                        <div class="poi-item">
                            <span class="poi-icon">${poi.icon}</span>
                            <span class="poi-name">${poi.name}</span>
                            <span class="poi-type">${poi.type}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="waypoints-section">
                    <h4>My Waypoints (${this.getWaypoints(parkId).length})</h4>
                    <button class="btn-secondary btn-sm" onclick="offlineMapsManager.promptAddWaypoint()">
                        + Add Waypoint
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    // Prompt to add waypoint
    promptAddWaypoint() {
        const name = prompt('Waypoint name:');
        if (!name) return;

        this.getCurrentPosition().then(pos => {
            this.addWaypoint(name, pos.lat, pos.lng);
            alert(`Waypoint "${name}" saved at your current location!`);
        }).catch(() => {
            alert('Could not get your location. Please enable GPS.');
        });
    }
}

const offlineMapsManager = new OfflineMapsManager();
