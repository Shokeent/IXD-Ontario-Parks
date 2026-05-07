# Ontario Parks Web Application - Implementation Guide

## Overview

This document provides comprehensive documentation for the Ontario Parks web application, including all Phase 2 improvements: PWA, Analytics, Payment Integration, Email Service, Feature Flags, and Admin Dashboard.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Service Integrations](#service-integrations)
3. [Feature Flags & A/B Testing](#feature-flags--ab-testing)
4. [Admin Dashboard](#admin-dashboard)
5. [Backend API Integration](#backend-api-integration)
6. [Deployment Guide](#deployment-guide)
7. [Configuration](#configuration)

---

## System Architecture

### Core Components

```
Ontario Parks Web App
├── Frontend (HTML/CSS/JS)
├── PWA Features (Service Worker, Manifest)
├── Analytics Integration (Google Analytics 4)
├── Payment Processing (Stripe)
├── Email Service (SendGrid/Mailgun)
├── Feature Flags (Client-side management)
├── Admin Dashboard (Booking management)
└── Backend API Client (Mock/Real endpoints)
```

### File Structure

```
/
├── index.html (Home page with PWA meta tags)
├── all-parks.html (Park discovery)
├── park-details.html (Park information)
├── booking.html (Reservation form)
├── review-reservation-customer.html (Checkout page)
├── admin.html (Admin dashboard)
├── admin-login.html (Admin authentication)
├── manifest.json (PWA manifest)
├── sw.js (Service worker)
├── css/
│   └── styles.css
├── js/
│   ├── script.js (Main script with error handling)
│   ├── analytics.js (Google Analytics 4 integration)
│   ├── stripe.js (Stripe payment processing)
│   ├── email.js (Email service integration)
│   ├── feature-flags.js (Feature flags management)
│   ├── api-client.js (Backend API integration)
│   ├── all-parks.js (Park listing logic)
│   ├── booking.js (Booking form logic)
│   ├── park-details.js (Park details logic)
│   └── image-config.js / image-manager.js
└── CDN_CONFIGURATION.md (CDN deployment guide)
```

---

## Service Integrations

### 1. Google Analytics 4 (Analytics)

**File:** `js/analytics.js`

**Key Features:**
- Page view tracking
- Event tracking (search, view item, add to cart, purchase)
- User engagement metrics
- E-commerce integration
- User property management

**Initialization:**
```javascript
const gaManager = new GoogleAnalyticsManager();
```

**Configuration:**
- Set `ga_measurement_id` in localStorage or pass to constructor
- Example: `localStorage.setItem('ga_measurement_id', 'G-XXXXXXXXXX')`

**Usage Examples:**
```javascript
// Track page view
gaManager.trackPageView('All Parks');

// Track search
gaManager.trackSearch('camping', 150);

// Track purchase
gaManager.trackPurchase('TRANS-123', 299.99, [{
    item_id: 'algonquin-park',
    item_name: 'Algonquin Provincial Park',
    price: 299.99,
    quantity: 1
}]);
```

### 2. Stripe Payment Processing

**File:** `js/stripe.js`

**Key Features:**
- Card element creation
- Payment processing via confirmCardPayment
- Payment intent creation
- Card validation
- Billing address collection
- Error handling

**Initialization:**
```javascript
const stripeManager = new StripePaymentManager();
```

**Configuration:**
- Set `stripe_key` in localStorage with your publishable key
- Requires backend endpoint at `/api/create-payment-intent`

**Usage:**
```javascript
// Create payment element
stripeManager.createPaymentElement('card-element');

// Process checkout
await processCheckout(amount, {
    parkName: 'Algonquin',
    items: [{...}]
});
```

**Backend Requirement:**
- Endpoint: `POST /api/create-payment-intent`
- Body: `{ amount, currency, metadata }`
- Returns: `{ clientSecret }`

### 3. Email Service Integration

**File:** `js/email.js`

**Supported Providers:**
- SendGrid (Bearer token authentication)
- Mailgun (Basic authentication)

**Key Features:**
- Booking confirmations
- Reservation summaries
- Newsletter confirmations
- HTML and text email generation

**Configuration:**
- Set `email_api_key` in localStorage
- Set `email_provider` to 'sendgrid' or 'mailgun'
- Set `from_email` for sender address

**Usage:**
```javascript
const emailManager = new EmailServiceManager();

await emailManager.sendBookingConfirmation('user@example.com', {
    parkName: 'Algonquin',
    campsiteName: 'Site 42',
    checkIn: '2026-06-01',
    checkOut: '2026-06-03',
    totalCost: 299.99,
    confirmationId: 'BOOK-123'
});
```

---

## Feature Flags & A/B Testing

### Feature Flags System

**File:** `js/feature-flags.js`

**Key Concepts:**
- Gradual rollout control via percentage
- User variant-based assignment (consistent per user)
- localStorage persistence
- Admin management

**Available Flags:**
- `booking-redesign`: New booking interface (50% rollout)
- `advanced-filters`: Advanced park filtering (30%)
- `gear-rental`: Gear rental feature (20%)
- `social-sharing`: Social sharing buttons (100%)
- `offline-mode`: PWA offline support (100%)
- `analytics-enhanced`: Enhanced analytics (100%)
- `payment-integration`: Stripe integration (10%)
- `email-confirmations`: Email confirmations (15%)
- `admin-dashboard`: Admin portal (5%)
- `dark-mode`: Dark mode theme (0%)

**Usage:**
```javascript
// Check if feature is enabled
if (featureFlags.isEnabled('booking-redesign')) {
    // Show new booking interface
}

// Get variant for experiment
const variant = featureFlags.getExperimentVariant('checkout-flow-v2');
if (variant?.name === 'variant_a') {
    // Show simplified checkout
}
```

**Admin Control:**
```javascript
// Enable feature for all users
featureFlags.setFlag('dark-mode', true, 100);

// Gradual rollout
featureFlags.setFlag('payment-integration', true, 50);

// Run experiment
featureFlags.startExperiment('search-ranking', '2026-06-01', '2026-06-15');
```

### A/B Experiments

**Predefined Experiments:**
1. **checkout-flow-v2**: Original vs Simplified checkout
2. **search-ranking**: Distance-based vs Popularity-based search
3. **recommendation-engine**: Random vs ML-based recommendations

**Managing Experiments:**
```javascript
// Start experiment
featureFlags.startExperiment('checkout-flow-v2');

// End experiment
featureFlags.endExperiment('checkout-flow-v2');

// Check experiment variant
const variant = featureFlags.getExperimentVariant('checkout-flow-v2');
```

---

## Admin Dashboard

### Access

**URL:** `admin-login.html`

**Demo Credentials:**
- Email: `admin@ontarioparks.com`
- Password: `admin123`

### Features

#### 1. Dashboard
- Total bookings count
- Confirmed vs pending bookings
- Revenue calculation
- Recent bookings table

#### 2. Booking Management
- Search bookings
- View booking details
- Edit booking
- Cancel booking

#### 3. Feature Flags
- Toggle features on/off
- Adjust rollout percentage
- Real-time updates

#### 4. Experiments
- View active experiments
- Variant distribution visualization
- Start/end experiments

#### 5. Analytics
- Page views
- Unique users
- Bookings started
- Conversion rate
- Top parks by performance

### Implementation

**Authentication:**
```javascript
// Admin token stored in localStorage
localStorage.getItem('admin_token')
```

**Data Storage:**
- Bookings: `localStorage.getItem('bookings')`
- Feature flags: `localStorage.getItem('feature_flags')`
- Experiments: `localStorage.getItem('experiments')`

---

## Backend API Integration

### API Client

**File:** `js/api-client.js`

**Features:**
- Mock mode for development
- Fallback to mock data on API errors
- Consistent error handling
- Support for real API endpoints

**Initialization:**
```javascript
const apiClient = new BackendAPIClient();
```

**Configuration:**
- `api_base_url`: Set base URL for API
- `api_mock_mode`: Enable mock mode (true/false)

### API Endpoints

#### Parks API
```javascript
// Get all parks
await apiClient.getParks({ difficulty: 'easy' });

// Get park details
await apiClient.getParkDetails('algonquin-park');

// Search parks
await apiClient.searchParks('algonquin');

// Check availability
await apiClient.checkAvailability('algonquin-park', '2026-06-01', '2026-06-03');
```

#### Booking Endpoints
```javascript
// Create booking
await apiClient.createBooking({
    parkId: 'algonquin-park',
    guestName: 'John Doe',
    checkIn: '2026-06-01',
    checkOut: '2026-06-03',
    totalCost: 299.99
});

// Get booking
await apiClient.getBooking('BOOK-123');

// Update booking
await apiClient.updateBooking('BOOK-123', { status: 'confirmed' });

// Cancel booking
await apiClient.cancelBooking('BOOK-123');
```

#### Payment Endpoints
```javascript
// Create payment intent
const result = await apiClient.createPaymentIntent(299.99, 'cad');

// Confirm payment
await apiClient.confirmPayment(result.clientSecret, paymentData);
```

#### Email Endpoints
```javascript
// Send booking confirmation
await apiClient.sendBookingConfirmation(bookingData);

// Send reservation summary
await apiClient.sendReservationSummary('user@example.com', data);
```

### Mock Data

When `api_mock_mode` is enabled, the API client returns mock data:

```javascript
// Enable mock mode
localStorage.setItem('api_mock_mode', 'true');
setMockMode(true); // Reloads page
```

---

## Progressive Web App

### Features

1. **Offline Support**
   - Service worker caches all assets
   - Network-first strategy with fallback
   - Works without internet connection

2. **Installability**
   - Add to home screen
   - Standalone app mode
   - Native-like experience

3. **Auto-Updates**
   - Service worker checks for updates periodically
   - Background sync support

### Files

- `manifest.json`: PWA manifest with metadata
- `sw.js`: Service worker with caching logic

### Registration

```javascript
// Automatically registered in script.js
registerServiceWorker();
```

---

## Deployment Guide

### Pre-Deployment Checklist

- [ ] Configure all API keys in production environment
- [ ] Set up backend endpoints
- [ ] Configure CDN (CloudFront or Cloudflare)
- [ ] Enable HTTPS
- [ ] Set up email service (SendGrid/Mailgun)
- [ ] Configure Stripe production keys
- [ ] Set up Google Analytics 4 property
- [ ] Test payment flow end-to-end
- [ ] Test email confirmations
- [ ] Verify feature flags in production
- [ ] Test admin dashboard
- [ ] Load test the application

### Environment Variables

```javascript
// localStorage-based configuration (development)
localStorage.setItem('stripe_key', 'pk_live_xxx');
localStorage.setItem('ga_measurement_id', 'G-xxx');
localStorage.setItem('email_api_key', 'sg_xxx');
localStorage.setItem('email_provider', 'sendgrid');
localStorage.setItem('api_base_url', 'https://api.ontarioparks.com');
```

### CDN Deployment

See `CDN_CONFIGURATION.md` for detailed setup instructions.

### Backend Setup

Required endpoints:

```
POST /api/create-payment-intent
POST /api/bookings
GET  /api/bookings/{bookingId}
PUT  /api/bookings/{bookingId}
DELETE /api/bookings/{bookingId}
POST /api/emails/booking-confirmation
GET  /api/parks
GET  /api/parks/{parkId}
GET  /api/parks/search
GET  /api/parks/{parkId}/availability
```

---

## Configuration

### Local Development

```javascript
// Enable mock API mode
localStorage.setItem('api_mock_mode', 'true');

// Set test credentials
localStorage.setItem('stripe_key', 'pk_test_xxx');
localStorage.setItem('ga_measurement_id', 'G-test-xxx');
localStorage.setItem('admin_token', 'test-token');
```

### Production

```javascript
// Disable mock mode
localStorage.setItem('api_mock_mode', 'false');

// Set production credentials
localStorage.setItem('stripe_key', 'pk_live_xxx');
localStorage.setItem('ga_measurement_id', 'G-prod-xxx');
localStorage.setItem('email_api_key', 'sg_live_xxx');
localStorage.setItem('api_base_url', 'https://api.ontarioparks.com');
```

### Feature Flag Management

**Development:**
```javascript
// Enable all features for testing
Object.keys(featureFlags.flags).forEach(flag => {
    featureFlags.setFlag(flag, true, 100);
});
```

**Production:**
```javascript
// Gradual rollout
featureFlags.setFlag('payment-integration', true, 25); // 25% rollout
featureFlags.setFlag('email-confirmations', true, 50); // 50% rollout
```

---

## Testing

### Manual Testing Checklist

**Booking Flow:**
- [ ] Search for parks
- [ ] View park details
- [ ] Create booking
- [ ] Verify booking confirmation email
- [ ] Check admin dashboard for new booking

**Payment:**
- [ ] Test with Stripe test card: 4242 4242 4242 4242
- [ ] Verify payment success/failure handling
- [ ] Check transaction in Stripe dashboard

**Analytics:**
- [ ] Verify GA4 events in real-time
- [ ] Check event parameters
- [ ] Verify purchase tracking

**Feature Flags:**
- [ ] Test gradual rollout
- [ ] Verify variant assignment consistency
- [ ] Test experiment variants

**Admin Dashboard:**
- [ ] Login with demo credentials
- [ ] Manage bookings
- [ ] Toggle features
- [ ] Run experiments

---

## Troubleshooting

### Payment Integration Issues

**Issue:** Stripe not initializing
- Check `stripe_key` in localStorage
- Verify Stripe.js is loaded from CDN
- Check browser console for errors

**Issue:** Payment intent creation fails
- Verify backend endpoint is accessible
- Check request body format
- Verify API key authentication

### Email Service Issues

**Issue:** Emails not sent
- Verify `email_api_key` is set
- Check `email_provider` is correct (sendgrid/mailgun)
- Verify from email address is configured
- Check service provider API quota

### Analytics Issues

**Issue:** Events not appearing in GA4
- Verify `ga_measurement_id` is correct
- Check GA4 property is receiving data
- Allow 24-48 hours for data processing
- Check event naming and parameters

### Feature Flag Issues

**Issue:** Flag not applying to user
- Clear localStorage and reload
- Verify flag is enabled and has > 0% rollout
- Check browser console for flag status
- Verify user variant is consistent

---

## Support & References

- [Stripe Documentation](https://stripe.com/docs)
- [SendGrid Documentation](https://docs.sendgrid.com)
- [Google Analytics 4 Documentation](https://support.google.com/analytics)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Worker Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

**Last Updated:** May 2026
**Version:** 2.0.0
