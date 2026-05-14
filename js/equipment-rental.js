// Equipment Rental Manager
// Camping gear, outdoor equipment rental with inventory tracking

class EquipmentRentalManager {
    constructor() {
        this.equipment = this.loadEquipment();
        this.rentals = JSON.parse(localStorage.getItem('equipment-rentals') || '[]');
        this.inventory = this.initializeInventory();
    }

    // Load equipment catalog
    loadEquipment() {
        return {
            'tent-2p': {
                id: 'tent-2p',
                name: '2-Person Tent',
                category: 'shelter',
                pricePerDay: 25,
                description: 'Lightweight 2-person camping tent with rainfly',
                specs: { capacity: 2, weight: 2.5, season: 'summer' },
                image: '/images/tent-2p.jpg',
                rating: 4.8,
                reviews: 142
            },
            'tent-4p': {
                id: 'tent-4p',
                name: '4-Person Tent',
                category: 'shelter',
                pricePerDay: 40,
                description: 'Roomy 4-person family camping tent',
                specs: { capacity: 4, weight: 4.2, season: 'summer' },
                image: '/images/tent-4p.jpg',
                rating: 4.7,
                reviews: 98
            },
            'sleeping-bag-summer': {
                id: 'sleeping-bag-summer',
                name: 'Summer Sleeping Bag',
                category: 'bedding',
                pricePerDay: 12,
                description: 'Lightweight sleeping bag rated for summer camping',
                specs: { tempRange: '5-25°C', weight: 1.2, filling: 'synthetic' },
                image: '/images/sleeping-bag.jpg',
                rating: 4.6,
                reviews: 256
            },
            'sleeping-bag-winter': {
                id: 'sleeping-bag-winter',
                name: 'Winter Sleeping Bag',
                category: 'bedding',
                pricePerDay: 20,
                description: 'Heavy-duty winter sleeping bag for cold weather',
                specs: { tempRange: '-10-5°C', weight: 2.5, filling: 'down' },
                image: '/images/sleeping-bag-winter.jpg',
                rating: 4.9,
                reviews: 87
            },
            'sleeping-pad': {
                id: 'sleeping-pad',
                name: 'Sleeping Pad',
                category: 'bedding',
                pricePerDay: 8,
                description: 'Inflatable sleeping pad for insulation and comfort',
                specs: { rValue: 4.5, weight: 0.8, material: 'foam' },
                image: '/images/sleeping-pad.jpg',
                rating: 4.5,
                reviews: 189
            },
            'backpack-50l': {
                id: 'backpack-50l',
                name: '50L Backpack',
                category: 'bags',
                pricePerDay: 15,
                description: 'Large capacity hiking backpack for multi-day trips',
                specs: { capacity: 50, weight: 2.0, compartments: 3 },
                image: '/images/backpack-50l.jpg',
                rating: 4.7,
                reviews: 203
            },
            'daypack-25l': {
                id: 'daypack-25l',
                name: '25L Day Pack',
                category: 'bags',
                pricePerDay: 10,
                description: 'Lightweight day pack for hiking and exploration',
                specs: { capacity: 25, weight: 0.8, compartments: 2 },
                image: '/images/daypack-25l.jpg',
                rating: 4.8,
                reviews: 312
            },
            'camping-stove': {
                id: 'camping-stove',
                name: 'Portable Camping Stove',
                category: 'cooking',
                pricePerDay: 10,
                description: 'Lightweight camping stove with fuel canister',
                specs: { fuel: 'propane', cookTime: 'fast', weight: 0.5 },
                image: '/images/camping-stove.jpg',
                rating: 4.6,
                reviews: 145
            },
            'cookware-set': {
                id: 'cookware-set',
                name: 'Camping Cookware Set',
                category: 'cooking',
                pricePerDay: 8,
                description: 'Complete cookware set: pots, pans, utensils',
                specs: { pieces: 8, weight: 1.5, material: 'aluminum' },
                image: '/images/cookware-set.jpg',
                rating: 4.7,
                reviews: 176
            },
            'lantern-led': {
                id: 'lantern-led',
                name: 'LED Lantern',
                category: 'lighting',
                pricePerDay: 5,
                description: 'Bright LED lantern with battery included',
                specs: { brightness: 500, battery: '8h', weight: 0.4 },
                image: '/images/lantern-led.jpg',
                rating: 4.8,
                reviews: 289
            },
            'headlamp': {
                id: 'headlamp',
                name: 'LED Headlamp',
                category: 'lighting',
                pricePerDay: 6,
                description: 'Hands-free LED headlamp for night activities',
                specs: { brightness: 300, battery: '10h', weight: 0.15 },
                image: '/images/headlamp.jpg',
                rating: 4.9,
                reviews: 421
            },
            'water-filter': {
                id: 'water-filter',
                name: 'Portable Water Filter',
                category: 'hydration',
                pricePerDay: 7,
                description: 'Removes bacteria and protozoa from water',
                specs: { capacity: 1000, liters: 2, weight: 0.3 },
                image: '/images/water-filter.jpg',
                rating: 4.7,
                reviews: 234
            },
            'water-bottle': {
                id: 'water-bottle',
                name: 'Insulated Water Bottle',
                category: 'hydration',
                pricePerDay: 4,
                description: '1L insulated water bottle keeps drinks cold',
                specs: { capacity: 1000, insulation: 'double-wall', weight: 0.5 },
                image: '/images/water-bottle.jpg',
                rating: 4.6,
                reviews: 567
            },
            'first-aid-kit': {
                id: 'first-aid-kit',
                name: 'Comprehensive First Aid Kit',
                category: 'safety',
                pricePerDay: 8,
                description: 'Complete first aid kit for outdoor emergencies',
                specs: { items: 85, weight: 0.8, waterproof: true },
                image: '/images/first-aid-kit.jpg',
                rating: 4.9,
                reviews: 198
            },
            'emergency-whistle': {
                id: 'emergency-whistle',
                name: 'Emergency Whistle',
                category: 'safety',
                pricePerDay: 2,
                description: 'Loud emergency whistle for signaling help',
                specs: { decibels: 120, weight: 0.05 },
                image: '/images/emergency-whistle.jpg',
                rating: 4.8,
                reviews: 89
            }
        };
    }

    // Initialize inventory
    initializeInventory() {
        const inventory = {};

        Object.keys(this.equipment).forEach(itemId => {
            inventory[itemId] = {
                total: 50,
                available: 50,
                reserved: 0,
                rented: 0
            };
        });

        return inventory;
    }

    // Get equipment by category
    getEquipmentByCategory(category) {
        return Object.values(this.equipment).filter(item => item.category === category);
    }

    // Get all categories
    getCategories() {
        const categories = new Set();
        Object.values(this.equipment).forEach(item => {
            categories.add(item.category);
        });

        return Array.from(categories).sort();
    }

    // Check availability
    checkAvailability(itemId, startDate, endDate) {
        const item = this.equipment[itemId];
        const itemInventory = this.inventory[itemId];

        if (!item || !itemInventory) {
            return { available: false, reason: 'Item not found' };
        }

        const conflictingRentals = this.rentals.filter(r => {
            return r.itemId === itemId &&
                   r.status === 'active' &&
                   new Date(r.startDate) < new Date(endDate) &&
                   new Date(r.endDate) > new Date(startDate);
        });

        const availableCount = itemInventory.available - conflictingRentals.length;

        return {
            available: availableCount > 0,
            availableCount,
            totalCount: itemInventory.total,
            occupancyRate: ((itemInventory.total - availableCount) / itemInventory.total) * 100
        };
    }

    // Create rental
    createRental(userId, itemId, startDate, endDate) {
        const availability = this.checkAvailability(itemId, startDate, endDate);

        if (!availability.available) {
            return { success: false, error: 'Item not available for dates' };
        }

        const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
        const item = this.equipment[itemId];
        const totalCost = item.pricePerDay * days;

        const rental = {
            id: 'rental_' + Date.now(),
            userId,
            itemId,
            itemName: item.name,
            startDate,
            endDate,
            days,
            totalCost,
            status: 'active',
            createdAt: new Date().toISOString(),
            pickupLocation: null,
            returnLocation: null,
            condition: 'new'
        };

        this.rentals.push(rental);
        this.saveRentals();

        if (window.gaManager) {
            window.gaManager.trackEvent('equipment_rented', {
                item_id: itemId,
                item_name: item.name,
                days: days,
                cost: totalCost
            });
        }

        return { success: true, rental };
    }

    // Return rental
    returnRental(rentalId, condition = 'good') {
        const rental = this.rentals.find(r => r.id === rentalId);

        if (!rental) {
            return { success: false, error: 'Rental not found' };
        }

        rental.status = 'returned';
        rental.returnedAt = new Date().toISOString();
        rental.condition = condition;

        // Calculate damage fee if necessary
        let damageFee = 0;
        if (condition === 'damaged') {
            damageFee = rental.totalCost * 0.25;
        } else if (condition === 'lost') {
            damageFee = rental.totalCost * 2;
        }

        rental.damageFee = damageFee;
        rental.finalCost = rental.totalCost + damageFee;

        this.saveRentals();

        return { success: true, rental, damageFee };
    }

    // Get user rentals
    getUserRentals(userId) {
        return this.rentals.filter(r => r.userId === userId);
    }

    // Get rental cost
    calculateRentalCost(itemId, days) {
        const item = this.equipment[itemId];
        if (!item) return 0;

        let totalCost = item.pricePerDay * days;

        // Apply discounts for longer rentals
        if (days >= 7) totalCost *= 0.9; // 10% off
        if (days >= 14) totalCost *= 0.85; // 15% off
        if (days >= 30) totalCost *= 0.8; // 20% off

        return Math.round(totalCost);
    }

    // Get equipment deals
    getEquipmentDeals() {
        return [
            {
                itemId: 'tent-2p',
                discount: 15,
                reason: 'Weekend special',
                validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
                itemId: 'sleeping-bag-summer',
                discount: 10,
                reason: 'Bundle with tent',
                validUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
            }
        ];
    }

    // Recommend equipment bundles
    getEquipmentBundles() {
        return [
            {
                id: 'bundle-backpacker',
                name: 'Backpacker Bundle',
                description: 'Everything for a week-long backpacking trip',
                items: ['tent-2p', 'sleeping-bag-summer', 'backpack-50l', 'camping-stove', 'cookware-set'],
                regularPrice: 150,
                bundlePrice: 120,
                savings: 30
            },
            {
                id: 'bundle-family',
                name: 'Family Camping Bundle',
                description: 'Complete setup for family of 4',
                items: ['tent-4p', 'sleeping-bag-summer', 'sleeping-pad', 'camping-stove', 'lantern-led', 'first-aid-kit'],
                regularPrice: 120,
                bundlePrice: 95,
                savings: 25
            },
            {
                id: 'bundle-daytrip',
                name: 'Day Trip Essentials',
                description: 'Pack for a day hike',
                items: ['daypack-25l', 'water-filter', 'water-bottle', 'headlamp'],
                regularPrice: 27,
                bundlePrice: 20,
                savings: 7
            }
        ];
    }

    // Render equipment catalog
    renderEquipmentCatalog(containerId = 'equipment-catalog', category = null) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let equipment = Object.values(this.equipment);

        if (category) {
            equipment = equipment.filter(item => item.category === category);
        }

        equipment = equipment.sort((a, b) => b.reviews - a.reviews);

        let html = '<div class="equipment-grid">';

        equipment.forEach(item => {
            const availability = this.checkAvailability(item.id, new Date().toISOString(),
                                                       new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());

            html += `
                <div class="equipment-card">
                    <div class="equipment-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="equipment-info">
                        <h3>${item.name}</h3>
                        <p class="equipment-description">${item.description}</p>
                        <div class="equipment-specs">
                            ${Object.entries(item.specs).map(([key, value]) => `
                                <span class="spec">${key}: ${value}</span>
                            `).join('')}
                        </div>
                        <div class="equipment-rating">
                            <span class="stars">${'★'.repeat(Math.round(item.rating))}${'☆'.repeat(5 - Math.round(item.rating))}</span>
                            <span class="review-count">${item.reviews} reviews</span>
                        </div>
                    </div>
                    <div class="equipment-footer">
                        <div class="equipment-price">
                            $${item.pricePerDay}<span>/day</span>
                        </div>
                        <div class="equipment-availability ${availability.available ? 'available' : 'unavailable'}">
                            ${availability.availableCount}/${availability.totalCount} available
                        </div>
                        <button class="btn-primary" onclick="equipmentRentalManager.startRentalFlow('${item.id}')">
                            Rent Now
                        </button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    // Save rentals
    saveRentals() {
        localStorage.setItem('equipment-rentals', JSON.stringify(this.rentals));
    }

    // Get rental history
    getRentalHistory(userId) {
        return this.getUserRentals(userId)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Get equipment stats
    getEquipmentStats() {
        return {
            totalItems: Object.keys(this.equipment).length,
            categories: this.getCategories().length,
            totalRentals: this.rentals.length,
            activeRentals: this.rentals.filter(r => r.status === 'active').length,
            averageRating: (Object.values(this.equipment)
                .reduce((sum, item) => sum + item.rating, 0) / Object.keys(this.equipment).length).toFixed(1)
        };
    }

    // Start rental flow
    startRentalFlow(itemId) {
        const item = this.equipment[itemId];

        const daysStr = window.prompt(
            `How many days would you like to rent the ${item.name}?\n$${item.pricePerDay}/day`,
            '3'
        );
        if (!daysStr) return;

        const days = Math.max(1, parseInt(daysStr, 10) || 1);
        const totalCost = this.calculateRentalCost(itemId, days);

        localStorage.setItem('pending_rental', JSON.stringify({
            type: 'rental',
            itemId: item.id,
            itemName: item.name,
            pricePerDay: item.pricePerDay,
            days,
            totalCost
        }));

        if (window.gaManager) {
            window.gaManager.trackEvent('equipment_rental_started', {
                item_id: itemId,
                item_name: item.name,
                days,
                cost: totalCost
            });
        }

        if (typeof showNotification === 'function') {
            showNotification(`${item.name} added for ${days} day${days > 1 ? 's' : ''} — $${totalCost}. Redirecting to cart…`, 'success');
        }
        setTimeout(() => { window.location.href = 'shopping-cart.html'; }, 1200);
    }
}

const equipmentRentalManager = new EquipmentRentalManager();
