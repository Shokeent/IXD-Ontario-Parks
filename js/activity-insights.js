// User Activity Tracking & Insights
// Track user behavior, generate personalized recommendations and insights

class UserActivityInsightsManager {
    constructor() {
        this.activities = JSON.parse(localStorage.getItem('user-activities') || '[]');
        this.insights = JSON.parse(localStorage.getItem('user-insights') || '{}');
        this.preferences = JSON.parse(localStorage.getItem('user-activity-preferences') || '{}');
    }

    // Log activity
    logActivity(activityType, data = {}) {
        const activity = {
            id: 'activity_' + Date.now(),
            type: activityType,
            data,
            timestamp: new Date().toISOString(),
            duration: data.duration || 0,
            metadata: {
                userAgent: navigator.userAgent,
                referrer: document.referrer,
                url: window.location.href
            }
        };

        this.activities.push(activity);

        // Keep only last 1000 activities
        if (this.activities.length > 1000) {
            this.activities = this.activities.slice(-1000);
        }

        this.saveActivities();

        if (window.gaManager) {
            window.gaManager.trackEvent('user_activity', {
                activity_type: activityType,
                ...data
            });
        }

        return activity;
    }

    // Get activities by type
    getActivitiesByType(type) {
        return this.activities.filter(a => a.type === type);
    }

    // Get activities by date range
    getActivitiesByDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        return this.activities.filter(a => {
            const actDate = new Date(a.timestamp);
            return actDate >= start && actDate <= end;
        });
    }

    // Track park views
    trackParkView(parkId, duration = 0) {
        return this.logActivity('park_view', {
            parkId,
            duration
        });
    }

    // Track search
    trackSearch(query, resultsCount) {
        return this.logActivity('search', {
            query,
            resultsCount
        });
    }

    // Track filter usage
    trackFilterUsage(filters) {
        return this.logActivity('filter_usage', {
            filters
        });
    }

    // Track booking attempt
    trackBookingAttempt(parkId, dates) {
        return this.logActivity('booking_attempt', {
            parkId,
            checkIn: dates.checkIn,
            checkOut: dates.checkOut,
            nights: Math.ceil((new Date(dates.checkOut) - new Date(dates.checkIn)) / (1000 * 60 * 60 * 24))
        });
    }

    // Track booking completion
    trackBookingCompletion(bookingData) {
        return this.logActivity('booking_completed', {
            bookingId: bookingData.id,
            parkId: bookingData.parkId,
            totalCost: bookingData.totalCost,
            nights: bookingData.nights
        });
    }

    // Get user summary
    getUserSummary() {
        const totalActivities = this.activities.length;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayActivities = this.activities.filter(a => {
            const actDate = new Date(a.timestamp);
            actDate.setHours(0, 0, 0, 0);
            return actDate.getTime() === today.getTime();
        });

        const parkViews = this.getActivitiesByType('park_view');
        const searches = this.getActivitiesByType('search');
        const bookings = this.getActivitiesByType('booking_completed');

        // Calculate most viewed parks
        const parkViewCounts = {};
        parkViews.forEach(pv => {
            parkViewCounts[pv.data.parkId] = (parkViewCounts[pv.data.parkId] || 0) + 1;
        });

        const topParks = Object.entries(parkViewCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([parkId, count]) => ({ parkId, count }));

        return {
            totalActivities,
            todayActivities: todayActivities.length,
            parkViewsCount: parkViews.length,
            searchesCount: searches.length,
            bookingsCount: bookings.length,
            topParks,
            memberSince: this.activities[0]?.timestamp || new Date().toISOString()
        };
    }

    // Generate recommendations
    getRecommendations(limit = 5) {
        const summary = this.getUserSummary();
        const recommendations = [];

        // Recommend parks similar to top viewed parks
        if (summary.topParks.length > 0) {
            summary.topParks.forEach(park => {
                recommendations.push({
                    type: 'similar_park',
                    title: `Parks similar to ${park.parkId}`,
                    reason: 'You frequently visit this type of park',
                    score: 0.8
                });
            });
        }

        // Recommend based on season
        const season = this.getCurrentSeason();
        recommendations.push({
            type: 'seasonal',
            title: `Best parks for ${season}`,
            reason: `${season} is the perfect time to explore`,
            score: 0.7
        });

        // Recommend based on search history
        const searches = this.getActivitiesByType('search');
        if (searches.length > 0) {
            const latestSearch = searches[searches.length - 1];
            recommendations.push({
                type: 'search_related',
                title: `More parks like "${latestSearch.data.query}"`,
                reason: 'Based on your recent search',
                score: 0.9
            });
        }

        return recommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }

    // Get current season
    getCurrentSeason() {
        const month = new Date().getMonth();
        if (month < 3) return 'winter';
        if (month < 6) return 'spring';
        if (month < 9) return 'summer';
        if (month < 12) return 'fall';
    }

    // Analyze user behavior
    analyzeBehavior() {
        const summary = this.getUserSummary();
        const parkViews = this.getActivitiesByType('park_view');
        const bookings = this.getActivitiesByType('booking_completed');

        // Calculate engagement score (0-100)
        let engagementScore = 0;
        engagementScore += Math.min(summary.parkViewsCount * 5, 20);
        engagementScore += Math.min(summary.searchesCount * 2, 20);
        engagementScore += summary.bookingsCount * 20;

        // Calculate conversion rate
        const bookingAttempts = this.getActivitiesByType('booking_attempt').length;
        const conversionRate = bookingAttempts > 0 ? (bookings.length / bookingAttempts) * 100 : 0;

        // Identify user type
        let userType = 'casual';
        if (summary.bookingsCount > 3) userType = 'power_user';
        else if (summary.bookingsCount > 0) userType = 'returning';
        else if (summary.parkViewsCount > 10) userType = 'explorer';

        return {
            engagementScore: Math.min(engagementScore, 100),
            conversionRate: Math.round(conversionRate),
            userType,
            lastActive: this.activities[this.activities.length - 1]?.timestamp,
            sessionCount: this.countSessions()
        };
    }

    // Count sessions
    countSessions() {
        let sessions = 1;
        const dayInMs = 24 * 60 * 60 * 1000;

        for (let i = this.activities.length - 1; i > 0; i--) {
            const currentTime = new Date(this.activities[i].timestamp);
            const prevTime = new Date(this.activities[i - 1].timestamp);

            if (currentTime - prevTime > dayInMs) {
                sessions++;
            }
        }

        return sessions;
    }

    // Get activity timeline
    getActivityTimeline(days = 30) {
        const timeline = {};
        const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);

        this.activities
            .filter(a => new Date(a.timestamp).getTime() > cutoffDate)
            .forEach(a => {
                const date = new Date(a.timestamp).toISOString().split('T')[0];
                timeline[date] = (timeline[date] || 0) + 1;
            });

        return timeline;
    }

    // Get activity heatmap
    getActivityHeatmap() {
        const heatmap = {};

        this.activities.forEach(a => {
            const date = new Date(a.timestamp);
            const day = date.getDay();
            const hour = date.getHours();
            const key = `${day}_${hour}`;

            heatmap[key] = (heatmap[key] || 0) + 1;
        });

        return heatmap;
    }

    // Export activity data
    exportActivityData(format = 'json') {
        const data = {
            summary: this.getUserSummary(),
            behavior: this.analyzeBehavior(),
            activities: this.activities,
            exportDate: new Date().toISOString()
        };

        if (format === 'json') {
            return JSON.stringify(data, null, 2);
        }

        if (format === 'csv') {
            let csv = 'Timestamp,Activity Type,Data\n';

            this.activities.forEach(a => {
                csv += `"${a.timestamp}","${a.type}","${JSON.stringify(a.data)}"\n`;
            });

            return csv;
        }

        return null;
    }

    // Render insights dashboard
    renderInsightsDashboard(containerId = 'insights-dashboard') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const summary = this.getUserSummary();
        const behavior = this.analyzeBehavior();
        const recommendations = this.getRecommendations();

        let html = `
            <div class="insights-dashboard">
                <div class="insights-header">
                    <h2>Your Activity Insights</h2>
                </div>

                <div class="insights-grid">
                    <div class="insight-card">
                        <div class="insight-label">Engagement Score</div>
                        <div class="insight-value">${behavior.engagementScore}/100</div>
                        <div class="insight-bar">
                            <div class="insight-bar-fill" style="width: ${behavior.engagementScore}%"></div>
                        </div>
                    </div>

                    <div class="insight-card">
                        <div class="insight-label">Parks Explored</div>
                        <div class="insight-value">${summary.parkViewsCount}</div>
                        <div class="insight-meta">Total views</div>
                    </div>

                    <div class="insight-card">
                        <div class="insight-label">Bookings Completed</div>
                        <div class="insight-value">${summary.bookingsCount}</div>
                        <div class="insight-meta">Total trips</div>
                    </div>

                    <div class="insight-card">
                        <div class="insight-label">Member Since</div>
                        <div class="insight-value">${new Date(summary.memberSince).toLocaleDateString()}</div>
                        <div class="insight-meta">${behavior.sessionCount} sessions</div>
                    </div>
                </div>

                <div class="insights-section">
                    <h3>Top Parks</h3>
                    <div class="top-parks-list">
                        ${summary.topParks.map((park, index) => `
                            <div class="top-park-item">
                                <span class="rank">#${index + 1}</span>
                                <span class="park-name">${park.parkId}</span>
                                <span class="view-count">${park.count} views</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="insights-section">
                    <h3>Recommended for You</h3>
                    <div class="recommendations-list">
                        ${recommendations.map(rec => `
                            <div class="recommendation-item">
                                <div class="rec-title">${rec.title}</div>
                                <div class="rec-reason">${rec.reason}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="insights-footer">
                    <button class="btn-secondary" onclick="userActivityInsightsManager.exportData()">Export Data</button>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    // Export data
    exportData() {
        const data = this.exportActivityData('json');
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `activity_data_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Save activities
    saveActivities() {
        localStorage.setItem('user-activities', JSON.stringify(this.activities));
    }

    // Clear old activities
    clearOldActivities(daysOld = 90) {
        const cutoffDate = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
        this.activities = this.activities.filter(a => {
            return new Date(a.timestamp).getTime() > cutoffDate;
        });
        this.saveActivities();
    }
}

const userActivityInsightsManager = new UserActivityInsightsManager();
