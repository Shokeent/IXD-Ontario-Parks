// Wildlife & Nature Guide
// Wildlife spotting, nature identification, conservation info

class WildlifeNatureGuide {
    constructor() {
        this.wildlife = this.loadWildlifeData();
        this.plants = this.loadPlantData();
        this.sightings = JSON.parse(localStorage.getItem('wildlife-sightings') || '[]');
        this.userList = JSON.parse(localStorage.getItem('wildlife-list') || '[]');
    }

    loadWildlifeData() {
        return [
            {
                id: 'moose',
                name: 'Moose',
                scientificName: 'Alces alces',
                category: 'mammals',
                parks: ['algonquin-park', 'killarney-park', 'temagami-park'],
                season: ['spring', 'summer', 'fall'],
                bestTime: 'Early morning or dusk near lakes',
                description: 'Ontario\'s largest land mammal, often spotted near water',
                endangered: false,
                tips: 'Keep 100m distance. Never approach or feed.',
                image: '/images/wildlife/moose.jpg',
                rating: 4.9
            },
            {
                id: 'loon',
                name: 'Common Loon',
                scientificName: 'Gavia immer',
                category: 'birds',
                parks: ['algonquin-park', 'killarney-park', 'kawartha-park'],
                season: ['spring', 'summer'],
                bestTime: 'Morning on calm lakes',
                description: 'Ontario\'s iconic bird with haunting call',
                endangered: false,
                tips: 'Listen for calls at dawn and dusk on lakes',
                image: '/images/wildlife/loon.jpg',
                rating: 4.8
            },
            {
                id: 'black-bear',
                name: 'Black Bear',
                scientificName: 'Ursus americanus',
                category: 'mammals',
                parks: ['algonquin-park', 'killarney-park', 'temagami-park'],
                season: ['spring', 'summer', 'fall'],
                bestTime: 'Early morning near berry patches',
                description: 'Common in Ontario parks, usually shy around humans',
                endangered: false,
                tips: 'Store food properly. Make noise while hiking. Never run.',
                image: '/images/wildlife/black-bear.jpg',
                rating: 4.7
            },
            {
                id: 'white-tailed-deer',
                name: 'White-tailed Deer',
                scientificName: 'Odocoileus virginianus',
                category: 'mammals',
                parks: ['algonquin-park', 'pinery-park', 'sandbanks-park'],
                season: ['spring', 'summer', 'fall', 'winter'],
                bestTime: 'Dawn and dusk at forest edges',
                description: 'Elegant and common across Ontario parks',
                endangered: false,
                tips: 'Stay still and quiet for best viewing',
                image: '/images/wildlife/white-tailed-deer.jpg',
                rating: 4.6
            },
            {
                id: 'great-blue-heron',
                name: 'Great Blue Heron',
                scientificName: 'Ardea herodias',
                category: 'birds',
                parks: ['point-pelee-park', 'sandbanks-park', 'bon-echo-park'],
                season: ['spring', 'summer', 'fall'],
                bestTime: 'Shallow water edges any time of day',
                description: 'Tall, elegant wading bird in wetlands and shores',
                endangered: false,
                tips: 'Approach slowly and stay low to avoid startling',
                image: '/images/wildlife/great-blue-heron.jpg',
                rating: 4.8
            },
            {
                id: 'painted-turtle',
                name: 'Painted Turtle',
                scientificName: 'Chrysemys picta',
                category: 'reptiles',
                parks: ['point-pelee-park', 'pinery-park', 'sandbanks-park'],
                season: ['spring', 'summer'],
                bestTime: 'Sunny days on logs near water',
                description: 'Colourful turtle common in Ontario wetlands',
                endangered: false,
                tips: 'Observe from a distance; never remove from habitat',
                image: '/images/wildlife/painted-turtle.jpg',
                rating: 4.5
            },
            {
                id: 'osprey',
                name: 'Osprey',
                scientificName: 'Pandion haliaetus',
                category: 'birds',
                parks: ['algonquin-park', 'kawartha-park', 'bon-echo-park'],
                season: ['spring', 'summer'],
                bestTime: 'Midday hovering over open water',
                description: 'Fish-hunting raptor known for dramatic plunge dives',
                endangered: false,
                tips: 'Scan open water areas; look for nests on tall platforms',
                image: '/images/wildlife/osprey.jpg',
                rating: 4.9
            },
            {
                id: 'beaver',
                name: 'American Beaver',
                scientificName: 'Castor canadensis',
                category: 'mammals',
                parks: ['algonquin-park', 'killarney-park', 'muskoka-park'],
                season: ['spring', 'summer', 'fall'],
                bestTime: 'Evening near dams and lodges',
                description: 'Canada\'s national animal and expert ecosystem engineer',
                endangered: false,
                tips: 'Look for lodges and dams; visit at dusk for activity',
                image: '/images/wildlife/beaver.jpg',
                rating: 4.7
            }
        ];
    }

    loadPlantData() {
        return [
            {
                id: 'trillium',
                name: 'White Trillium',
                scientificName: 'Trillium grandiflorum',
                category: 'wildflowers',
                parks: ['algonquin-park', 'bon-echo-park'],
                season: ['spring'],
                description: 'Ontario\'s official flower; blooms May-June',
                edible: false,
                protected: true,
                tips: 'Never pick — protected by law in Ontario'
            },
            {
                id: 'wild-blueberry',
                name: 'Wild Blueberry',
                scientificName: 'Vaccinium angustifolium',
                category: 'berries',
                parks: ['algonquin-park', 'killarney-park', 'temagami-park'],
                season: ['summer'],
                description: 'Sweet wild berries ripe July-August',
                edible: true,
                protected: false,
                tips: 'Pick only what you can eat; share with wildlife'
            },
            {
                id: 'pitcher-plant',
                name: 'Pitcher Plant',
                scientificName: 'Sarracenia purpurea',
                category: 'carnivorous',
                parks: ['algonquin-park', 'temagami-park'],
                season: ['summer'],
                description: 'Carnivorous bog plant that traps insects',
                edible: false,
                protected: true,
                tips: 'Found in boggy areas; do not disturb'
            }
        ];
    }

    // Get wildlife by park
    getWildlifeByPark(parkId) {
        return this.wildlife.filter(w => w.parks.includes(parkId));
    }

    // Get wildlife by category
    getWildlifeByCategory(category) {
        return this.wildlife.filter(w => w.category === category);
    }

    // Get current season wildlife
    getCurrentSeasonWildlife(parkId) {
        const month = new Date().getMonth();
        let season;
        if (month < 3) season = 'winter';
        else if (month < 6) season = 'spring';
        else if (month < 9) season = 'summer';
        else season = 'fall';

        return this.getWildlifeByPark(parkId).filter(w => w.season.includes(season));
    }

    // Log sighting
    logSighting(wildlifeId, parkId, notes = '') {
        const sighting = {
            id: 'sighting_' + Date.now(),
            wildlifeId,
            parkId,
            notes,
            timestamp: new Date().toISOString(),
            location: null
        };

        this.sightings.push(sighting);
        localStorage.setItem('wildlife-sightings', JSON.stringify(this.sightings));

        if (!this.userList.includes(wildlifeId)) {
            this.userList.push(wildlifeId);
            localStorage.setItem('wildlife-list', JSON.stringify(this.userList));
        }

        if (window.gaManager) {
            window.gaManager.trackEvent('wildlife_sighted', { wildlife_id: wildlifeId, park_id: parkId });
        }

        return sighting;
    }

    // Get user sightings
    getUserSightings() {
        return this.sightings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }

    // Get species list completeness
    getLifeListProgress() {
        return {
            spotted: this.userList.length,
            total: this.wildlife.length,
            percentage: Math.round((this.userList.length / this.wildlife.length) * 100),
            remaining: this.wildlife.filter(w => !this.userList.includes(w.id))
        };
    }

    // Get categories
    getCategories() {
        return [...new Set(this.wildlife.map(w => w.category))];
    }

    // Render wildlife guide
    renderWildlifeGuide(parkId, containerId = 'wildlife-guide') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const wildlife = parkId ? this.getCurrentSeasonWildlife(parkId) : this.wildlife;

        let html = '<div class="wildlife-grid">';

        wildlife.forEach(animal => {
            const spotted = this.userList.includes(animal.id);

            html += `
                <div class="wildlife-card ${spotted ? 'spotted' : ''}">
                    <div class="wildlife-image">
                        <img src="${animal.image}" alt="${animal.name}">
                        ${spotted ? '<span class="spotted-badge">✓ Spotted</span>' : ''}
                    </div>
                    <div class="wildlife-info">
                        <h3>${animal.name}</h3>
                        <p class="scientific-name">${animal.scientificName}</p>
                        <p>${animal.description}</p>
                        <div class="wildlife-meta">
                            <span>🕐 ${animal.bestTime}</span>
                        </div>
                        <div class="wildlife-tip">
                            <strong>Tip:</strong> ${animal.tips}
                        </div>
                    </div>
                    <button class="btn-sm ${spotted ? 'btn-secondary' : 'btn-primary'}"
                            onclick="wildlifeNatureGuide.logSighting('${animal.id}', '${parkId || ''}')">
                        ${spotted ? 'Spotted Again' : 'Log Sighting'}
                    </button>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }
}

const wildlifeNatureGuide = new WildlifeNatureGuide();
