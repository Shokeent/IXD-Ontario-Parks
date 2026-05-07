# Ontario Parks - Developer Quick Reference

## Core Modules & APIs

### Authentication (`js/auth.js`)
```javascript
const authManager = new UserAuthManager();

// Register user
await authManager.registerUser(email, password, profile);

// Login user
await authManager.loginUser(email, password);

// Get current user
authManager.getCurrentUser();

// Update profile
await authManager.updateProfile({ firstName, lastName, ... });

// Change password
await authManager.changePassword(oldPassword, newPassword);

// Logout
authManager.logoutUser();

// Get user bookings
authManager.getUserBookings();

// Save favorite parks
authManager.saveParks(parkIds);
```

### Feature Flags (`js/feature-flags.js`)
```javascript
const featureFlags = new FeatureFlagsManager();

// Check if feature enabled
if (featureFlags.isEnabled('payment-integration')) {
    // Show feature
}

// Get experiment variant
const variant = featureFlags.getExperimentVariant('checkout-flow-v2');
if (variant?.name === 'variant_a') {
    // Show variant A
}

// Admin: Toggle feature
featureFlags.setFlag('dark-mode', true, 100); // 100% rollout

// Admin: Gradual rollout
featureFlags.setFlag('payment-integration', true, 25); // 25% rollout

// Admin: Run experiment
featureFlags.startExperiment('search-ranking');
featureFlags.endExperiment('search-ranking');
```

### Analytics (`js/analytics.js`)
```javascript
const gaManager = new GoogleAnalyticsManager();

// Track page view
gaManager.trackPageView('All Parks');

// Track event
gaManager.trackEvent('filter_applied', { difficulty: 'easy' });

// Track search
gaManager.trackSearch('algonquin', 150); // 150 results

// Track view item
gaManager.trackViewItem('algonquin-park', 'Algonquin Provincial Park');

// Track purchase
gaManager.trackPurchase('TRANS-123', 299.99, [{
    item_id: 'algonquin-park',
    item_name: 'Algonquin Provincial Park',
    price: 299.99,
    quantity: 1
}]);

// Set user ID
gaManager.setUserId('user-123');

// Set user property
gaManager.setUserProperty('user_type', 'first_timer');
```

### Payments (`js/stripe.js`)
```javascript
const stripeManager = new StripePaymentManager();

// Create payment element
stripeManager.createPaymentElement('card-element');

// Validate card
const result = await stripeManager.validateCard();

// Process checkout
await processCheckout(amount, {
    parkName: 'Algonquin',
    items: [...]
});
```

### Email (`js/email.js`)
```javascript
const emailManager = new EmailServiceManager();

// Send booking confirmation
await emailManager.sendBookingConfirmation('user@example.com', {
    parkName: 'Algonquin',
    campsiteName: 'Site 42',
    checkIn: '2026-06-01',
    checkOut: '2026-06-03',
    totalCost: 299.99,
    confirmationId: 'BOOK-123'
});

// Send reservation summary
await emailManager.sendReservationSummary('user@example.com', {
    name: 'John',
    parkName: 'Algonquin',
    checkIn: '2026-06-01',
    checkOut: '2026-06-03',
    nights: 2
});

// Send newsletter confirmation
await emailManager.sendNewsletterConfirmation('user@example.com');
```

### API Client (`js/api-client.js`)
```javascript
const apiClient = new BackendAPIClient();

// Get parks
const result = await apiClient.getParks({ difficulty: 'easy' });

// Get park details
const parkDetails = await apiClient.getParkDetails('algonquin-park');

// Search parks
const searchResults = await apiClient.searchParks('algonquin');

// Check availability
const availability = await apiClient.checkAvailability(
    'algonquin-park',
    '2026-06-01',
    '2026-06-03'
);

// Create booking
const booking = await apiClient.createBooking({
    parkId: 'algonquin-park',
    guestName: 'John Smith',
    checkIn: '2026-06-01',
    checkOut: '2026-06-03',
    totalCost: 299.99
});

// Create payment intent
const intent = await apiClient.createPaymentIntent(299.99, 'cad');

// Toggle mock mode
setMockMode(true); // Reload page
```

### Performance (`js/performance.js`)
```javascript
const perfOptimizer = new PerformanceOptimizer();

// Lazy load images
perfOptimizer.lazyLoadImages('img[data-src]');

// Preload critical resources
perfOptimizer.preloadResource('/css/critical.css', 'style');
perfOptimizer.preloadResource('/fonts/inter.woff2', 'font');

// Prefetch non-critical resources
perfOptimizer.prefetchResource('/all-parks.html');

// Dynamically load modules
const module = await perfOptimizer.loadModule('./heavy-module.js');

// Get performance metrics
const metrics = perfOptimizer.getMetrics();
// { pageLoadTime, firstContentfulPaint, largestContentfulPaint, ... }

// Report to analytics
perfOptimizer.reportMetrics(gaManager);

// Check network speed
const networkInfo = perfOptimizer.getNetworkInfo();
const quality = perfOptimizer.adaptiveLoad(); // 'low-quality' or 'high-quality'
```

### SEO (`js/seo.js`)
```javascript
const seoOptimizer = new SEOOptimizer();

// Set page meta
seoOptimizer.setPageMeta({
    title: 'Algonquin Provincial Park | Ontario Parks',
    description: 'Discover Algonquin Provincial Park...',
    keywords: 'algonquin, camping, hiking, ontario',
    image: 'https://ontarioparks.com/images/algonquin.jpg',
    url: 'https://ontarioparks.com/park-details.html'
});

// Add structured data
seoOptimizer.addParkSchema({
    name: 'Algonquin Provincial Park',
    description: '...',
    url: 'https://ontarioparks.com/park-details.html',
    image: '...',
    rating: 4.8,
    reviewCount: 250,
    amenities: ['Hiking', 'Swimming', 'Fishing']
});

// Add breadcrumbs
seoOptimizer.addBreadcrumbSchema([
    { name: 'Home', path: '' },
    { name: 'Parks', path: 'all-parks.html' },
    { name: 'Algonquin', path: 'park-details.html' }
]);

// Add FAQ schema
seoOptimizer.addFAQSchema([
    { question: 'When is the best time to visit?', answer: 'May to October...' },
    { question: 'Do you need experience?', answer: 'No, perfect for first-timers...' }
]);

// Social media optimization
seoOptimizer.addSocialMeta({
    title: 'Algonquin Provincial Park',
    description: 'Discover the perfect camping spot...',
    image: 'https://ontarioparks.com/images/algonquin.jpg',
    twitterHandle: '@OntarioParks'
});

// Generate sitemap
const sitemap = seoOptimizer.generateSitemap([
    { url: 'https://ontarioparks.com/', changefreq: 'daily' },
    { url: 'https://ontarioparks.com/all-parks.html', changefreq: 'weekly' },
    { url: 'https://ontarioparks.com/booking.html', changefreq: 'monthly' }
]);
```

## Configuration

### Enable/Disable Features
```javascript
// Enable mock API
localStorage.setItem('api_mock_mode', 'true');

// Configure Stripe
localStorage.setItem('stripe_key', 'pk_live_xxx');

// Configure GA4
localStorage.setItem('ga_measurement_id', 'G-xxx');

// Configure Email Service
localStorage.setItem('email_api_key', 'sg_xxx');
localStorage.setItem('email_provider', 'sendgrid'); // or 'mailgun'

// Configure API Base URL
localStorage.setItem('api_base_url', 'https://api.ontarioparks.com');
```

## Common Patterns

### Check Authentication
```javascript
if (!authManager.isAuthenticated) {
    window.location.href = 'login.html';
}
```

### Conditional Rendering Based on Feature Flag
```javascript
const showNewBooking = featureFlags.isEnabled('booking-redesign');
document.getElementById('booking-new').style.display = showNewBooking ? 'block' : 'none';
```

### A/B Testing
```javascript
const variant = featureFlags.getExperimentVariant('checkout-flow-v2');

if (variant?.name === 'control') {
    showOriginalCheckout();
} else if (variant?.name === 'variant_a') {
    showSimplifiedCheckout();
}

gaManager.trackEvent('checkout_variant', { variant: variant?.name });
```

### Error Handling
```javascript
try {
    const result = await apiClient.createBooking(bookingData);
    if (result.success) {
        gaManager.trackPurchase(result.bookingId, amount, items);
    } else {
        showError(result.error);
    }
} catch (error) {
    gaManager.trackException(error.message);
    showError('An error occurred');
}
```

### Performance Monitoring
```javascript
window.addEventListener('load', () => {
    setTimeout(() => {
        perfOptimizer.reportMetrics(gaManager);
    }, 5000);
});
```

## File Structure
```
/
├── js/
│   ├── auth.js              # User authentication
│   ├── analytics.js         # GA4 integration
│   ├── stripe.js            # Payment processing
│   ├── email.js             # Email service
│   ├── feature-flags.js     # Feature flags & A/B testing
│   ├── api-client.js        # Backend API client
│   ├── performance.js       # Performance optimization
│   ├── seo.js              # SEO optimization
│   ├── script.js           # Main initialization
│   ├── all-parks.js        # Parks page logic
│   ├── booking.js          # Booking page logic
│   └── park-details.js     # Park details logic
├── admin.html              # Admin dashboard
├── admin-login.html        # Admin login
├── account.html            # User account
├── login.html              # User login/signup
├── booking.html            # Booking page
├── all-parks.html          # Parks discovery
├── park-details.html       # Park details
├── sw.js                   # Service worker
├── manifest.json           # PWA manifest
└── index.html              # Home page
```

## Testing with Demo Data

### Demo Accounts
- **Email:** john@example.com
- **Password:** password123

### Demo Parks
- Algonquin Provincial Park (algonquin-park)
- Killarney Provincial Park (killarney-park)
- Bon Echo Provincial Park (bon-echo-park)

### Test Stripe Cards
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Expired: `4000 0000 0000 0069`

---

**Last Updated:** May 2026
**Version:** 2.0.0
