// Advanced Analytics & Reporting Module
// Detailed insights, custom reports, funnel analysis

class AdvancedAnalytics {
    constructor() {
        this.events = [];
        this.sessions = new Map();
        this.userSessions = new Map();
        this.funnel = {
            views: 0,
            addToCart: 0,
            checkout: 0,
            payment: 0,
            confirmation: 0
        };
        this.initializeEventTracking();
    }

    // Track event with full context
    trackEvent(eventName, properties = {}) {
        const event = {
            timestamp: Date.now(),
            name: eventName,
            properties,
            sessionId: this.getCurrentSessionId(),
            userId: this.getCurrentUserId(),
            url: window.location.href,
            referrer: document.referrer,
            userAgent: navigator.userAgent
        };

        this.events.push(event);

        // Update funnel
        this.updateFunnel(eventName);

        return event;
    }

    // Get current session
    getCurrentSessionId() {
        let sessionId = sessionStorage.getItem('analytics_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('analytics_session_id', sessionId);
        }
        return sessionId;
    }

    // Get current user
    getCurrentUserId() {
        return localStorage.getItem('current_user_id') || 'anonymous';
    }

    // Update conversion funnel
    updateFunnel(eventName) {
        const funnelMap = {
            'view_item': 'views',
            'add_to_cart': 'addToCart',
            'begin_checkout': 'checkout',
            'payment_attempt': 'payment',
            'purchase': 'confirmation'
        };

        if (funnelMap[eventName]) {
            this.funnel[funnelMap[eventName]]++;
        }
    }

    // Get funnel analysis
    getFunnelAnalysis() {
        const steps = ['views', 'addToCart', 'checkout', 'payment', 'confirmation'];
        const analysis = {};

        steps.forEach((step, i) => {
            const current = this.funnel[step];
            const previous = i === 0 ? this.funnel.views : this.funnel[steps[i - 1]];
            const conversionRate = previous > 0 ? (current / previous * 100).toFixed(2) : 0;
            const dropoff = previous - current;

            analysis[step] = {
                count: current,
                conversionRate: parseFloat(conversionRate),
                dropoff,
                dropoffRate: previous > 0 ? (dropoff / previous * 100).toFixed(2) : 0
            };
        });

        return analysis;
    }

    // Get event frequency
    getEventFrequency(eventName, timeRange = 'today') {
        const now = Date.now();
        const ranges = {
            'today': 24 * 60 * 60 * 1000,
            'week': 7 * 24 * 60 * 60 * 1000,
            'month': 30 * 24 * 60 * 60 * 1000
        };

        const range = ranges[timeRange] || ranges.today;
        const filtered = this.events.filter(e =>
            e.name === eventName && (now - e.timestamp) < range
        );

        return {
            eventName,
            timeRange,
            count: filtered.length,
            events: filtered
        };
    }

    // Get user journey
    getUserJourney(userId) {
        return this.events.filter(e => e.userId === userId)
            .sort((a, b) => a.timestamp - b.timestamp)
            .map(e => ({
                time: new Date(e.timestamp).toLocaleTimeString(),
                event: e.name,
                properties: e.properties
            }));
    }

    // Get top events
    getTopEvents(limit = 10) {
        const eventCounts = {};

        this.events.forEach(e => {
            eventCounts[e.name] = (eventCounts[e.name] || 0) + 1;
        });

        return Object.entries(eventCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([name, count]) => ({ name, count }));
    }

    // Get event by property
    getEventsByProperty(eventName, propertyKey, propertyValue) {
        return this.events.filter(e =>
            e.name === eventName && e.properties[propertyKey] === propertyValue
        );
    }

    // Cohort analysis
    analyzeCohort(startDate, endDate) {
        const start = new Date(startDate).getTime();
        const end = new Date(endDate).getTime();

        const users = new Set();
        const cohortEvents = [];

        this.events.forEach(e => {
            if (e.timestamp >= start && e.timestamp <= end) {
                users.add(e.userId);
                cohortEvents.push(e);
            }
        });

        return {
            cohortSize: users.size,
            totalEvents: cohortEvents.length,
            uniqueUsers: Array.from(users),
            eventBreakdown: this.getEventBreakdown(cohortEvents)
        };
    }

    // Event breakdown
    getEventBreakdown(events = null) {
        const eventsToAnalyze = events || this.events;
        const breakdown = {};

        eventsToAnalyze.forEach(e => {
            breakdown[e.name] = (breakdown[e.name] || 0) + 1;
        });

        return Object.entries(breakdown)
            .map(([name, count]) => ({
                event: name,
                count,
                percentage: ((count / eventsToAnalyze.length) * 100).toFixed(2)
            }))
            .sort((a, b) => b.count - a.count);
    }

    // Device/Browser breakdown
    getDeviceBreakdown() {
        const devices = {};

        this.events.forEach(e => {
            const ua = e.userAgent;
            let device = 'Other';

            if (/mobile/i.test(ua)) device = 'Mobile';
            else if (/tablet|ipad/i.test(ua)) device = 'Tablet';
            else device = 'Desktop';

            devices[device] = (devices[device] || 0) + 1;
        });

        return Object.entries(devices)
            .map(([device, count]) => ({
                device,
                count,
                percentage: ((count / this.events.length) * 100).toFixed(2)
            }));
    }

    // Session analysis
    getSessionMetrics() {
        const sessionIds = new Set();
        let totalSessionDuration = 0;
        let averageSessionDuration = 0;

        // Group by session
        const sessions = {};
        this.events.forEach(e => {
            if (!sessions[e.sessionId]) {
                sessions[e.sessionId] = [];
                sessionIds.add(e.sessionId);
            }
            sessions[e.sessionId].push(e);
        });

        // Calculate session metrics
        Object.values(sessions).forEach(sessionEvents => {
            if (sessionEvents.length > 0) {
                const duration = sessionEvents[sessionEvents.length - 1].timestamp - sessionEvents[0].timestamp;
                totalSessionDuration += duration;
            }
        });

        averageSessionDuration = sessionIds.size > 0 ? totalSessionDuration / sessionIds.size : 0;

        return {
            totalSessions: sessionIds.size,
            averageSessionDuration: Math.round(averageSessionDuration / 1000) + ' seconds',
            totalEvents: this.events.length,
            eventsPerSession: (this.events.length / sessionIds.size).toFixed(2)
        };
    }

    // Geographic data (simulated from referrer)
    getGeographicData() {
        const locations = {};

        this.events.forEach(e => {
            const location = e.properties.location || 'Unknown';
            locations[location] = (locations[location] || 0) + 1;
        });

        return Object.entries(locations)
            .map(([location, count]) => ({
                location,
                count,
                percentage: ((count / this.events.length) * 100).toFixed(2)
            }))
            .sort((a, b) => b.count - a.count);
    }

    // Retention analysis
    getRetentionAnalysis(initialEventName = 'page_view', retentionEventName = 'purchase') {
        const initialUsers = new Set();
        const retainedUsers = new Set();

        // Get users who had initial event
        this.events.forEach(e => {
            if (e.name === initialEventName) {
                initialUsers.add(e.userId);
            }
        });

        // Get users who had retention event
        this.events.forEach(e => {
            if (e.name === retentionEventName && initialUsers.has(e.userId)) {
                retainedUsers.add(e.userId);
            }
        });

        const retentionRate = initialUsers.size > 0
            ? (retainedUsers.size / initialUsers.size * 100).toFixed(2)
            : 0;

        return {
            initialUsers: initialUsers.size,
            retainedUsers: retainedUsers.size,
            retentionRate: parseFloat(retentionRate) + '%'
        };
    }

    // Generate custom report
    generateReport(config = {}) {
        const {
            title = 'Analytics Report',
            startDate = null,
            endDate = null,
            includeSegments = ['events', 'devices', 'sessions', 'funnel', 'retention']
        } = config;

        const report = {
            title,
            generatedAt: new Date().toISOString(),
            timeRange: {
                start: startDate || 'All time',
                end: endDate || 'Now'
            },
            sections: {}
        };

        if (includeSegments.includes('events')) {
            report.sections.topEvents = this.getTopEvents();
            report.sections.eventBreakdown = this.getEventBreakdown();
        }

        if (includeSegments.includes('devices')) {
            report.sections.deviceBreakdown = this.getDeviceBreakdown();
        }

        if (includeSegments.includes('sessions')) {
            report.sections.sessionMetrics = this.getSessionMetrics();
        }

        if (includeSegments.includes('funnel')) {
            report.sections.funnelAnalysis = this.getFunnelAnalysis();
        }

        if (includeSegments.includes('retention')) {
            report.sections.retentionAnalysis = this.getRetentionAnalysis();
        }

        return report;
    }

    // Export data
    exportData(format = 'json') {
        if (format === 'json') {
            return JSON.stringify({
                events: this.events,
                funnel: this.funnel,
                generatedAt: new Date().toISOString()
            }, null, 2);
        }

        if (format === 'csv') {
            let csv = 'Timestamp,Event Name,User ID,URL,Properties\n';

            this.events.forEach(e => {
                csv += `"${new Date(e.timestamp).toISOString()}","${e.name}","${e.userId}","${e.url}","${JSON.stringify(e.properties)}"\n`;
            });

            return csv;
        }

        return null;
    }

    // Download report
    downloadReport(filename = 'analytics-report.json') {
        const data = this.exportData('json');
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Clear data
    clearData() {
        this.events = [];
        this.funnel = {
            views: 0,
            addToCart: 0,
            checkout: 0,
            payment: 0,
            confirmation: 0
        };
    }

    // Initialize event tracking
    initializeEventTracking() {
        // Track page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.trackEvent('page_hidden');
            } else {
                this.trackEvent('page_visible');
            }
        });

        // Track clicks
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
                this.trackEvent('element_click', {
                    elementType: e.target.tagName,
                    elementText: e.target.textContent.substring(0, 100),
                    elementId: e.target.id
                });
            }
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            this.trackEvent('form_submit', {
                formId: e.target.id,
                formName: e.target.name
            });
        });
    }
}

const advancedAnalytics = new AdvancedAnalytics();
