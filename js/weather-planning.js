// Weather & Travel Planning Manager
// Weather forecasts, packing recommendations, travel planning

class WeatherPlanningManager {
    constructor() {
        this.weatherData = {};
        this.tripPlans = JSON.parse(localStorage.getItem('trip-plans') || '[]');
        this.packingLists = JSON.parse(localStorage.getItem('packing-lists') || '[]');
    }

    // Get weather for park/location
    async getWeatherForecast(latitude, longitude, parkId = null) {
        // In production, would call real weather API (OpenWeatherMap, Weather.gov, etc.)
        // This is mock data for demonstration

        const mockWeather = {
            current: {
                temp: 22,
                condition: 'Partly Cloudy',
                humidity: 65,
                windSpeed: 12,
                uvIndex: 6,
                visibility: 10,
                feelsLike: 20
            },
            forecast: this.generateWeekForecast(),
            alerts: this.getWeatherAlerts(parkId),
            bestTimeToVisit: this.getOptimalTime()
        };

        this.weatherData[parkId] = mockWeather;
        return mockWeather;
    }

    // Generate week forecast
    generateWeekForecast() {
        const forecast = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);

            forecast.push({
                date: date.toISOString().split('T')[0],
                high: 20 + Math.floor(Math.random() * 8),
                low: 12 + Math.floor(Math.random() * 6),
                condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy'][Math.floor(Math.random() * 4)],
                precipitation: Math.floor(Math.random() * 100),
                humidity: 40 + Math.floor(Math.random() * 40),
                windSpeed: 5 + Math.floor(Math.random() * 20)
            });
        }

        return forecast;
    }

    // Get weather alerts
    getWeatherAlerts(parkId) {
        // Mock alerts
        return [];
    }

    // Get optimal visiting time
    getOptimalTime() {
        return {
            month: 'July',
            season: 'Summer',
            reason: 'Peak season with best weather and trail conditions'
        };
    }

    // Get packing recommendations based on weather
    getPackingRecommendations(weather, tripDays) {
        const recommendations = {
            clothing: [],
            gear: [],
            safety: [],
            other: []
        };

        // Temperature-based recommendations
        const avgTemp = weather.forecast.reduce((sum, day) => sum + day.high, 0) / weather.forecast.length;

        if (avgTemp > 25) {
            recommendations.clothing.push('Light, breathable shirts');
            recommendations.clothing.push('Shorts');
            recommendations.safety.push('Sunscreen SPF 30+');
        } else if (avgTemp > 15) {
            recommendations.clothing.push('Long pants');
            recommendations.clothing.push('Light jacket or sweater');
            recommendations.safety.push('Sunscreen SPF 15+');
        } else {
            recommendations.clothing.push('Warm layers');
            recommendations.clothing.push('Winter jacket');
            recommendations.clothing.push('Hat and gloves');
        }

        // Precipitation-based recommendations
        const rainyDays = weather.forecast.filter(d => d.precipitation > 50).length;

        if (rainyDays > 0) {
            recommendations.gear.push('Rain jacket');
            recommendations.gear.push('Waterproof bag');
            recommendations.gear.push('Quick-dry towels');
        }

        // Duration-based recommendations
        if (tripDays > 1) {
            recommendations.clothing.push(`Extra underwear (${tripDays} pairs)`);
            recommendations.clothing.push('Socks (wool, not cotton)');
        }

        // Universal recommendations
        recommendations.safety.push('First aid kit');
        recommendations.safety.push('Water bottles/hydration system');
        recommendations.safety.push('Headlamp/flashlight');
        recommendations.other.push('Hiking boots (broken in)');
        recommendations.other.push('Map and compass/GPS');
        recommendations.other.push('Snacks and energy bars');
        recommendations.other.push('Bug repellent');

        return recommendations;
    }

    // Create trip plan
    createTripPlan(tripData) {
        const {
            name,
            parkId,
            startDate,
            endDate,
            travelers = 1,
            budget = 0,
            activities = []
        } = tripData;

        const tripPlan = {
            id: 'trip_' + Date.now(),
            name,
            parkId,
            startDate,
            endDate,
            travelers,
            budget,
            activities,
            days: this.calculateDays(startDate, endDate),
            itinerary: [],
            packingList: [],
            createdAt: new Date().toISOString(),
            status: 'planning'
        };

        this.tripPlans.push(tripPlan);
        this.saveTripPlans();

        if (window.gaManager) {
            window.gaManager.trackEvent('trip_plan_created', {
                trip_name: name,
                days: tripPlan.days,
                travelers: travelers
            });
        }

        return tripPlan;
    }

    // Calculate trip duration
    calculateDays(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    }

    // Add to trip itinerary
    addItineraryItem(tripId, item) {
        const trip = this.tripPlans.find(t => t.id === tripId);

        if (!trip) {
            return { success: false, error: 'Trip not found' };
        }

        trip.itinerary.push({
            ...item,
            id: 'item_' + Date.now(),
            timestamp: new Date().toISOString()
        });

        this.saveTripPlans();
        return { success: true };
    }

    // Create packing list
    createPackingList(tripId, recommendations) {
        const packingList = {
            id: 'packing_' + Date.now(),
            tripId,
            categories: {},
            completed: [],
            createdAt: new Date().toISOString()
        };

        // Initialize categories with items
        Object.entries(recommendations).forEach(([category, items]) => {
            packingList.categories[category] = items.map(item => ({
                id: 'item_' + Date.now() + Math.random(),
                name: item,
                packed: false
            }));
        });

        this.packingLists.push(packingList);
        this.savePackingLists();

        return packingList;
    }

    // Mark packing item as packed
    markItemPacked(packingListId, itemId) {
        const packingList = this.packingLists.find(p => p.id === packingListId);

        if (!packingList) {
            return { success: false, error: 'Packing list not found' };
        }

        for (const category of Object.values(packingList.categories)) {
            const item = category.find(i => i.id === itemId);
            if (item) {
                item.packed = true;
                break;
            }
        }

        this.savePackingLists();
        return { success: true };
    }

    // Get packing progress
    getPackingProgress(packingListId) {
        const packingList = this.packingLists.find(p => p.id === packingListId);

        if (!packingList) {
            return null;
        }

        let total = 0;
        let packed = 0;

        Object.values(packingList.categories).forEach(items => {
            total += items.length;
            packed += items.filter(i => i.packed).length;
        });

        return {
            total,
            packed,
            percentage: Math.round((packed / total) * 100)
        };
    }

    // Calculate trip cost
    calculateTripCost(tripData) {
        const {
            parkId,
            nights,
            campsitePrice = 40,
            travelers = 1,
            includeFood = true,
            includeFuel = true
        } = tripData;

        let total = 0;

        // Campsite cost
        total += campsitePrice * nights * travelers;

        // Food estimate ($30/person/day)
        if (includeFood) {
            total += 30 * nights * travelers;
        }

        // Fuel estimate (assume 3 hours drive @ $0.15/km, avg 100km/h = 300km)
        if (includeFuel) {
            total += 300 * 0.15 * 2; // Round trip
        }

        return {
            breakdown: {
                campsite: campsitePrice * nights * travelers,
                food: includeFood ? 30 * nights * travelers : 0,
                fuel: includeFuel ? 300 * 0.15 * 2 : 0
            },
            total: Math.round(total),
            perPerson: Math.round(total / travelers)
        };
    }

    // Get trip recommendations
    getTripRecommendations(preferences = {}) {
        const recommendations = [];

        // Mock trip recommendations
        if (preferences.season === 'summer') {
            recommendations.push({
                title: 'Algonquin Summer Adventure',
                duration: 3,
                difficulty: 'moderate',
                reason: 'Perfect summer weather with all trails open'
            });
        }

        if (preferences.withKids) {
            recommendations.push({
                title: 'Family-Friendly Pinery Park',
                duration: 2,
                difficulty: 'easy',
                reason: 'Beach access and easy trails suitable for kids'
            });
        }

        return recommendations;
    }

    // Share trip plan
    shareTripPlan(tripId) {
        const trip = this.tripPlans.find(t => t.id === tripId);

        if (!trip) {
            return null;
        }

        const shareData = {
            title: trip.name,
            description: `${trip.days}-day trip to ${trip.parkId} with ${trip.travelers} travelers`,
            url: `${window.location.origin}?tripId=${tripId}`
        };

        return shareData;
    }

    // Save trip plans
    saveTripPlans() {
        localStorage.setItem('trip-plans', JSON.stringify(this.tripPlans));
    }

    // Save packing lists
    savePackingLists() {
        localStorage.setItem('packing-lists', JSON.stringify(this.packingLists));
    }

    // Get trip stats
    getTripStats() {
        const stats = {
            totalTrips: this.tripPlans.length,
            totalDays: this.tripPlans.reduce((sum, t) => sum + t.days, 0),
            averageTravelers: Math.round(
                this.tripPlans.reduce((sum, t) => sum + t.travelers, 0) / this.tripPlans.length
            ) || 0,
            totalBudget: this.tripPlans.reduce((sum, t) => sum + t.budget, 0)
        };

        return stats;
    }

    // Render trip card
    renderTripCard(trip, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const startDate = new Date(trip.startDate).toLocaleDateString();
        const endDate = new Date(trip.endDate).toLocaleDateString();

        let html = `
            <div class="trip-card">
                <div class="trip-header">
                    <h3>${trip.name}</h3>
                    <span class="trip-status" data-status="${trip.status}">
                        ${trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                    </span>
                </div>
                <div class="trip-dates">
                    <span>${startDate} - ${endDate}</span>
                    <span>(${trip.days} days)</span>
                </div>
                <div class="trip-details">
                    <span>👥 ${trip.travelers} traveler${trip.travelers > 1 ? 's' : ''}</span>
                    <span>💰 $${trip.budget}</span>
                </div>
                <div class="trip-actions">
                    <button class="btn-primary" onclick="editTrip('${trip.id}')">Edit</button>
                    <button class="btn-secondary" onclick="shareTrip('${trip.id}')">Share</button>
                    <button class="btn-icon" onclick="deleteTrip('${trip.id}')">✕</button>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    // Render weather card
    renderWeatherCard(weather, containerId = 'weather-widget') {
        const container = document.getElementById(containerId);
        if (!container || !weather) return;

        const current = weather.current;
        const today = weather.forecast[0];

        let html = `
            <div class="weather-widget">
                <div class="weather-current">
                    <div class="temperature">${current.temp}°C</div>
                    <div class="condition">${current.condition}</div>
                    <div class="feels-like">Feels like ${current.feelsLike}°C</div>
                </div>
                <div class="weather-details">
                    <div class="detail">
                        <span class="label">Humidity</span>
                        <span class="value">${current.humidity}%</span>
                    </div>
                    <div class="detail">
                        <span class="label">Wind</span>
                        <span class="value">${current.windSpeed} km/h</span>
                    </div>
                    <div class="detail">
                        <span class="label">UV Index</span>
                        <span class="value">${current.uvIndex}</span>
                    </div>
                </div>
                <div class="weather-forecast">
                    <h4>7-Day Forecast</h4>
                    <div class="forecast-items">
                        ${weather.forecast.slice(0, 7).map(day => `
                            <div class="forecast-day">
                                <div class="date">${new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                <div class="temp-range">${day.high}° / ${day.low}°</div>
                                <div class="condition">${day.condition}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    // Render packing checklist
    renderPackingChecklist(packingListId, containerId = 'packing-checklist') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const packingList = this.packingLists.find(p => p.id === packingListId);
        if (!packingList) return;

        const progress = this.getPackingProgress(packingListId);

        let html = `
            <div class="packing-checklist">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${progress.percentage}%"></div>
                    <span class="progress-text">${progress.percentage}% packed</span>
                </div>
        `;

        Object.entries(packingList.categories).forEach(([category, items]) => {
            html += `<div class="packing-category">
                <h3>${category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                <ul class="packing-items">
            `;

            items.forEach(item => {
                const checked = item.packed ? 'checked' : '';
                html += `
                    <li class="packing-item">
                        <input type="checkbox" ${checked} onchange="weatherPlanningManager.markItemPacked('${packingListId}', '${item.id}')">
                        <span>${item.name}</span>
                    </li>
                `;
            });

            html += '</ul></div>';
        });

        html += '</div>';
        container.innerHTML = html;
    }
}

const weatherPlanningManager = new WeatherPlanningManager();
