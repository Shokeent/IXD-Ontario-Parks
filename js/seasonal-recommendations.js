// Seasonal Recommendations & Experience Engine
// Context-aware recommendations, seasonal insights, and community intelligence

class SeasonalRecommendationEngine {
    constructor() {
        this.seasonalData = this.loadSeasonalData();
        this.userPreferences = JSON.parse(localStorage.getItem('recommendation-preferences') || '{}');
        this.recommendations = JSON.parse(localStorage.getItem('recommendations-cache') || '[]');
    }

    // Load seasonal data
    loadSeasonalData() {
        return {
            spring: {
                month: 'March-May',
                temperature: '10-18°C',
                features: ['wildflowers', 'birds', 'mild_weather'],
                bestParks: ['point-pelee-park', 'bon-echo-park'],
                activities: ['hiking', 'bird_watching', 'photography'],
                packingTips: ['light layers', 'rain jacket', 'waterproof boots']
            },
            summer: {
                month: 'June-August',
                temperature: '18-26°C',
                features: ['warm_weather', 'lakes', 'long_days'],
                bestParks: ['algonquin-park', 'pinery-park'],
                activities: ['camping', 'swimming', 'canoeing'],
                packingTips: ['light clothing', 'sunscreen', 'insect_repellent']
            },
            fall: {
                month: 'September-November',
                temperature: '5-18°C',
                features: ['fall_colors', 'crisp_air', 'fewer_crowds'],
                bestParks: ['killarney-park', 'algonquin-park'],
                activities: ['hiking', 'photography', 'foraging'],
                packingTips: ['warm_layers', 'waterproof_jacket', 'comfortable_boots']
            },
            winter: {
                month: 'December-February',
                temperature: '-15 to -5°C',
                features: ['snow', 'ice', 'solitude'],
                bestParks: ['muskoka-park', 'kawartha-park'],
                activities: ['snowshoeing', 'cross_country_skiing', 'ice_fishing'],
                packingTips: ['thermal_layers', 'parka', 'winter_boots']
            }
        };
    }

    // Get current season
    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month < 3) return 'winter';
        if (month < 6) return 'spring';
        if (month < 9) return 'summer';
        return 'fall';
    }

    // Get season recommendations
    getSeasonalRecommendations() {
        const season = this.getCurrentSeason();
        const seasonData = this.seasonalData[season];

        return {
            season,
            ...seasonData,
            reason: `Perfect time for ${seasonData.activities.join(', ')} in Ontario`
        };
    }

    // Generate personalized recommendations
    generatePersonalizedRecommendations(userProfile = {}) {
        const {
            groupSize = 1,
            difficulty = 'moderate',
            activities = [],
            distance = 50,
            budget = 500
        } = userProfile;

        const recommendations = [];

        // Get seasonal recommendations
        const seasonal = this.getSeasonalRecommendations();

        // Filter by group size
        if (groupSize === 1) {
            recommendations.push({
                type: 'solo',
                title: 'Solo Adventures',
                description: 'Perfect parks for solo travelers',
                parks: this.filterByGroupSize(1)
            });
        } else if (groupSize <= 4) {
            recommendations.push({
                type: 'small_group',
                title: 'Group-Friendly Parks',
                description: 'Great for small groups',
                parks: this.filterByGroupSize(groupSize)
            });
        } else {
            recommendations.push({
                type: 'large_group',
                title: 'Large Group Parks',
                description: 'Ideal for large group gatherings',
                parks: this.filterByGroupSize(groupSize)
            });
        }

        // Add activity-based recommendations
        if (activities.length > 0) {
            activities.forEach(activity => {
                const parks = this.filterByActivity(activity);
                if (parks.length > 0) {
                    recommendations.push({
                        type: 'activity',
                        title: `Best Parks for ${this.formatActivityName(activity)}`,
                        activity,
                        parks
                    });
                }
            });
        }

        // Add budget-based recommendations
        if (budget < 200) {
            recommendations.push({
                type: 'budget',
                title: 'Budget-Friendly Options',
                description: 'Quality parks within your budget',
                parks: this.filterByBudget(budget)
            });
        }

        return recommendations;
    }

    // Filter parks by group size
    filterByGroupSize(size) {
        // Mock implementation
        return [
            { id: 'algonquin-park', name: 'Algonquin Provincial Park', maxGroupSize: size <= 4 ? size : 8 },
            { id: 'pinery-park', name: 'Pinery Provincial Park', maxGroupSize: size <= 4 ? size : 8 }
        ];
    }

    // Filter parks by activity
    filterByActivity(activity) {
        const activityMap = {
            'hiking': ['algonquin-park', 'killarney-park', 'bon-echo-park'],
            'camping': ['algonquin-park', 'pinery-park'],
            'water_sports': ['pinery-park', 'point-pelee-park'],
            'bird_watching': ['point-pelee-park', 'algonquin-park'],
            'photography': ['killarney-park', 'algonquin-park'],
            'family_friendly': ['pinery-park', 'point-pelee-park']
        };

        return (activityMap[activity] || []).map(id => ({
            id,
            matchScore: 0.9
        }));
    }

    // Filter parks by budget
    filterByBudget(budget) {
        // Mock budget calculation ($40/night per campsite)
        const nights = Math.floor(budget / 40);
        return [
            { id: 'bon-echo-park', name: 'Bon Echo', nights, totalCost: nights * 40 },
            { id: 'point-pelee-park', name: 'Point Pelee', nights, totalCost: nights * 40 }
        ];
    }

    // Format activity name
    formatActivityName(activity) {
        return activity
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    // Get weather-based recommendations
    getWeatherBasedRecommendations(weather) {
        const recommendations = [];

        if (weather.condition === 'Sunny') {
            recommendations.push({
                type: 'weather',
                title: 'Perfect Weather for Photography',
                description: 'Sunny conditions ideal for landscape photography',
                parks: ['killarney-park']
            });
        } else if (weather.condition === 'Rainy') {
            recommendations.push({
                type: 'weather',
                title: 'Indoor Activities Available',
                description: 'Parks with shelters and indoor facilities',
                parks: ['algonquin-park']
            });
        }

        return recommendations;
    }

    // Get trending experiences
    getTrendingExperiences() {
        return [
            {
                title: 'Waterfall Chasing',
                description: 'Explore Ontario\'s most scenic waterfalls',
                difficulty: 'moderate',
                rating: 4.8,
                reviews: 243
            },
            {
                title: 'Sunset Views',
                description: 'Parks with the best sunset viewing spots',
                difficulty: 'easy',
                rating: 4.9,
                reviews: 189
            },
            {
                title: 'Wildlife Photography',
                description: 'Best parks for capturing wildlife photos',
                difficulty: 'moderate',
                rating: 4.7,
                reviews: 156
            }
        ];
    }

    // Get community insights
    getCommunityInsights() {
        return {
            mostVisited: [
                { park: 'Algonquin', visits: 12500, trend: 'up' },
                { park: 'Pinery', visits: 8900, trend: 'up' },
                { park: 'Killarney', visits: 6200, trend: 'stable' }
            ],
            averageRatings: {
                'Algonquin': 4.7,
                'Pinery': 4.5,
                'Killarney': 4.8
            },
            bestMonth: 'July',
            busyTimes: ['weekends', 'summer', 'holidays']
        };
    }

    // Get expert recommendations
    getExpertRecommendations() {
        return [
            {
                expert: 'Senior Park Ranger',
                recommendation: 'Hidden gem: Barron Canyon offers stunning views with fewer crowds in late September',
                park: 'algonquin-park',
                month: 'September'
            },
            {
                expert: 'Outdoor Photographer',
                recommendation: 'Best light for photography at Killarney is early morning in June',
                park: 'killarney-park',
                month: 'June'
            }
        ];
    }

    // Save preference
    savePreference(preference) {
        this.userPreferences = {
            ...this.userPreferences,
            ...preference
        };

        localStorage.setItem('recommendation-preferences', JSON.stringify(this.userPreferences));
    }

    // Get user journey stage
    getUserJourneyStage(userActivity) {
        if (userActivity.bookingsCount === 0 && userActivity.parkViewsCount < 5) {
            return 'awareness';
        } else if (userActivity.bookingsCount === 0 && userActivity.parkViewsCount >= 5) {
            return 'consideration';
        } else if (userActivity.bookingsCount > 0) {
            return 'customer';
        }
    }

    // Get stage-specific recommendations
    getStageBasedRecommendations(stage) {
        const recommendations = {
            awareness: [
                {
                    title: 'Welcome to Ontario Parks!',
                    description: 'Discover what makes Ontario parks special',
                    content: 'Featured parks and must-see attractions'
                }
            ],
            consideration: [
                {
                    title: 'Help You Choose',
                    description: 'Find the perfect park for your next trip',
                    content: 'Park comparison tools and reviews'
                }
            ],
            customer: [
                {
                    title: 'Welcome Back!',
                    description: 'Explore new parks and revisit favorites',
                    content: 'New trails and seasonal opportunities'
                }
            ]
        };

        return recommendations[stage] || [];
    }

    // Render recommendations
    renderRecommendations(recommendations, containerId = 'recommendations') {
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = '<div class="recommendations-container">';

        recommendations.forEach(rec => {
            html += `
                <div class="recommendation-card">
                    <div class="rec-header">
                        <h3>${rec.title}</h3>
                        <span class="rec-type">${rec.type}</span>
                    </div>
                    <p class="rec-description">${rec.description || ''}</p>
                    ${rec.parks ? `
                        <div class="rec-parks">
                            ${rec.parks.slice(0, 3).map(park => `
                                <button class="park-tag" onclick="navigateToParkDetails('${park.id}')">
                                    ${park.name || park.id}
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}
                    <button class="btn-primary" onclick="viewRecommendation('${rec.type}')">
                        Explore
                    </button>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    // Render seasonal info
    renderSeasonalInfo(containerId = 'seasonal-info') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const seasonal = this.getSeasonalRecommendations();
        const community = this.getCommunityInsights();

        let html = `
            <div class="seasonal-info">
                <div class="seasonal-header">
                    <h2>${seasonal.season.charAt(0).toUpperCase() + seasonal.season.slice(1)} Guide</h2>
                    <p class="seasonal-period">${seasonal.month}</p>
                </div>

                <div class="seasonal-details">
                    <div class="seasonal-section">
                        <h3>Temperature</h3>
                        <p>${seasonal.temperature}</p>
                    </div>

                    <div class="seasonal-section">
                        <h3>Best Activities</h3>
                        <div class="activity-list">
                            ${seasonal.activities.map(activity => `
                                <span class="activity-badge">${this.formatActivityName(activity)}</span>
                            `).join('')}
                        </div>
                    </div>

                    <div class="seasonal-section">
                        <h3>Top Parks</h3>
                        <div class="parks-list">
                            ${seasonal.bestParks.map(park => `
                                <button class="park-link" onclick="navigateToParkDetails('${park}')">
                                    ${park.replace('-park', '').replace('-', ' ')}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>

                <div class="community-insights">
                    <h3>Community Trending</h3>
                    <p>📈 Most Visited: ${community.mostVisited[0].park}</p>
                    <p>⭐ Highest Rated: ${Object.entries(community.averageRatings).sort((a, b) => b[1] - a[1])[0][0]}</p>
                    <p>🗓️ Best Month: ${community.bestMonth}</p>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    // Cache recommendations
    cacheRecommendations(recommendations) {
        this.recommendations = recommendations;
        localStorage.setItem('recommendations-cache', JSON.stringify(recommendations));
    }

    // Get cached recommendations
    getCachedRecommendations() {
        return this.recommendations;
    }
}

const seasonalRecommendationEngine = new SeasonalRecommendationEngine();
