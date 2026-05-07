// Trail Information Manager
// Detailed trail data, difficulty ratings, distances, conditions

class TrailManager {
    constructor() {
        this.trails = this.loadTrails();
        this.userTrailRatings = JSON.parse(localStorage.getItem('trail-ratings') || '{}');
        this.userTrailReviews = JSON.parse(localStorage.getItem('trail-reviews') || '{}');
    }

    // Load trail data
    loadTrails() {
        return {
            'algonquin-park': [
                {
                    id: 'algo-1',
                    name: 'Lake of Two Rivers',
                    parkId: 'algonquin-park',
                    distance: 2.0,
                    duration: 45,
                    difficulty: 'easy',
                    elevation: 50,
                    description: 'Scenic lake loop with panoramic views',
                    features: ['lake', 'forest', 'picnic_area', 'viewpoint'],
                    bestSeason: ['spring', 'summer', 'fall'],
                    waterSource: true,
                    dogFriendly: true,
                    wheelchair: false,
                    reviews: 24
                },
                {
                    id: 'algo-2',
                    name: 'Barron Canyon Trail',
                    parkId: 'algonquin-park',
                    distance: 10.5,
                    duration: 240,
                    difficulty: 'moderate',
                    elevation: 200,
                    description: 'Dramatic canyon views and rocky terrain',
                    features: ['canyon', 'forest', 'river', 'viewpoint'],
                    bestSeason: ['summer', 'fall'],
                    waterSource: true,
                    dogFriendly: true,
                    wheelchair: false,
                    reviews: 42
                },
                {
                    id: 'algo-3',
                    name: 'Tim Lake Backpacking Trail',
                    parkId: 'algonquin-park',
                    distance: 47.0,
                    duration: 1920,
                    difficulty: 'hard',
                    elevation: 800,
                    description: 'Multi-day backcountry adventure with pristine lakes',
                    features: ['lake', 'forest', 'camping', 'wilderness'],
                    bestSeason: ['summer'],
                    waterSource: true,
                    dogFriendly: false,
                    wheelchair: false,
                    reviews: 18
                }
            ],
            'killarney-park': [
                {
                    id: 'kill-1',
                    name: 'The Crack Trail',
                    parkId: 'killarney-park',
                    distance: 3.2,
                    duration: 90,
                    difficulty: 'moderate',
                    elevation: 150,
                    description: 'Narrow gorge hike with stunning rock formations',
                    features: ['gorge', 'rocks', 'forest'],
                    bestSeason: ['spring', 'summer', 'fall'],
                    waterSource: false,
                    dogFriendly: false,
                    wheelchair: false,
                    reviews: 56
                }
            ],
            'pinery-park': [
                {
                    id: 'pin-1',
                    name: 'Dunes Boardwalk',
                    parkId: 'pinery-park',
                    distance: 2.5,
                    duration: 60,
                    difficulty: 'easy',
                    elevation: 30,
                    description: 'Beach and sand dunes boardwalk walk',
                    features: ['beach', 'dunes', 'boardwalk'],
                    bestSeason: ['spring', 'summer', 'fall'],
                    waterSource: false,
                    dogFriendly: true,
                    wheelchair: true,
                    reviews: 89
                },
                {
                    id: 'pin-2',
                    name: 'Nipissing Lake Shoreline',
                    parkId: 'pinery-park',
                    distance: 6.0,
                    duration: 150,
                    difficulty: 'easy',
                    elevation: 20,
                    description: 'Scenic lakeside walk through old-growth forest',
                    features: ['lake', 'forest', 'beach'],
                    bestSeason: ['summer', 'fall'],
                    waterSource: true,
                    dogFriendly: true,
                    wheelchair: false,
                    reviews: 67
                }
            ]
        };
    }

    // Get trails for park
    getParksTrails(parkId) {
        return this.trails[parkId] || [];
    }

    // Get trail by ID
    getTrailById(trailId) {
        for (const parkTrails of Object.values(this.trails)) {
            const trail = parkTrails.find(t => t.id === trailId);
            if (trail) return trail;
        }
        return null;
    }

    // Get trails by difficulty
    getTrailsByDifficulty(parkId, difficulty) {
        const trails = this.getParksTrails(parkId);
        return trails.filter(t => t.difficulty === difficulty);
    }

    // Get trails by duration
    getTrailsByDuration(parkId, minMinutes, maxMinutes) {
        const trails = this.getParksTrails(parkId);
        return trails.filter(t => t.duration >= minMinutes && t.duration <= maxMinutes);
    }

    // Get dog-friendly trails
    getDogFriendlyTrails(parkId) {
        const trails = this.getParksTrails(parkId);
        return trails.filter(t => t.dogFriendly);
    }

    // Get wheelchair accessible trails
    getWheelchairAccessibleTrails(parkId) {
        const trails = this.getParksTrails(parkId);
        return trails.filter(t => t.wheelchair);
    }

    // Get trails by season
    getTrailsBySeason(parkId, season) {
        const trails = this.getParksTrails(parkId);
        return trails.filter(t => t.bestSeason.includes(season));
    }

    // Get trails with water source
    getTrailsWithWater(parkId) {
        const trails = this.getParksTrails(parkId);
        return trails.filter(t => t.waterSource);
    }

    // Calculate difficulty level (0-10)
    calculateDifficultyScore(trail) {
        let score = 0;

        // Distance factor
        score += Math.min((trail.distance / 30) * 3, 3);

        // Elevation factor
        score += Math.min((trail.elevation / 1000) * 3, 3);

        // Duration factor
        score += Math.min((trail.duration / 480) * 2, 2);

        // Named difficulty modifier
        const difficultyModifiers = { 'easy': 0, 'moderate': 3, 'hard': 7 };
        score = Math.max(score, difficultyModifiers[trail.difficulty] || 0);

        return Math.min(Math.round(score * 10) / 10, 10);
    }

    // Format trail data for display
    formatTrailData(trail) {
        const season = new Date();
        const currentSeason = season.getMonth() < 3 ? 'spring' :
                             season.getMonth() < 6 ? 'spring' :
                             season.getMonth() < 9 ? 'summer' :
                             season.getMonth() < 12 ? 'fall' : 'winter';

        return {
            ...trail,
            distanceText: `${trail.distance} km`,
            durationText: this.formatDuration(trail.duration),
            elevationText: `${trail.elevation} m`,
            difficultyScore: this.calculateDifficultyScore(trail),
            isBestSeason: trail.bestSeason.includes(currentSeason),
            userRating: this.getUserTrailRating(trail.id),
            userReview: this.getUserTrailReview(trail.id)
        };
    }

    // Format duration
    formatDuration(minutes) {
        if (minutes < 60) {
            return `${minutes} min`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }

    // Rate trail
    rateTrail(trailId, rating) {
        if (rating < 1 || rating > 5) {
            return { success: false, error: 'Rating must be 1-5' };
        }

        this.userTrailRatings[trailId] = {
            rating,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('trail-ratings', JSON.stringify(this.userTrailRatings));

        if (window.gaManager) {
            window.gaManager.trackEvent('trail_rated', {
                trail_id: trailId,
                rating: rating
            });
        }

        return { success: true };
    }

    // Get user trail rating
    getUserTrailRating(trailId) {
        return this.userTrailRatings[trailId]?.rating || null;
    }

    // Save trail review
    saveTrailReview(trailId, review) {
        if (!review.title || !review.content) {
            return { success: false, error: 'Title and content required' };
        }

        this.userTrailReviews[trailId] = {
            title: review.title,
            content: review.content,
            rating: review.rating || 4,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('trail-reviews', JSON.stringify(this.userTrailReviews));

        if (window.gaManager) {
            window.gaManager.trackEvent('trail_reviewed', {
                trail_id: trailId,
                review_rating: review.rating
            });
        }

        return { success: true };
    }

    // Get user trail review
    getUserTrailReview(trailId) {
        return this.userTrailReviews[trailId] || null;
    }

    // Find recommended trails
    getRecommendedTrails(parkId, options = {}) {
        const {
            difficulty = null,
            maxDuration = null,
            wheelchairOnly = false,
            dogFriendly = false,
            waterSource = false
        } = options;

        let trails = this.getParksTrails(parkId);

        if (difficulty) {
            trails = trails.filter(t => t.difficulty === difficulty);
        }

        if (maxDuration) {
            trails = trails.filter(t => t.duration <= maxDuration);
        }

        if (wheelchairOnly) {
            trails = trails.filter(t => t.wheelchair);
        }

        if (dogFriendly) {
            trails = trails.filter(t => t.dogFriendly);
        }

        if (waterSource) {
            trails = trails.filter(t => t.waterSource);
        }

        return trails.map(t => this.formatTrailData(t));
    }

    // Render trail cards
    renderTrails(trails, containerId = 'trails-container') {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (trails.length === 0) {
            container.innerHTML = '<p class="no-results">No trails found</p>';
            return;
        }

        let html = '<div class="trails-grid">';

        trails.forEach(trail => {
            const formattedTrail = this.formatTrailData(trail);
            const userRating = this.getUserTrailRating(trail.id);
            const stars = userRating ? '★'.repeat(userRating) + '☆'.repeat(5 - userRating) : '☆☆☆☆☆';

            html += `
                <div class="trail-card" data-trail-id="${trail.id}">
                    <div class="trail-header">
                        <h3>${trail.name}</h3>
                        <span class="difficulty-badge difficulty-${trail.difficulty}">
                            ${trail.difficulty.charAt(0).toUpperCase() + trail.difficulty.slice(1)}
                        </span>
                    </div>
                    <p class="trail-description">${trail.description}</p>
                    <div class="trail-stats">
                        <div class="stat">
                            <span class="label">Distance:</span>
                            <span class="value">${formattedTrail.distanceText}</span>
                        </div>
                        <div class="stat">
                            <span class="label">Duration:</span>
                            <span class="value">${formattedTrail.durationText}</span>
                        </div>
                        <div class="stat">
                            <span class="label">Elevation:</span>
                            <span class="value">${formattedTrail.elevationText}</span>
                        </div>
                    </div>
                    <div class="trail-features">
                        ${trail.dogFriendly ? '<span class="feature">🐕 Dog Friendly</span>' : ''}
                        ${trail.wheelchair ? '<span class="feature">♿ Accessible</span>' : ''}
                        ${trail.waterSource ? '<span class="feature">💧 Water Source</span>' : ''}
                    </div>
                    <div class="trail-rating">
                        <span class="stars">${stars}</span>
                        <span class="reviews">(${trail.reviews} reviews)</span>
                    </div>
                    <button class="btn-primary" onclick="viewTrailDetails('${trail.id}')">
                        View Trail
                    </button>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    // Get trail statistics
    getTrailStats(parkId) {
        const trails = this.getParksTrails(parkId);

        return {
            totalTrails: trails.length,
            easy: trails.filter(t => t.difficulty === 'easy').length,
            moderate: trails.filter(t => t.difficulty === 'moderate').length,
            hard: trails.filter(t => t.difficulty === 'hard').length,
            averageDistance: (trails.reduce((sum, t) => sum + t.distance, 0) / trails.length).toFixed(1),
            averageDuration: Math.round(trails.reduce((sum, t) => sum + t.duration, 0) / trails.length),
            dogFriendlyCount: trails.filter(t => t.dogFriendly).length,
            wheelchairAccessible: trails.filter(t => t.wheelchair).length
        };
    }

    // Export trail GPX format
    exportTrailGPX(trail) {
        // Simplified GPX export - in production would include full coordinates
        const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="OntarioParks">
    <metadata>
        <name>${trail.name}</name>
        <desc>${trail.description}</desc>
    </metadata>
    <trk>
        <name>${trail.name}</name>
        <trkseg>
            <!-- Trail waypoints would go here -->
        </trkseg>
    </trk>
</gpx>`;
        return gpx;
    }

    // Download trail guide PDF
    downloadTrailGuide(trail) {
        const guideContent = `
Trail: ${trail.name}
Distance: ${trail.distance} km
Duration: ${this.formatDuration(trail.duration)}
Difficulty: ${trail.difficulty}
Elevation: ${trail.elevation} m

Description:
${trail.description}

Features:
${trail.features.join(', ')}

Best Seasons: ${trail.bestSeason.join(', ')}

Amenities:
- Water Source: ${trail.waterSource ? 'Yes' : 'No'}
- Dog Friendly: ${trail.dogFriendly ? 'Yes' : 'No'}
- Wheelchair Accessible: ${trail.wheelchair ? 'Yes' : 'No'}
`;

        const blob = new Blob([guideContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${trail.name.replace(/\s+/g, '_')}_guide.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

const trailManager = new TrailManager();
