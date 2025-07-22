// Ontario Parks Data API Integration
// This module handles all API interactions for parks data

class OntarioParksAPI {
    constructor() {
        this.baseURL = 'https://data.ontario.ca/api/3/action';
        this.parksDatasetId = 'ceba4013-eff0-4c9f-b92b-63c4c3a9e3f0'; // Ontario Parks dataset
        this.cache = new Map();
        this.cacheExpiry = 30 * 60 * 1000; // 30 minutes
    }

    // Generic API call wrapper with error handling
    async makeAPICall(url, options = {}) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    }

    // Check cache validity
    isCacheValid(key) {
        const cached = this.cache.get(key);
        if (!cached) return false;
        return Date.now() - cached.timestamp < this.cacheExpiry;
    }

    // Get cached data or fetch new data
    async getCachedOrFetch(key, fetchFunction) {
        if (this.isCacheValid(key)) {
            return this.cache.get(key).data;
        }

        try {
            const data = await fetchFunction();
            this.cache.set(key, {
                data,
                timestamp: Date.now()
            });
            return data;
        } catch (error) {
            // Return cached data if available, even if expired
            const cached = this.cache.get(key);
            if (cached) {
                console.warn('Using expired cache due to API error:', error);
                return cached.data;
            }
            throw error;
        }
    }

    // Fetch all Ontario Parks data
    async getAllParks() {
        return this.getCachedOrFetch('all-parks', async () => {
            const url = `${this.baseURL}/datastore_search?resource_id=${this.parksDatasetId}&limit=1000`;
            const response = await this.makeAPICall(url);
            
            if (response.success && response.result && response.result.records) {
                return this.processParksData(response.result.records);
            }
            
            // Fallback to mock data if API fails
            return this.getMockParksData();
        });
    }

    // Process raw parks data from API
    processParksData(rawData) {
        return rawData.map(park => ({
            id: park._id || Math.random().toString(36).substr(2, 9),
            name: park['Park Name'] || park.name || 'Unknown Park',
            region: park.Region || park.region || 'Ontario',
            description: park.Description || park.description || 'Experience the natural beauty of Ontario.',
            activities: this.parseActivities(park.Activities || park.activities || ''),
            amenities: this.parseAmenities(park.Amenities || park.amenities || ''),
            image: this.getDefaultParkImage(park.name),
            difficulty: this.calculateDifficulty(park),
            coordinates: {
                lat: parseFloat(park.Latitude) || 44.2619,
                lng: parseFloat(park.Longitude) || -78.2624
            },
            campgrounds: park.Campgrounds || 3,
            maxOccupancy: park['Max Occupancy'] || 6,
            pets: park['Pets Allowed'] !== 'No',
            accessibility: park.Accessibility === 'Yes',
            pricing: {
                tent: parseFloat(park['Tent Site Price']) || 35,
                rv: parseFloat(park['RV Site Price']) || 45,
                cabin: parseFloat(park['Cabin Price']) || 120
            },
            season: {
                open: park['Season Open'] || 'May 1',
                close: park['Season Close'] || 'October 31'
            },
            contact: {
                phone: park.Phone || '1-888-ONT-PARK',
                email: park.Email || 'info@ontarioparks.com'
            }
        }));
    }

    // Parse activities string into array
    parseActivities(activitiesStr) {
        if (!activitiesStr) return ['Hiking', 'Photography'];
        return activitiesStr.split(',')
            .map(activity => activity.trim())
            .filter(activity => activity.length > 0);
    }

    // Parse amenities string into array
    parseAmenities(amenitiesStr) {
        if (!amenitiesStr) return ['Restrooms', 'Picnic Areas'];
        return amenitiesStr.split(',')
            .map(amenity => amenity.trim())
            .filter(amenity => amenity.length > 0);
    }

    // Calculate difficulty based on activities and amenities
    calculateDifficulty(park) {
        const activities = park.Activities || '';
        const rugged = activities.toLowerCase().includes('backcountry') || 
                      activities.toLowerCase().includes('wilderness');
        return rugged ? 'Advanced' : 'Beginner';
    }

    // Get default park image using real park images with optimization
    getDefaultParkImage(parkName, width = 800, height = 500) {
        let imageSrc;
        
        // Check if we have a specific image for this park
        if (window.PARK_IMAGES && window.PARK_IMAGES[parkName]) {
            imageSrc = window.PARK_IMAGES[parkName].main;
        } else if (window.FALLBACK_IMAGES && window.FALLBACK_IMAGES.length > 0) {
            // Use fallback images for unknown parks
            const hash = this.simpleHash(parkName || 'park');
            imageSrc = window.FALLBACK_IMAGES[hash % window.FALLBACK_IMAGES.length];
        } else {
            // Ultimate fallback to placeholder if image config not loaded
            const hash = this.simpleHash(parkName || 'park');
            const colors = ['4f46e5', '059669', 'dc2626', 'ea580c', '7c3aed'];
            const color = colors[hash % colors.length];
            return `https://via.placeholder.com/400x250/${color}/ffffff?text=${encodeURIComponent(parkName || 'Park')}`;
        }
        
        // Optimize the image URL if image manager is available
        if (window.imageManager) {
            return window.imageManager.getOptimizedImageUrl(imageSrc, width, height);
        }
        
        return imageSrc;
    }

    // Get park gallery images
    getParkGallery(parkName) {
        if (window.PARK_IMAGES && window.PARK_IMAGES[parkName] && window.PARK_IMAGES[parkName].gallery) {
            return window.PARK_IMAGES[parkName].gallery;
        }
        
        // Return main image as single gallery item
        return [this.getDefaultParkImage(parkName)];
    }

    // Get hero image for park
    getParkHeroImage(parkName) {
        if (window.PARK_IMAGES && window.PARK_IMAGES[parkName] && window.PARK_IMAGES[parkName].hero) {
            return window.PARK_IMAGES[parkName].hero;
        }
        
        // Fallback to main image
        return this.getDefaultParkImage(parkName);
    }

    // Simple hash function for consistent colors
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }

    // Search parks by various criteria
    async searchParks(criteria = {}) {
        const allParks = await this.getAllParks();
        
        return allParks.filter(park => {
            // Name search
            if (criteria.name && !park.name.toLowerCase().includes(criteria.name.toLowerCase())) {
                return false;
            }

            // Region filter
            if (criteria.region && park.region !== criteria.region) {
                return false;
            }

            // Activity filter
            if (criteria.activity && !park.activities.some(activity => 
                activity.toLowerCase().includes(criteria.activity.toLowerCase()))) {
                return false;
            }

            // Amenity filter
            if (criteria.amenity && !park.amenities.some(amenity => 
                amenity.toLowerCase().includes(criteria.amenity.toLowerCase()))) {
                return false;
            }

            // Difficulty filter
            if (criteria.difficulty && park.difficulty !== criteria.difficulty) {
                return false;
            }

            // Pet-friendly filter
            if (criteria.pets === true && !park.pets) {
                return false;
            }

            // Accessibility filter
            if (criteria.accessibility === true && !park.accessibility) {
                return false;
            }

            return true;
        });
    }

    // Get park by ID
    async getParkById(id) {
        const allParks = await this.getAllParks();
        return allParks.find(park => park.id === id);
    }

    // Get featured parks for homepage
    async getFeaturedParks(limit = 6) {
        const allParks = await this.getAllParks();
        
        // Sort by beginner-friendly criteria and get top parks
        const featuredParks = allParks
            .filter(park => park.difficulty === 'Beginner')
            .sort((a, b) => {
                // Prioritize parks with more amenities
                return b.amenities.length - a.amenities.length;
            })
            .slice(0, limit);

        return featuredParks;
    }

    // Get parks by region
    async getParksByRegion(region) {
        const allParks = await this.getAllParks();
        return allParks.filter(park => park.region === region);
    }

    // Get unique regions
    async getRegions() {
        const allParks = await this.getAllParks();
        const regions = [...new Set(allParks.map(park => park.region))];
        return regions.sort();
    }

    // Get unique activities
    async getActivities() {
        const allParks = await this.getAllParks();
        const activities = [...new Set(allParks.flatMap(park => park.activities))];
        return activities.sort();
    }

    // Get unique amenities
    async getAmenities() {
        const allParks = await this.getAllParks();
        const amenities = [...new Set(allParks.flatMap(park => park.amenities))];
        return amenities.sort();
    }

    // Mock data fallback
    getMockParksData() {
        return [
            {
                id: 'algonquin-park',
                name: 'Algonquin Provincial Park',
                region: 'Central Ontario',
                description: 'Canada\'s oldest provincial park offering pristine wilderness, canoe routes, and wildlife viewing opportunities.',
                activities: ['Canoeing', 'Hiking', 'Wildlife Viewing', 'Photography', 'Fishing'],
                amenities: ['Visitor Centre', 'Canoe Rentals', 'Gift Shop', 'Restrooms', 'Picnic Areas'],
                image: 'https://via.placeholder.com/400x250/059669/ffffff?text=Algonquin+Park',
                difficulty: 'Beginner',
                coordinates: { lat: 45.5598, lng: -78.3566 },
                campgrounds: 8,
                maxOccupancy: 6,
                pets: true,
                accessibility: true,
                pricing: { tent: 42, rv: 52, cabin: 150 },
                season: { open: 'May 1', close: 'October 31' },
                contact: { phone: '705-633-5572', email: 'algonquin@ontarioparks.com' }
            },
            {
                id: 'killarney-park',
                name: 'Killarney Provincial Park',
                region: 'Northern Ontario',
                description: 'Famous for its stunning white quartzite ridges, pink granite shores, and crystal-clear lakes.',
                activities: ['Hiking', 'Canoeing', 'Rock Climbing', 'Photography', 'Swimming'],
                amenities: ['Boat Launch', 'Hiking Trails', 'Restrooms', 'Picnic Areas', 'Fire Pits'],
                image: 'https://via.placeholder.com/400x250/4f46e5/ffffff?text=Killarney+Park',
                difficulty: 'Advanced',
                coordinates: { lat: 46.0122, lng: -81.4042 },
                campgrounds: 6,
                maxOccupancy: 8,
                pets: true,
                accessibility: false,
                pricing: { tent: 38, rv: 48, cabin: 135 },
                season: { open: 'May 15', close: 'October 15' },
                contact: { phone: '705-287-2900', email: 'killarney@ontarioparks.com' }
            },
            {
                id: 'sandbanks-park',
                name: 'Sandbanks Provincial Park',
                region: 'Eastern Ontario',
                description: 'Home to the world\'s largest baymouth barrier dune formation and pristine sandy beaches.',
                activities: ['Swimming', 'Beach Activities', 'Hiking', 'Cycling', 'Bird Watching'],
                amenities: ['Beach Access', 'Swimming Areas', 'Bike Rentals', 'Restrooms', 'Snack Bar'],
                image: 'https://via.placeholder.com/400x250/ea580c/ffffff?text=Sandbanks+Park',
                difficulty: 'Beginner',
                coordinates: { lat: 43.9056, lng: -77.2372 },
                campgrounds: 4,
                maxOccupancy: 6,
                pets: true,
                accessibility: true,
                pricing: { tent: 45, rv: 55, cabin: 165 },
                season: { open: 'April 15', close: 'November 1' },
                contact: { phone: '613-393-3319', email: 'sandbanks@ontarioparks.com' }
            },
            {
                id: 'bruce-peninsula-park',
                name: 'Bruce Peninsula National Park',
                region: 'Central Ontario',
                description: 'Rugged cliffs, ancient cedar forests, and crystal-clear Georgian Bay waters featuring the famous Bruce Trail.',
                activities: ['Hiking', 'Swimming', 'Snorkeling', 'Photography', 'Bird Watching'],
                amenities: ['Bruce Trail', 'Cliff Views', 'Visitor Centre', 'Restrooms', 'Parking'],
                image: 'https://via.placeholder.com/400x250/16a34a/ffffff?text=Bruce+Peninsula',
                difficulty: 'Intermediate',
                coordinates: { lat: 45.2352, lng: -81.5314 },
                campgrounds: 3,
                maxOccupancy: 6,
                pets: true,
                accessibility: false,
                pricing: { tent: 55, rv: 65, cabin: 180 },
                season: { open: 'May 1', close: 'October 15' },
                contact: { phone: '519-596-2233', email: 'bruce@pc.gc.ca' }
            },
            {
                id: 'bon-echo-park',
                name: 'Bon Echo Provincial Park',
                region: 'Eastern Ontario',
                description: 'Famous for its massive cliff rising from Mazinaw Lake and ancient pictographs created by Indigenous peoples.',
                activities: ['Hiking', 'Swimming', 'Canoeing', 'Photography', 'Pictograph Viewing'],
                amenities: ['Cliff Views', 'Pictographs', 'Lake Access', 'Boat Launch', 'Hiking Trails'],
                image: 'https://via.placeholder.com/400x250/7c3aed/ffffff?text=Bon+Echo',
                difficulty: 'Intermediate',
                coordinates: { lat: 44.9186, lng: -77.2011 },
                campgrounds: 4,
                maxOccupancy: 8,
                pets: true,
                accessibility: true,
                pricing: { tent: 48, rv: 58, cabin: 170 },
                season: { open: 'May 1', close: 'October 31' },
                contact: { phone: '613-336-2228', email: 'bonecho@ontarioparks.com' }
            },
            {
                id: 'muskoka-river-park',
                name: 'Muskoka River Provincial Park',
                region: 'Central Ontario',
                description: 'Perfect for families with gentle rapids and beautiful Muskoka scenery featuring calm waters ideal for beginner canoeists.',
                activities: ['Canoeing', 'Fishing', 'Camping', 'Swimming', 'Family Activities'],
                amenities: ['Gentle Rapids', 'Family Friendly', 'Canoe Launch', 'Picnic Areas', 'Fishing Spots'],
                image: 'https://via.placeholder.com/400x250/0891b2/ffffff?text=Muskoka+River',
                difficulty: 'Beginner',
                coordinates: { lat: 45.0356, lng: -79.3025 },
                campgrounds: 3,
                maxOccupancy: 8,
                pets: true,
                accessibility: true,
                pricing: { tent: 38, rv: 48, cabin: 140 },
                season: { open: 'May 15', close: 'September 30' },
                contact: { phone: '705-645-2393', email: 'muskoka@ontarioparks.com' }
            },
            {
                id: 'pinery-park',
                name: 'Pinery Provincial Park',
                region: 'Southwestern Ontario',
                description: 'Rare oak savanna and wetland ecosystem with 10km of sandy Lake Huron shoreline and diverse bird species.',
                activities: ['Swimming', 'Hiking', 'Cycling', 'Bird Watching', 'Beach Activities'],
                amenities: ['Lake Huron', 'Oak Savanna', 'Beach Access', 'Cycling Trails', 'Nature Centre'],
                image: 'https://via.placeholder.com/400x250/dc2626/ffffff?text=Pinery+Park',
                difficulty: 'Beginner',
                coordinates: { lat: 43.2583, lng: -81.8375 },
                campgrounds: 4,
                maxOccupancy: 6,
                pets: true,
                accessibility: true,
                pricing: { tent: 44, rv: 54, cabin: 160 },
                season: { open: 'April 1', close: 'November 15' },
                contact: { phone: '519-243-2220', email: 'pinery@ontarioparks.com' }
            },
            {
                id: 'kawartha-highlands-park',
                name: 'Kawartha Highlands Provincial Park',
                region: 'Central Ontario',
                description: 'Rugged wilderness park featuring ancient granite ridges, pristine lakes, and extensive backcountry camping opportunities.',
                activities: ['Hiking', 'Canoeing', 'Camping', 'Fishing', 'Backcountry'],
                amenities: ['Backcountry', 'Granite Ridges', 'Wilderness', 'Canoe Routes', 'Remote Camping'],
                image: 'https://via.placeholder.com/400x250/854d0e/ffffff?text=Kawartha+Highlands',
                difficulty: 'Advanced',
                coordinates: { lat: 44.8667, lng: -78.2833 },
                campgrounds: 2,
                maxOccupancy: 4,
                pets: false,
                accessibility: false,
                pricing: { tent: 40, rv: 50, cabin: 130 },
                season: { open: 'May 15', close: 'October 1' },
                contact: { phone: '705-457-1680', email: 'kawartha@ontarioparks.com' }
            }
        ];
    }

    // Weather API integration for parks
    async getWeatherForPark(parkId) {
        try {
            const park = await this.getParkById(parkId);
            if (!park || !park.coordinates) {
                throw new Error('Park coordinates not available');
            }

            // Using OpenWeatherMap API (requires API key)
            const weatherAPI = 'https://api.openweathermap.org/data/2.5/weather';
            const apiKey = 'YOUR_OPENWEATHER_API_KEY'; // Replace with actual API key
            
            if (apiKey === 'YOUR_OPENWEATHER_API_KEY') {
                // Return mock weather data if no API key
                return this.getMockWeatherData();
            }

            const url = `${weatherAPI}?lat=${park.coordinates.lat}&lon=${park.coordinates.lng}&appid=${apiKey}&units=metric`;
            const response = await this.makeAPICall(url);
            
            return {
                temperature: Math.round(response.main.temp),
                description: response.weather[0].description,
                humidity: response.main.humidity,
                windSpeed: response.wind.speed,
                icon: response.weather[0].icon
            };
        } catch (error) {
            console.warn('Weather API failed, using mock data:', error);
            return this.getMockWeatherData();
        }
    }

    // Mock weather data fallback
    getMockWeatherData() {
        const conditions = [
            { temp: 22, desc: 'Partly cloudy', humidity: 65, wind: 5.2, icon: '02d' },
            { temp: 18, desc: 'Light rain', humidity: 80, wind: 8.1, icon: '10d' },
            { temp: 25, desc: 'Sunny', humidity: 45, wind: 3.5, icon: '01d' }
        ];
        
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        return {
            temperature: condition.temp,
            description: condition.desc,
            humidity: condition.humidity,
            windSpeed: condition.wind,
            icon: condition.icon
        };
    }
}

// Create global instance
window.ontarioParksAPI = new OntarioParksAPI();

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OntarioParksAPI;
}
