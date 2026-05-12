// Park Events & Programming Calendar
// Ranger programs, guided tours, special events, workshops

class ParkEventsManager {
    constructor() {
        this.events = this.loadEvents();
        this.registrations = JSON.parse(localStorage.getItem('event-registrations') || '[]');
        this.reminders = JSON.parse(localStorage.getItem('event-reminders') || '[]');
    }

    loadEvents() {
        const today = new Date();
        const addDays = d => new Date(today.getTime() + d * 86400000).toISOString().split('T')[0];

        return [
            {
                id: 'evt-001',
                parkId: 'algonquin-park',
                title: 'Guided Canoe Tour',
                category: 'water-activity',
                description: 'Explore the lakes of Algonquin with an expert guide. See wildlife and learn about the ecosystem.',
                date: addDays(3),
                time: '09:00',
                duration: 180,
                capacity: 12,
                registered: 7,
                price: 45,
                ageGroup: 'all-ages',
                difficulty: 'easy',
                guide: 'Ranger Kim Walsh',
                meetingPoint: 'Lake of Two Rivers boat launch',
                requirements: ['Life jacket provided', 'Bring water and snacks', 'Sun protection']
            },
            {
                id: 'evt-002',
                parkId: 'algonquin-park',
                title: 'Night Sky Photography Workshop',
                category: 'photography',
                description: 'Learn astrophotography techniques in one of Ontario\'s darkest sky parks.',
                date: addDays(5),
                time: '21:00',
                duration: 150,
                capacity: 8,
                registered: 5,
                price: 60,
                ageGroup: '14+',
                difficulty: 'easy',
                guide: 'Expert Photographer Dave Chen',
                meetingPoint: 'Visitor Centre parking lot',
                requirements: ['Camera with manual mode', 'Tripod', 'Dress warmly']
            },
            {
                id: 'evt-003',
                parkId: 'algonquin-park',
                title: 'Family Nature Walk',
                category: 'guided-hike',
                description: 'A gentle 2km walk with a park naturalist. Discover plants, insects, and birds.',
                date: addDays(1),
                time: '10:00',
                duration: 90,
                capacity: 20,
                registered: 14,
                price: 0,
                ageGroup: 'all-ages',
                difficulty: 'easy',
                guide: 'Park Naturalist Sarah Lee',
                meetingPoint: 'Visitor Centre front entrance',
                requirements: ['Comfortable walking shoes', 'Water bottle']
            },
            {
                id: 'evt-004',
                parkId: 'killarney-park',
                title: 'Sunrise Hike — The Crack',
                category: 'guided-hike',
                description: 'Catch spectacular sunrise views from the top of The Crack trail.',
                date: addDays(2),
                time: '05:30',
                duration: 240,
                capacity: 10,
                registered: 10,
                price: 30,
                ageGroup: '12+',
                difficulty: 'moderate',
                guide: 'Ranger Marco Rossi',
                meetingPoint: 'Killarney parking lot trailhead',
                requirements: ['Hiking boots required', 'Headlamp', 'Water and snacks']
            },
            {
                id: 'evt-005',
                parkId: 'pinery-park',
                title: 'Junior Ranger Program',
                category: 'kids-program',
                description: 'Kids aged 6-12 earn their Junior Ranger badge through fun nature activities.',
                date: addDays(4),
                time: '13:00',
                duration: 120,
                capacity: 15,
                registered: 8,
                price: 10,
                ageGroup: '6-12',
                difficulty: 'easy',
                guide: 'Education Coordinator Amy Park',
                meetingPoint: 'Pinery Visitor Centre',
                requirements: ['Parent/guardian required', 'Sunscreen', 'Snack']
            },
            {
                id: 'evt-006',
                parkId: 'algonquin-park',
                title: 'Wolf Howling Expedition',
                category: 'wildlife',
                description: 'Join rangers on an evening drive to hear wild wolf howls — a bucket-list experience.',
                date: addDays(7),
                time: '19:30',
                duration: 180,
                capacity: 30,
                registered: 22,
                price: 20,
                ageGroup: 'all-ages',
                difficulty: 'easy',
                guide: 'Senior Ranger Tom Bradley',
                meetingPoint: 'Algonquin Visitor Centre',
                requirements: ['Meet at Visitor Centre', 'Dress in layers', 'No strong scents']
            },
            {
                id: 'evt-007',
                parkId: 'point-pelee-park',
                title: 'Spring Bird Migration Tour',
                category: 'wildlife',
                description: 'Point Pelee is one of North America\'s top migration hotspots. See hundreds of species.',
                date: addDays(6),
                time: '07:00',
                duration: 240,
                capacity: 12,
                registered: 9,
                price: 35,
                ageGroup: 'all-ages',
                difficulty: 'easy',
                guide: 'Ornithologist Dr. Janet Mills',
                meetingPoint: 'Point Pelee Visitor Centre',
                requirements: ['Binoculars helpful', 'Field guide optional', 'Walking shoes']
            }
        ];
    }

    // Get events by park
    getEventsByPark(parkId) {
        return this.events.filter(e => e.parkId === parkId && new Date(e.date) >= new Date());
    }

    // Get upcoming events
    getUpcomingEvents(days = 14) {
        const cutoff = new Date(Date.now() + days * 86400000);
        return this.events
            .filter(e => new Date(e.date) >= new Date() && new Date(e.date) <= cutoff)
            .sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    // Get events by category
    getEventsByCategory(category) {
        return this.events.filter(e => e.category === category && new Date(e.date) >= new Date());
    }

    // Get free events
    getFreeEvents() {
        return this.events.filter(e => e.price === 0 && new Date(e.date) >= new Date());
    }

    // Check availability
    isEventAvailable(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return false;
        return event.registered < event.capacity;
    }

    // Register for event
    registerForEvent(eventId, userId, attendees = 1) {
        const event = this.events.find(e => e.id === eventId);

        if (!event) return { success: false, error: 'Event not found' };
        if (event.registered + attendees > event.capacity) {
            return { success: false, error: 'Event is full' };
        }

        const existing = this.registrations.find(r => r.eventId === eventId && r.userId === userId);
        if (existing) return { success: false, error: 'Already registered' };

        const registration = {
            id: 'reg_' + Date.now(),
            eventId,
            userId,
            attendees,
            totalCost: event.price * attendees,
            registeredAt: new Date().toISOString(),
            status: 'confirmed',
            confirmationCode: Math.random().toString(36).substring(2, 8).toUpperCase()
        };

        event.registered += attendees;
        this.registrations.push(registration);
        this.saveRegistrations();

        if (window.gaManager) {
            window.gaManager.trackEvent('event_registered', {
                event_id: eventId,
                event_title: event.title,
                attendees,
                cost: registration.totalCost
            });
        }

        return { success: true, registration };
    }

    // Cancel registration
    cancelRegistration(registrationId, userId) {
        const idx = this.registrations.findIndex(r => r.id === registrationId && r.userId === userId);
        if (idx === -1) return { success: false, error: 'Registration not found' };

        const registration = this.registrations[idx];
        const event = this.events.find(e => e.id === registration.eventId);
        if (event) event.registered -= registration.attendees;

        this.registrations.splice(idx, 1);
        this.saveRegistrations();

        return { success: true };
    }

    // Get user registrations
    getUserRegistrations(userId) {
        return this.registrations
            .filter(r => r.userId === userId)
            .map(r => ({ ...r, event: this.events.find(e => e.id === r.eventId) }));
    }

    // Set reminder
    setEventReminder(eventId, userId) {
        const event = this.events.find(e => e.id === eventId);
        if (!event) return { success: false, error: 'Event not found' };

        this.reminders.push({ eventId, userId, createdAt: new Date().toISOString() });
        localStorage.setItem('event-reminders', JSON.stringify(this.reminders));

        return { success: true };
    }

    // Get event categories
    getCategories() {
        return [...new Set(this.events.map(e => e.category))];
    }

    // Render events list
    renderEventsList(parkId, containerId = 'events-list') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const events = parkId ? this.getEventsByPark(parkId) : this.getUpcomingEvents();

        if (events.length === 0) {
            container.innerHTML = '<p class="no-results">No upcoming events. Check back soon!</p>';
            return;
        }

        let html = '<div class="events-list">';

        events.forEach(event => {
            const spotsLeft = event.capacity - event.registered;
            const isFull = spotsLeft === 0;
            const userId = localStorage.getItem('user_id');
            const isRegistered = this.registrations.some(r => r.eventId === event.id && r.userId === userId);
            const eventDate = new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

            html += `
                <div class="event-card ${isFull ? 'full' : ''}">
                    <div class="event-date-badge">
                        <span class="event-day">${new Date(event.date).getDate()}</span>
                        <span class="event-month">${new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                    </div>
                    <div class="event-details">
                        <div class="event-header">
                            <h3>${event.title}</h3>
                            <span class="event-price">${event.price === 0 ? 'Free' : '$' + event.price}</span>
                        </div>
                        <p class="event-desc">${event.description}</p>
                        <div class="event-meta">
                            <span>🕐 ${event.time} · ${event.duration} min</span>
                            <span>👥 ${event.ageGroup}</span>
                            <span>🎯 ${event.difficulty}</span>
                        </div>
                        <div class="event-guide">Led by ${event.guide}</div>
                        <div class="event-spots ${spotsLeft <= 3 ? 'low' : ''}">
                            ${isFull ? 'Event Full' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
                        </div>
                    </div>
                    <div class="event-actions">
                        ${isRegistered ? `
                            <button class="btn-secondary" disabled>Registered ✓</button>
                        ` : isFull ? `
                            <button class="btn-secondary" onclick="parkEventsManager.setEventReminder('${event.id}', '${userId}')">
                                Notify if opens
                            </button>
                        ` : `
                            <button class="btn-primary" onclick="parkEventsManager.registerForEvent('${event.id}', '${userId}')">
                                Register
                            </button>
                        `}
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    saveRegistrations() {
        localStorage.setItem('event-registrations', JSON.stringify(this.registrations));
    }
}

const parkEventsManager = new ParkEventsManager();
