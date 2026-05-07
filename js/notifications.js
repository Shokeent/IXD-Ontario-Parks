// Notification Manager
// In-app notifications, alerts, reminders, and communication

class NotificationManager {
    constructor() {
        this.notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
        this.preferences = JSON.parse(localStorage.getItem('notification-preferences') || this.getDefaultPreferences());
        this.subscriptions = JSON.parse(localStorage.getItem('notification-subscriptions') || '[]');
        this.initializeNotifications();
    }

    // Get default notification preferences
    getDefaultPreferences() {
        return {
            email: true,
            push: true,
            inApp: true,
            sms: false,
            bookingReminders: true,
            weatherAlerts: true,
            newFeatures: true,
            marketing: false,
            quietHours: {
                enabled: false,
                start: '22:00',
                end: '08:00'
            }
        };
    }

    // Initialize notifications
    initializeNotifications() {
        this.requestNotificationPermission();
        this.scheduleReminders();
    }

    // Request notification permission
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }

    // Create notification
    createNotification(data) {
        const {
            type,
            title,
            message,
            icon = '/images/logo-192.png',
            actions = [],
            data: notificationData = {},
            priority = 'normal'
        } = data;

        const notification = {
            id: 'notif_' + Date.now(),
            type,
            title,
            message,
            icon,
            actions,
            data: notificationData,
            priority,
            read: false,
            createdAt: new Date().toISOString(),
            timestamp: Date.now()
        };

        this.notifications.push(notification);
        this.saveNotifications();

        // Send based on preferences and type
        this.deliverNotification(notification);

        return notification;
    }

    // Deliver notification
    deliverNotification(notification) {
        const { type } = notification;

        // Check if user is in quiet hours
        if (this.isInQuietHours()) {
            // Store but don't show
            return;
        }

        // Send in-app notification
        if (this.preferences.inApp) {
            this.showInAppNotification(notification);
        }

        // Send push notification
        if (this.preferences.push && 'serviceWorker' in navigator) {
            this.sendPushNotification(notification);
        }

        // Send email for important notifications
        if (this.preferences.email && (notification.priority === 'high' || type === 'booking')) {
            this.sendEmailNotification(notification);
        }
    }

    // Show in-app notification
    showInAppNotification(notification) {
        const container = document.getElementById('notifications-container') || this.createNotificationContainer();

        const notificationEl = document.createElement('div');
        notificationEl.className = `notification notification-${notification.type}`;
        notificationEl.setAttribute('data-id', notification.id);

        notificationEl.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    <img src="${notification.icon}" alt="">
                </div>
                <div class="notification-text">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                </div>
                <button class="notification-close" onclick="notificationManager.dismissNotification('${notification.id}')">
                    ✕
                </button>
            </div>
            ${notification.actions.length > 0 ? `
                <div class="notification-actions">
                    ${notification.actions.map(action => `
                        <button class="btn-sm ${action.primary ? 'btn-primary' : 'btn-secondary'}"
                                onclick="notificationManager.handleNotificationAction('${notification.id}', '${action.id}')">
                            ${action.label}
                        </button>
                    `).join('')}
                </div>
            ` : ''}
        `;

        container.appendChild(notificationEl);

        // Auto-dismiss after 5 seconds (unless high priority)
        if (notification.priority !== 'high') {
            setTimeout(() => {
                this.dismissNotification(notification.id);
            }, 5000);
        }
    }

    // Create notification container
    createNotificationContainer() {
        const container = document.createElement('div');
        container.id = 'notifications-container';
        container.className = 'notifications-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
        `;
        document.body.appendChild(container);
        return container;
    }

    // Dismiss notification
    dismissNotification(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
        }

        const el = document.querySelector(`[data-id="${notificationId}"]`);
        if (el) {
            el.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => el.remove(), 300);
        }
    }

    // Send push notification
    sendPushNotification(notification) {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification(notification.title, {
                body: notification.message,
                icon: notification.icon,
                badge: '/images/badge-72.png',
                tag: notification.type,
                data: notification.data
            });
        });
    }

    // Send email notification
    sendEmailNotification(notification) {
        if (window.emailManager) {
            const userEmail = localStorage.getItem('user_email') || 'user@example.com';
            window.emailManager.sendNotificationEmail(userEmail, {
                title: notification.title,
                message: notification.message,
                data: notification.data
            });
        }
    }

    // Handle notification action
    handleNotificationAction(notificationId, actionId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        const action = notification?.actions.find(a => a.id === actionId);

        if (action && action.handler) {
            action.handler(notification.data);
        }

        this.dismissNotification(notificationId);

        if (window.gaManager) {
            window.gaManager.trackEvent('notification_action', {
                notification_type: notification.type,
                action_id: actionId
            });
        }
    }

    // Schedule reminders
    scheduleReminders() {
        // Check for upcoming bookings
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');

        bookings.forEach(booking => {
            const checkInDate = new Date(booking.checkIn);
            const now = new Date();
            const hoursUntil = (checkInDate - now) / (1000 * 60 * 60);

            // Remind 24 hours before
            if (hoursUntil > 23 && hoursUntil < 24) {
                this.createNotification({
                    type: 'booking_reminder',
                    title: 'Upcoming Trip',
                    message: `Your trip to ${booking.parkName} starts tomorrow!`,
                    priority: 'high',
                    actions: [{
                        id: 'view_booking',
                        label: 'View Booking',
                        primary: true,
                        handler: () => window.location.href = '/booking.html'
                    }]
                });
            }

            // Remind 1 hour before
            if (hoursUntil > 0 && hoursUntil < 1) {
                this.createNotification({
                    type: 'booking_reminder',
                    title: 'Trip Starting Soon',
                    message: `Your trip to ${booking.parkName} starts in 1 hour!`,
                    priority: 'high'
                });
            }
        });
    }

    // Check if in quiet hours
    isInQuietHours() {
        if (!this.preferences.quietHours.enabled) {
            return false;
        }

        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const currentTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

        const startTime = this.preferences.quietHours.start;
        const endTime = this.preferences.quietHours.end;

        if (startTime < endTime) {
            return currentTime >= startTime && currentTime < endTime;
        } else {
            return currentTime >= startTime || currentTime < endTime;
        }
    }

    // Get notifications
    getNotifications(options = {}) {
        const {
            type = null,
            unreadOnly = false,
            limit = null
        } = options;

        let filtered = this.notifications;

        if (type) {
            filtered = filtered.filter(n => n.type === type);
        }

        if (unreadOnly) {
            filtered = filtered.filter(n => !n.read);
        }

        filtered = filtered.sort((a, b) => b.timestamp - a.timestamp);

        if (limit) {
            filtered = filtered.slice(0, limit);
        }

        return filtered;
    }

    // Get unread count
    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    // Mark all as read
    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.saveNotifications();
    }

    // Clear old notifications
    clearOldNotifications(daysOld = 7) {
        const cutoffDate = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
        this.notifications = this.notifications.filter(n => n.timestamp > cutoffDate);
        this.saveNotifications();
    }

    // Update preferences
    updatePreferences(updates) {
        this.preferences = {
            ...this.preferences,
            ...updates
        };
        localStorage.setItem('notification-preferences', JSON.stringify(this.preferences));

        if (window.gaManager) {
            window.gaManager.trackEvent('notification_preferences_updated', {
                preferences: Object.keys(updates)
            });
        }

        return this.preferences;
    }

    // Subscribe to notifications
    subscribe(subscription) {
        this.subscriptions.push({
            id: 'sub_' + Date.now(),
            ...subscription,
            subscribedAt: new Date().toISOString()
        });

        localStorage.setItem('notification-subscriptions', JSON.stringify(this.subscriptions));
    }

    // Render notification center
    renderNotificationCenter(containerId = 'notification-center') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const notifications = this.getNotifications();
        const unreadCount = this.getUnreadCount();

        let html = `
            <div class="notification-center">
                <div class="notification-header">
                    <h2>Notifications ${unreadCount > 0 ? `<span class="badge">${unreadCount}</span>` : ''}</h2>
                    <button onclick="notificationManager.markAllAsRead()" class="btn-link">Mark all as read</button>
                </div>
                <div class="notification-list">
        `;

        if (notifications.length === 0) {
            html += '<p class="no-results">No notifications</p>';
        } else {
            notifications.forEach(n => {
                html += `
                    <div class="notification-item ${!n.read ? 'unread' : ''}">
                        <div class="notification-item-content">
                            <h4>${n.title}</h4>
                            <p>${n.message}</p>
                            <span class="notification-time">${new Date(n.createdAt).toLocaleString()}</span>
                        </div>
                        <button onclick="notificationManager.dismissNotification('${n.id}')" class="btn-icon">✕</button>
                    </div>
                `;
            });
        }

        html += `</div></div>`;
        container.innerHTML = html;
    }

    // Save notifications
    saveNotifications() {
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
    }

    // Render preferences panel
    renderPreferencesPanel(containerId = 'notification-preferences') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const p = this.preferences;

        let html = `
            <div class="notification-preferences">
                <div class="pref-group">
                    <h3>Channels</h3>
                    <label>
                        <input type="checkbox" ${p.email ? 'checked' : ''} onchange="notificationManager.updatePreferences({email: this.checked})">
                        Email Notifications
                    </label>
                    <label>
                        <input type="checkbox" ${p.push ? 'checked' : ''} onchange="notificationManager.updatePreferences({push: this.checked})">
                        Push Notifications
                    </label>
                    <label>
                        <input type="checkbox" ${p.inApp ? 'checked' : ''} onchange="notificationManager.updatePreferences({inApp: this.checked})">
                        In-App Notifications
                    </label>
                </div>

                <div class="pref-group">
                    <h3>Types</h3>
                    <label>
                        <input type="checkbox" ${p.bookingReminders ? 'checked' : ''} onchange="notificationManager.updatePreferences({bookingReminders: this.checked})">
                        Booking Reminders
                    </label>
                    <label>
                        <input type="checkbox" ${p.weatherAlerts ? 'checked' : ''} onchange="notificationManager.updatePreferences({weatherAlerts: this.checked})">
                        Weather Alerts
                    </label>
                    <label>
                        <input type="checkbox" ${p.newFeatures ? 'checked' : ''} onchange="notificationManager.updatePreferences({newFeatures: this.checked})">
                        New Features
                    </label>
                </div>

                <div class="pref-group">
                    <h3>Quiet Hours</h3>
                    <label>
                        <input type="checkbox" ${p.quietHours.enabled ? 'checked' : ''} onchange="notificationManager.updatePreferences({quietHours: {...notificationManager.preferences.quietHours, enabled: this.checked}})">
                        Enable Quiet Hours
                    </label>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }
}

const notificationManager = new NotificationManager();
