// Backend API Integration Layer
// Handles all API calls and mock data for development

class BackendAPIClient {
    constructor(baseUrl = null) {
        this.baseUrl = baseUrl || localStorage.getItem('api_base_url') || 'https://api.ontarioparks.com';
        this.mockMode = localStorage.getItem('api_mock_mode') === 'true';
        this.timeout = 10000;
    }

    // Parks API Endpoints
    async getParks(filters = {}) {
        if (this.mockMode) {
            return this.getMockParks(filters);
        }

        try {
            const query = new URLSearchParams(filters).toString();
            const response = await this.fetch(`${this.baseUrl}/parks?${query}`);
            return response;
        } catch (error) {
            console.error('Failed to fetch parks:', error);
            return this.getMockParks(filters);
        }
    }

    async getParkDetails(parkId) {
        if (this.mockMode) {
            return this.getMockParkDetails(parkId);
        }

        try {
            const response = await this.fetch(`${this.baseUrl}/parks/${parkId}`);
            return response;
        } catch (error) {
            console.error('Failed to fetch park details:', error);
            return this.getMockParkDetails(parkId);
        }
    }

    async searchParks(query) {
        if (this.mockMode) {
            return this.getMockParkSearch(query);
        }

        try {
            const response = await this.fetch(`${this.baseUrl}/parks/search?q=${encodeURIComponent(query)}`);
            return response;
        } catch (error) {
            return this.getMockParkSearch(query);
        }
    }

    // Booking Endpoints
    async createBooking(bookingData) {
        if (this.mockMode) {
            return this.createMockBooking(bookingData);
        }

        try {
            const response = await this.fetch(`${this.baseUrl}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
            return response;
        } catch (error) {
            console.error('Failed to create booking:', error);
            return this.createMockBooking(bookingData);
        }
    }

    async getBooking(bookingId) {
        if (this.mockMode) {
            return this.getMockBooking(bookingId);
        }

        try {
            const response = await this.fetch(`${this.baseUrl}/bookings/${bookingId}`);
            return response;
        } catch (error) {
            return this.getMockBooking(bookingId);
        }
    }

    async updateBooking(bookingId, bookingData) {
        if (this.mockMode) {
            return this.updateMockBooking(bookingId, bookingData);
        }

        try {
            const response = await this.fetch(`${this.baseUrl}/bookings/${bookingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
            return response;
        } catch (error) {
            return this.updateMockBooking(bookingId, bookingData);
        }
    }

    async cancelBooking(bookingId) {
        if (this.mockMode) {
            return this.cancelMockBooking(bookingId);
        }

        try {
            const response = await this.fetch(`${this.baseUrl}/bookings/${bookingId}`, {
                method: 'DELETE'
            });
            return response;
        } catch (error) {
            return this.cancelMockBooking(bookingId);
        }
    }

    // Payment Endpoints
    async createPaymentIntent(amount, currency = 'cad', metadata = {}) {
        if (this.mockMode) {
            return this.createMockPaymentIntent(amount, currency, metadata);
        }

        try {
            const response = await this.fetch(`${this.baseUrl}/payments/create-intent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, currency, metadata })
            });
            return response;
        } catch (error) {
            return this.createMockPaymentIntent(amount, currency, metadata);
        }
    }

    async confirmPayment(paymentIntentId, paymentData) {
        if (this.mockMode) {
            return this.confirmMockPayment(paymentIntentId, paymentData);
        }

        try {
            const response = await this.fetch(`${this.baseUrl}/payments/${paymentIntentId}/confirm`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData)
            });
            return response;
        } catch (error) {
            return this.confirmMockPayment(paymentIntentId, paymentData);
        }
    }

    // Email Endpoints
    async sendBookingConfirmation(bookingData) {
        if (this.mockMode) {
            return this.sendMockBookingConfirmation(bookingData);
        }

        try {
            const response = await this.fetch(`${this.baseUrl}/emails/booking-confirmation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData)
            });
            return response;
        } catch (error) {
            return this.sendMockBookingConfirmation(bookingData);
        }
    }

    async sendReservationSummary(email, reservationData) {
        if (this.mockMode) {
            return { success: true };
        }

        try {
            const response = await this.fetch(`${this.baseUrl}/emails/reservation-summary`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, ...reservationData })
            });
            return response;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Feature Flag Endpoints
    async getFeatureFlags() {
        if (this.mockMode) {
            const flags = JSON.parse(localStorage.getItem('feature_flags') || '{}');
            return { success: true, flags };
        }

        try {
            const response = await this.fetch(`${this.baseUrl}/admin/flags`);
            return response;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async updateFeatureFlag(flagName, enabled, rolloutPercentage) {
        if (this.mockMode) {
            return { success: true };
        }

        try {
            const response = await this.fetch(`${this.baseUrl}/admin/flags/${flagName}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                },
                body: JSON.stringify({ enabled, rolloutPercentage })
            });
            return response;
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Availability Checking
    async checkAvailability(parkId, startDate, endDate) {
        if (this.mockMode) {
            return { available: true, availableSites: Math.floor(Math.random() * 10) + 5 };
        }

        try {
            const response = await this.fetch(
                `${this.baseUrl}/parks/${parkId}/availability?start=${startDate}&end=${endDate}`
            );
            return response;
        } catch (error) {
            return { available: true, availableSites: Math.floor(Math.random() * 10) + 5 };
        }
    }

    // Generic fetch with error handling
    async fetch(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            return await response.json();
        } finally {
            clearTimeout(timeoutId);
        }
    }

    // Mock Data Methods
    getMockParks(filters = {}) {
        const parks = [
            {
                id: 'algonquin-park',
                name: 'Algonquin Provincial Park',
                location: 'Huntsville, ON',
                description: 'Perfect for first-time campers',
                pricePerNight: 45.99,
                rating: 4.8,
                reviews: 250,
                amenities: ['Hiking', 'Swimming', 'Fishing'],
                difficulty: 'Easy'
            },
            {
                id: 'killarney-park',
                name: 'Killarney Provincial Park',
                location: 'Killarney, ON',
                description: 'Scenic park with beautiful trails',
                pricePerNight: 39.99,
                rating: 4.6,
                reviews: 180,
                amenities: ['Hiking', 'Photography', 'Scenic Views'],
                difficulty: 'Moderate'
            },
            {
                id: 'bon-echo-park',
                name: 'Bon Echo Provincial Park',
                location: 'Cloyne, ON',
                description: 'Cliffs and lakes perfect for adventure',
                pricePerNight: 49.99,
                rating: 4.7,
                reviews: 210,
                amenities: ['Rock Climbing', 'Swimming', 'Boating'],
                difficulty: 'Moderate'
            }
        ];

        return { success: true, parks };
    }

    getMockParkDetails(parkId) {
        const details = {
            'algonquin-park': {
                id: 'algonquin-park',
                name: 'Algonquin Provincial Park',
                location: 'Huntsville, ON',
                description: 'One of Ontario\'s most popular parks',
                pricePerNight: 45.99,
                rating: 4.8,
                reviews: 250,
                amenities: ['Hiking', 'Swimming', 'Fishing', 'Camping', 'Picnicking'],
                difficulty: 'Easy',
                facilities: ['Campground', 'Visitor Center', 'Restaurant', 'Marina'],
                bestTime: 'May to October',
                totalSites: 1250
            }
        };

        return { success: true, park: details[parkId] || details['algonquin-park'] };
    }

    getMockParkSearch(query) {
        const parks = this.getMockParks().parks;
        const results = parks.filter(p =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.location.toLowerCase().includes(query.toLowerCase())
        );

        return { success: true, parks: results };
    }

    createMockBooking(bookingData) {
        const confirmationId = 'BOOK-' + Date.now();
        const booking = {
            confirmationId,
            ...bookingData,
            status: 'confirmed',
            createdAt: new Date().toISOString()
        };

        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        return { success: true, bookingId: confirmationId, booking };
    }

    getMockBooking(bookingId) {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const booking = bookings.find(b => b.confirmationId === bookingId);

        return { success: !!booking, booking: booking || null };
    }

    updateMockBooking(bookingId, bookingData) {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const booking = bookings.find(b => b.confirmationId === bookingId);

        if (booking) {
            Object.assign(booking, bookingData);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            return { success: true, booking };
        }

        return { success: false, error: 'Booking not found' };
    }

    cancelMockBooking(bookingId) {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        const booking = bookings.find(b => b.confirmationId === bookingId);

        if (booking) {
            booking.status = 'cancelled';
            localStorage.setItem('bookings', JSON.stringify(bookings));
            return { success: true };
        }

        return { success: false, error: 'Booking not found' };
    }

    createMockPaymentIntent(amount, currency, metadata) {
        const clientSecret = 'pi_' + Math.random().toString(36).substring(2, 15);
        return { success: true, clientSecret, amount, currency };
    }

    confirmMockPayment(paymentIntentId, paymentData) {
        return { success: true, paymentIntentId, status: 'succeeded' };
    }

    sendMockBookingConfirmation(bookingData) {
        return { success: true, message: 'Email would be sent in production' };
    }
}

// Initialize API client globally
const apiClient = new BackendAPIClient();

// Helper function to toggle mock mode for development
function setMockMode(enabled) {
    localStorage.setItem('api_mock_mode', enabled ? 'true' : 'false');
    location.reload();
}
