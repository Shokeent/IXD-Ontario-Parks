// Google Analytics 4 Integration
// Add your GA4 measurement ID to initialize GA tracking

class GoogleAnalyticsManager {
    constructor(measurementId = null) {
        this.measurementId = measurementId || localStorage.getItem('ga_measurement_id');
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (!this.measurementId) {
            console.warn('Google Analytics 4: Measurement ID not configured');
            return;
        }

        // Load Google Analytics script
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
        document.head.appendChild(script);

        // Configure gtag
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', this.measurementId, {
            'page_path': window.location.pathname,
            'anonymize_ip': true
        });

        this.isInitialized = true;
    }

    // Track page view
    trackPageView(pageName, pageLocation = null) {
        if (!this.isInitialized) return;

        gtag('event', 'page_view', {
            'page_title': pageName,
            'page_location': pageLocation || window.location.href
        });
    }

    // Track event
    trackEvent(eventName, eventData = {}) {
        if (!this.isInitialized) return;

        gtag('event', eventName, eventData);
    }

    // Track user engagement
    trackEngagement(engagementTime = 1) {
        if (!this.isInitialized) return;

        gtag('event', 'engagement', {
            'engagement_time_msec': engagementTime
        });
    }

    // Track search
    trackSearch(searchTerm, resultsCount = null) {
        if (!this.isInitialized) return;

        gtag('event', 'search', {
            'search_term': searchTerm,
            'results_count': resultsCount
        });
    }

    // Track view item (park)
    trackViewItem(itemId, itemName, itemCategory = 'park') {
        if (!this.isInitialized) return;

        gtag('event', 'view_item', {
            'currency': 'CAD',
            'value': 0,
            'items': [{
                'item_id': itemId,
                'item_name': itemName,
                'item_category': itemCategory
            }]
        });
    }

    // Track add to cart (booking)
    trackAddToCart(itemId, itemName, price) {
        if (!this.isInitialized) return;

        gtag('event', 'add_to_cart', {
            'currency': 'CAD',
            'value': price,
            'items': [{
                'item_id': itemId,
                'item_name': itemName,
                'price': price,
                'quantity': 1
            }]
        });
    }

    // Track purchase
    trackPurchase(transactionId, transactionValue, items = []) {
        if (!this.isInitialized) return;

        gtag('event', 'purchase', {
            'transaction_id': transactionId,
            'currency': 'CAD',
            'value': transactionValue,
            'items': items
        });
    }

    // Track exception
    trackException(description, fatal = false) {
        if (!this.isInitialized) return;

        gtag('event', 'exception', {
            'description': description,
            'fatal': fatal
        });
    }

    // Set user ID
    setUserId(userId) {
        if (!this.isInitialized) return;

        gtag('config', this.measurementId, {
            'user_id': userId
        });
    }

    // Set user properties
    setUserProperty(property, value) {
        if (!this.isInitialized) return;

        gtag('set', {
            'user_properties': {
                [property]: value
            }
        });
    }
}

// Initialize GA4 globally
const gaManager = new GoogleAnalyticsManager();

// Track page views automatically
document.addEventListener('DOMContentLoaded', () => {
    const pageName = document.title.split(' - ')[0] || 'Page';
    gaManager.trackPageView(pageName);
});
