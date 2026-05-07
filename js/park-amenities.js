// Park Amenities & Facilities Finder
// Comprehensive amenities, accessibility, and facility information

class ParkAmenitiesFinder {
    constructor() {
        this.parkAmenities = this.loadParkAmenities();
        this.userPreferences = JSON.parse(localStorage.getItem('amenity-preferences') || '{}');
        this.accessibility = this.loadAccessibilityInfo();
    }

    // Load comprehensive park amenities
    loadParkAmenities() {
        return {
            'algonquin-park': {
                name: 'Algonquin Provincial Park',
                facilities: {
                    camping: ['tent-camping', 'car-camping', 'backcountry'],
                    water: ['canoe-rentals', 'boat-launch', 'beach', 'swimming-area'],
                    food: ['restaurant', 'cafe', 'picnic-areas', 'groceries-nearby'],
                    restrooms: ['flush-toilets', 'pit-toilets', 'shower-buildings'],
                    parking: ['parking-lot', 'overflow-parking', 'accessible-parking'],
                    other: ['gift-shop', 'visitor-center', 'wifi', 'cell-service']
                },
                amenities: {
                    'tent-camping': { available: true, count: 300, rating: 4.7 },
                    'car-camping': { available: true, count: 50, rating: 4.6 },
                    'canoe-rentals': { available: true, count: 75, rating: 4.8 },
                    'restaurant': { available: true, hours: '8am-9pm', rating: 4.5 },
                    'visitor-center': { available: true, hours: '9am-5pm', rating: 4.7 },
                    'wifi': { available: true, coverage: 'visitor areas only', rating: 3.5 }
                },
                accessibility: {
                    wheelchairAccessible: true,
                    accessibleTrails: 3,
                    accessibleCampsites: 8,
                    accessibleParkingSpaces: 12,
                    serviceAnimalsAllowed: true,
                    accessibleRestrooms: true
                },
                seasonalAmenities: {
                    summer: ['swimming', 'boat-rentals', 'guided-tours'],
                    winter: ['snowshoeing', 'cross-country-skiing', 'ice-fishing'],
                    spring: ['bird-watching', 'wildflower-viewing'],
                    fall: ['leaf-peeping', 'photography-tours']
                },
                maxCapacity: 2000,
                estimatedOccupancy: 1200,
                crowdLevel: 'moderate'
            },
            'pinery-park': {
                name: 'Pinery Provincial Park',
                facilities: {
                    camping: ['tent-camping', 'car-camping'],
                    water: ['beach', 'swimming-area', 'water-sports'],
                    food: ['picnic-areas', 'snack-bar'],
                    restrooms: ['flush-toilets', 'shower-buildings'],
                    parking: ['parking-lot', 'accessible-parking'],
                    other: ['gift-shop', 'playground', 'volleyball-courts']
                },
                amenities: {
                    'tent-camping': { available: true, count: 400, rating: 4.8 },
                    'beach': { available: true, rating: 4.9 },
                    'shower-buildings': { available: true, rating: 4.6 },
                    'playground': { available: true, ageGroup: '0-12', rating: 4.7 },
                    'volleyball-courts': { available: true, count: 3, rating: 4.4 }
                },
                accessibility: {
                    wheelchairAccessible: true,
                    accessibleTrails: 2,
                    accessibleCampsites: 6,
                    accessibleParkingSpaces: 8,
                    serviceAnimalsAllowed: true,
                    accessibleRestrooms: true,
                    accessibleBeach: true
                },
                seasonalAmenities: {
                    summer: ['swimming', 'beach-volleyball', 'water-sports'],
                    spring: ['hiking'],
                    fall: ['picnicking', 'photography']
                },
                maxCapacity: 1500,
                estimatedOccupancy: 900,
                crowdLevel: 'light'
            },
            'killarney-park': {
                name: 'Killarney Provincial Park',
                facilities: {
                    camping: ['tent-camping', 'car-camping'],
                    water: ['canoe-rentals', 'boat-launch'],
                    food: ['picnic-areas'],
                    restrooms: ['pit-toilets'],
                    parking: ['parking-lot'],
                    other: ['visitor-center', 'scenic-viewpoints']
                },
                amenities: {
                    'tent-camping': { available: true, count: 120, rating: 4.8 },
                    'canoe-rentals': { available: true, count: 30, rating: 4.9 },
                    'scenic-viewpoints': { available: true, count: 5, rating: 4.9 },
                    'visitor-center': { available: true, hours: '10am-4pm', rating: 4.6 }
                },
                accessibility: {
                    wheelchairAccessible: false,
                    accessibleTrails: 0,
                    accessibleCampsites: 0,
                    accessibleParkingSpaces: 2,
                    serviceAnimalsAllowed: true,
                    accessibleRestrooms: false
                },
                seasonalAmenities: {
                    summer: ['hiking', 'mountain-views', 'photography'],
                    fall: ['leaf-peeping', 'hiking']
                },
                maxCapacity: 800,
                estimatedOccupancy: 400,
                crowdLevel: 'light'
            }
        };
    }

    // Load accessibility information
    loadAccessibilityInfo() {
        return {
            wheelchairAccessibility: 'Ability to navigate with wheelchair',
            accessibleTrails: 'Paved or groomed trails suitable for wheelchairs',
            accessibleCampsites: 'Campsites with accessible parking and facilities',
            accessibleRestrooms: 'Restrooms with wheelchair-accessible stalls',
            accessibleParking: 'Designated accessible parking spaces',
            serviceAnimalsAllowed: 'Service animals permitted in park',
            mobilityAids: 'Supports for visitors using canes, crutches, walkers',
            hearingLoop: 'Assistive listening systems available',
            visualAids: 'Tactile maps and large print guides'
        };
    }

    // Get park amenities
    getParkAmenities(parkId) {
        return this.parkAmenities[parkId] || null;
    }

    // Search amenities
    searchAmenities(parkId, query) {
        const park = this.parkAmenities[parkId];
        if (!park) return [];

        const results = [];

        Object.entries(park.amenities).forEach(([amenity, details]) => {
            if (amenity.toLowerCase().includes(query.toLowerCase())) {
                results.push({
                    amenity,
                    ...details
                });
            }
        });

        return results;
    }

    // Get amenities by category
    getAmenitiesByCategory(parkId, category) {
        const park = this.parkAmenities[parkId];
        if (!park) return [];

        return park.facilities[category] || [];
    }

    // Check if amenity is available
    isAmenityAvailable(parkId, amenity) {
        const park = this.parkAmenities[parkId];
        if (!park || !park.amenities[amenity]) return false;

        return park.amenities[amenity].available !== false;
    }

    // Get seasonal amenities
    getSeasonalAmenities(parkId) {
        const park = this.parkAmenities[parkId];
        if (!park) return {};

        const month = new Date().getMonth();
        let season;

        if (month < 3) season = 'winter';
        else if (month < 6) season = 'spring';
        else if (month < 9) season = 'summer';
        else season = 'fall';

        return park.seasonalAmenities[season] || [];
    }

    // Get accessibility score
    getAccessibilityScore(parkId) {
        const park = this.parkAmenities[parkId];
        if (!park || !park.accessibility) return 0;

        const accessibility = park.accessibility;
        let score = 0;

        if (accessibility.wheelchairAccessible) score += 20;
        if (accessibility.accessibleTrails > 0) score += (accessibility.accessibleTrails / 5) * 15;
        if (accessibility.accessibleCampsites > 0) score += (accessibility.accessibleCampsites / 10) * 15;
        if (accessibility.accessibleRestrooms) score += 20;
        if (accessibility.serviceAnimalsAllowed) score += 15;

        return Math.min(Math.round(score), 100);
    }

    // Find parks with specific amenities
    findParksByAmenity(amenities) {
        const matchingParks = [];

        Object.entries(this.parkAmenities).forEach(([parkId, park]) => {
            const hasAllAmenities = amenities.every(amenity => {
                return park.amenities[amenity] || park.facilities[Object.keys(park.facilities).find(cat => park.facilities[cat].includes(amenity))];
            });

            if (hasAllAmenities) {
                matchingParks.push({
                    parkId,
                    name: park.name,
                    amenityCount: Object.keys(park.amenities).length,
                    accessibility: this.getAccessibilityScore(parkId)
                });
            }
        });

        return matchingParks;
    }

    // Get crowd level
    getCrowdLevel(parkId) {
        const park = this.parkAmenities[parkId];
        if (!park) return null;

        const occupancyPercent = (park.estimatedOccupancy / park.maxCapacity) * 100;

        return {
            level: park.crowdLevel,
            occupancy: park.estimatedOccupancy,
            capacity: park.maxCapacity,
            occupancyPercent: Math.round(occupancyPercent),
            recommendation: occupancyPercent > 80 ? 'Consider visiting another time' :
                          occupancyPercent > 50 ? 'Park is moderately busy' :
                          'Good time to visit'
        };
    }

    // Get amenities for families
    getFamilyAmenities(parkId) {
        const park = this.parkAmenities[parkId];
        if (!park) return [];

        const familyFriendly = [];

        Object.entries(park.amenities).forEach(([amenity, details]) => {
            if (['playground', 'swimming-area', 'beach', 'picnic-areas'].includes(amenity)) {
                familyFriendly.push({ amenity, ...details });
            }
        });

        return familyFriendly;
    }

    // Get amenities for accessibility
    getAccessibleAmenities(parkId) {
        const park = this.parkAmenities[parkId];
        if (!park) return null;

        const accessible = {
            wheelchairAccessiblePaths: park.accessibility.wheelchairAccessible,
            accessibleTrails: park.accessibility.accessibleTrails,
            accessibleCampsites: park.accessibility.accessibleCampsites,
            accessibleRestrooms: park.accessibility.accessibleRestrooms,
            accessibleParking: park.accessibility.accessibleParkingSpaces,
            serviceAnimalsAllowed: park.accessibility.serviceAnimalsAllowed
        };

        return accessible;
    }

    // Save amenity preference
    savePreference(preference, value) {
        this.userPreferences[preference] = value;
        localStorage.setItem('amenity-preferences', JSON.stringify(this.userPreferences));
    }

    // Get user preferences
    getUserPreferences() {
        return this.userPreferences;
    }

    // Recommend parks based on preferences
    recommendParks(preferences = {}) {
        const {
            needsAccessibility = false,
            familyFriendly = false,
            quiet = false
        } = preferences;

        const recommendations = [];

        Object.entries(this.parkAmenities).forEach(([parkId, park]) => {
            let score = 0;

            // Accessibility scoring
            if (needsAccessibility) {
                const accessScore = this.getAccessibilityScore(parkId);
                score += accessScore > 50 ? 30 : 0;
            }

            // Family-friendly scoring
            if (familyFriendly) {
                const familyAmenities = this.getFamilyAmenities(parkId);
                score += Math.min(familyAmenities.length * 10, 30);
            }

            // Quiet scoring
            if (quiet) {
                const crowdScore = 100 - (park.estimatedOccupancy / park.maxCapacity) * 100;
                score += crowdScore * 0.3;
            }

            if (score > 0) {
                recommendations.push({
                    parkId,
                    name: park.name,
                    score: Math.round(score)
                });
            }
        });

        return recommendations.sort((a, b) => b.score - a.score);
    }

    // Render amenities panel
    renderAmenitiesPanel(parkId, containerId = 'amenities-panel') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const park = this.parkAmenities[parkId];
        if (!park) return;

        const accessibility = this.getAccessibleAmenities(parkId);
        const crowd = this.getCrowdLevel(parkId);

        let html = `
            <div class="amenities-panel">
                <div class="amenities-header">
                    <h2>Amenities & Facilities</h2>
                </div>

                <div class="crowd-status">
                    <h3>Park Status</h3>
                    <div class="crowd-indicator ${crowd.occupancyPercent > 80 ? 'busy' : crowd.occupancyPercent > 50 ? 'moderate' : 'light'}">
                        <div class="crowd-bar" style="width: ${crowd.occupancyPercent}%"></div>
                    </div>
                    <p>${crowd.occupancyPercent}% Full - ${crowd.recommendation}</p>
                </div>

                <div class="amenities-grid">
        `;

        Object.entries(park.facilities).forEach(([category, amenities]) => {
            html += `
                <div class="amenity-category">
                    <h4>${category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                    <ul class="amenity-list">
            `;

            amenities.forEach(amenity => {
                const details = park.amenities[amenity] || {};
                const available = details.available !== false ? '✓' : '✗';

                html += `<li>${available} ${amenity.replace(/-/g, ' ')}</li>`;
            });

            html += '</ul></div>';
        });

        html += `
                </div>

                <div class="accessibility-section">
                    <h3>Accessibility</h3>
                    <div class="accessibility-score">
                        Score: <strong>${this.getAccessibilityScore(parkId)}/100</strong>
                    </div>
                    <ul class="accessibility-list">
        `;

        Object.entries(accessibility).forEach(([feature, available]) => {
            const icon = available ? '✓' : '✗';
            html += `
                <li class="${available ? 'available' : 'unavailable'}">
                    ${icon} ${feature.replace(/([A-Z])/g, ' $1').trim()}
                </li>
            `;
        });

        html += `
                    </ul>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    // Get amenities summary
    getAmenitiesSummary(parkId) {
        const park = this.parkAmenities[parkId];
        if (!park) return null;

        return {
            parkName: park.name,
            totalAmenities: Object.keys(park.amenities).length,
            categories: Object.keys(park.facilities).length,
            accessibility: this.getAccessibilityScore(parkId),
            crowdLevel: park.crowdLevel,
            occupancy: `${park.estimatedOccupancy}/${park.maxCapacity}`
        };
    }
}

const parkAmenitiesFinder = new ParkAmenitiesFinder();
