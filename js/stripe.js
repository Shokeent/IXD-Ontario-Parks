// Stripe Payment Integration
// Replace 'pk_test_xxx' with your actual Stripe public key

class StripePaymentManager {
    constructor(publishableKey = null) {
        this.publishableKey = publishableKey || localStorage.getItem('stripe_key');
        this.stripe = null;
        this.elements = null;
        this.cardElement = null;
        this.init();
    }

    init() {
        if (!this.publishableKey) {
            console.warn('Stripe: Publishable key not configured');
            return;
        }

        // Load Stripe.js
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        script.onload = () => {
            this.stripe = window.Stripe(this.publishableKey);
            console.log('Stripe initialized successfully');
        };
        document.head.appendChild(script);
    }

    // Create payment element
    createPaymentElement(elementId) {
        if (!this.stripe) {
            console.error('Stripe not initialized');
            return false;
        }

        this.elements = this.stripe.elements();
        this.cardElement = this.elements.create('card');
        this.cardElement.mount('#' + elementId);

        // Handle validation errors
        this.cardElement.on('change', (event) => {
            const displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });

        return true;
    }

    // Process payment
    async processPayment(clientSecret, returnUrl) {
        if (!this.stripe || !this.cardElement) {
            console.error('Stripe not properly initialized');
            return { success: false, error: 'Payment system not ready' };
        }

        try {
            const result = await this.stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: this.cardElement,
                    billing_details: {
                        name: document.querySelector('input[placeholder*="John"]')?.value || 'Guest',
                        email: document.querySelector('input[type="email"]')?.value || 'guest@example.com'
                    }
                }
            });

            if (result.error) {
                return { success: false, error: result.error.message };
            }

            if (result.paymentIntent.status === 'succeeded') {
                return {
                    success: true,
                    paymentIntentId: result.paymentIntent.id,
                    status: result.paymentIntent.status
                };
            }

            return { success: false, error: 'Payment processing failed' };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Create payment intent (should be done on backend)
    async createPaymentIntent(amount, currency = 'cad', metadata = {}) {
        try {
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: Math.round(amount * 100), // Convert to cents
                    currency,
                    metadata
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create payment intent');
            }

            const data = await response.json();
            return { success: true, clientSecret: data.clientSecret };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Validate card
    async validateCard() {
        if (!this.cardElement) {
            return { valid: false, error: 'Card element not initialized' };
        }

        const { token, error } = await this.stripe.createToken(this.cardElement);

        if (error) {
            return { valid: false, error: error.message };
        }

        return { valid: true, token: token.id };
    }

    // Get card details
    getCardDetails() {
        if (!this.cardElement) {
            return null;
        }

        return {
            element: this.cardElement
        };
    }

    // Mount billing address form
    createBillingElement(elementId) {
        if (!this.stripe) {
            console.error('Stripe not initialized');
            return false;
        }

        const addressElement = this.elements.create('address', {
            mode: 'billing'
        });
        addressElement.mount('#' + elementId);

        return addressElement;
    }
}

// Initialize Stripe globally
const stripeManager = new StripePaymentManager();

// Helper function to process checkout
async function processCheckout(amount, bookingDetails = {}) {
    loadingManager.show('Processing payment...');

    try {
        // Create payment intent
        const intentResult = await stripeManager.createPaymentIntent(
            amount,
            'cad',
            bookingDetails
        );

        if (!intentResult.success) {
            throw new Error(intentResult.error);
        }

        // Process payment
        const paymentResult = await stripeManager.processPayment(
            intentResult.clientSecret,
            window.location.origin + '/acknowledge.html'
        );

        loadingManager.hide();

        if (paymentResult.success) {
            showNotification('Payment successful! Your reservation is confirmed.', 'success');

            // Track purchase in analytics
            if (typeof gaManager !== 'undefined') {
                gaManager.trackPurchase(
                    paymentResult.paymentIntentId,
                    amount,
                    bookingDetails.items || []
                );
            }

            // Redirect to confirmation
            setTimeout(() => {
                window.location.href = 'acknowledge.html';
            }, 1500);
        } else {
            showNotification('Payment failed: ' + paymentResult.error, 'error');
        }
    } catch (error) {
        loadingManager.hide();
        showNotification('Payment error: ' + error.message, 'error');
        console.error('Payment error:', error);
    }
}
