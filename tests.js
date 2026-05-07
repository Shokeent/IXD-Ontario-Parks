// Unit Tests - Jest/Vitest Configuration
// Run: npm test

/*
Installation:
npm install --save-dev vitest @vitest/ui happy-dom

package.json:
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
*/

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

// ============= AUTHENTICATION TESTS =============

describe('UserAuthManager', () => {
    let authManager;

    beforeEach(() => {
        authManager = new UserAuthManager();
        localStorage.clear();
    });

    describe('User Registration', () => {
        it('should register a new user with valid credentials', async () => {
            const result = await authManager.registerUser(
                'newuser@test.com',
                'Password123!',
                { firstName: 'John' }
            );

            expect(result.success).toBe(true);
            expect(result.userId).toBeDefined();
        });

        it('should reject duplicate email registration', async () => {
            await authManager.registerUser('test@test.com', 'Password123!');
            const result = await authManager.registerUser('test@test.com', 'Password123!');

            expect(result.success).toBe(false);
            expect(result.error).toContain('already registered');
        });

        it('should reject weak passwords', async () => {
            const result = await authManager.registerUser(
                'test@test.com',
                'weak'
            );

            expect(result.success).toBe(false);
            expect(result.error).toContain('password');
        });

        it('should reject invalid email', async () => {
            const result = await authManager.registerUser(
                'invalid-email',
                'Password123!'
            );

            expect(result.success).toBe(false);
            expect(result.error).toContain('email');
        });
    });

    describe('User Login', () => {
        beforeEach(async () => {
            await authManager.registerUser('test@test.com', 'Password123!');
        });

        it('should login user with correct credentials', async () => {
            const result = await authManager.loginUser('test@test.com', 'Password123!');

            expect(result.success).toBe(true);
            expect(result.user).toBeDefined();
            expect(authManager.isAuthenticated).toBe(true);
        });

        it('should reject login with wrong password', async () => {
            const result = await authManager.loginUser('test@test.com', 'WrongPassword');

            expect(result.success).toBe(false);
            expect(result.error).toContain('password');
        });

        it('should reject login for non-existent user', async () => {
            const result = await authManager.loginUser('nonexistent@test.com', 'Password123!');

            expect(result.success).toBe(false);
        });
    });

    describe('Profile Management', () => {
        beforeEach(async () => {
            await authManager.registerUser('test@test.com', 'Password123!');
            await authManager.loginUser('test@test.com', 'Password123!');
        });

        it('should update user profile', async () => {
            const result = await authManager.updateProfile({
                firstName: 'Jane',
                lastName: 'Doe',
                phone: '416-555-0123'
            });

            expect(result.success).toBe(true);
            expect(result.user.firstName).toBe('Jane');
            expect(result.user.phone).toBe('416-555-0123');
        });

        it('should update preferences', () => {
            const result = authManager.updatePreferences({
                newsletter: true,
                notifications: false
            });

            expect(result.success).toBe(true);
            expect(result.preferences.newsletter).toBe(true);
            expect(result.preferences.notifications).toBe(false);
        });
    });

    describe('Password Management', () => {
        beforeEach(async () => {
            await authManager.registerUser('test@test.com', 'Password123!');
            await authManager.loginUser('test@test.com', 'Password123!');
        });

        it('should change password successfully', async () => {
            const result = await authManager.changePassword(
                'Password123!',
                'NewPassword456!'
            );

            expect(result.success).toBe(true);
        });

        it('should reject incorrect current password', async () => {
            const result = await authManager.changePassword(
                'WrongPassword',
                'NewPassword456!'
            );

            expect(result.success).toBe(false);
        });

        it('should request password reset', async () => {
            const result = await authManager.requestPasswordReset('test@test.com');

            expect(result.success).toBe(true);
            expect(result.resetToken).toBeDefined();
        });
    });
});

// ============= FEATURE FLAGS TESTS =============

describe('FeatureFlagsManager', () => {
    let featureFlags;

    beforeEach(() => {
        featureFlags = new FeatureFlagsManager();
        localStorage.clear();
    });

    it('should check if feature is enabled', () => {
        featureFlags.setFlag('test-feature', true, 100);

        expect(featureFlags.isEnabled('test-feature')).toBe(true);
    });

    it('should respect rollout percentage', () => {
        featureFlags.setFlag('test-feature', true, 50);

        // Test multiple times to verify randomness
        const results = [];
        for (let i = 0; i < 100; i++) {
            featureFlags.userVariant = Math.random().toString();
            results.push(featureFlags.isEnabled('test-feature'));
        }

        expect(results.filter(Boolean).length).toBeGreaterThan(20);
        expect(results.filter(Boolean).length).toBeLessThan(80);
    });

    it('should manage experiments', () => {
        featureFlags.startExperiment('test-exp');

        const experiment = featureFlags.experiments['test-exp'];
        expect(experiment.active).toBe(true);

        featureFlags.endExperiment('test-exp');
        expect(featureFlags.experiments['test-exp'].active).toBe(false);
    });

    it('should assign consistent variant to user', () => {
        featureFlags.startExperiment('test-exp');

        const variant1 = featureFlags.getExperimentVariant('test-exp');
        const variant2 = featureFlags.getExperimentVariant('test-exp');

        expect(variant1.name).toBe(variant2.name);
    });
});

// ============= SECURITY TESTS =============

describe('SecurityManager', () => {
    let securityManager;

    beforeEach(() => {
        securityManager = new SecurityManager();
    });

    describe('Input Validation', () => {
        it('should validate email format', () => {
            expect(securityManager.validateEmail('test@test.com')).toBe(true);
            expect(securityManager.validateEmail('invalid-email')).toBe(false);
        });

        it('should validate phone number', () => {
            expect(securityManager.validatePhone('416-555-0123')).toBe(true);
            expect(securityManager.validatePhone('123')).toBe(false);
        });

        it('should validate password strength', () => {
            const weak = securityManager.validatePasswordStrength('weak');
            expect(weak.strength).toBe('Very Weak');
            expect(weak.isValid).toBe(false);

            const strong = securityManager.validatePasswordStrength('Password123!@#');
            expect(strong.strength).toContain('Strong');
            expect(strong.isValid).toBe(true);
        });

        it('should validate URL format', () => {
            expect(securityManager.validateUrl('https://example.com')).toBe(true);
            expect(securityManager.validateUrl('not-a-url')).toBe(false);
        });
    });

    describe('XSS Protection', () => {
        it('should sanitize HTML input', () => {
            const malicious = '<script>alert("xss")</script>';
            const sanitized = securityManager.sanitizeInput(malicious);

            expect(sanitized).not.toContain('<script>');
        });

        it('should escape HTML characters', () => {
            const input = '<img src=x onerror="alert(1)">';
            const escaped = securityManager.escapeHtml(input);

            expect(escaped).toContain('&lt;');
            expect(escaped).toContain('&gt;');
        });

        it('should strip HTML tags', () => {
            const html = '<div>Hello <b>World</b></div>';
            const stripped = securityManager.stripHtmlTags(html);

            expect(stripped).toBe('Hello World');
        });

        it('should detect suspicious patterns', () => {
            const suspicious = '<script>alert("xss")</script>';
            const result = securityManager.detectSuspiciousActivity(suspicious);

            expect(result.suspicious).toBe(true);
        });
    });

    describe('CSRF Protection', () => {
        it('should generate CSRF token', () => {
            const token = securityManager.generateCSRFToken();

            expect(token).toBeDefined();
            expect(token.length).toBeGreaterThan(0);
        });

        it('should validate CSRF token', () => {
            const token = securityManager.generateCSRFToken('test');
            const isValid = securityManager.validateCSRFToken(token, 'test');

            expect(isValid).toBe(true);
        });

        it('should reject invalid CSRF token', () => {
            securityManager.generateCSRFToken('test');
            const isValid = securityManager.validateCSRFToken('invalid-token', 'test');

            expect(isValid).toBe(false);
        });
    });

    describe('Rate Limiting', () => {
        it('should allow requests within limit', () => {
            const result1 = securityManager.checkRateLimit('user1', 3, 1000);
            const result2 = securityManager.checkRateLimit('user1', 3, 1000);

            expect(result1.allowed).toBe(true);
            expect(result2.allowed).toBe(true);
        });

        it('should block requests exceeding limit', () => {
            securityManager.checkRateLimit('user2', 2, 1000);
            securityManager.checkRateLimit('user2', 2, 1000);
            const result3 = securityManager.checkRateLimit('user2', 2, 1000);

            expect(result3.allowed).toBe(false);
            expect(result3.retryAfter).toBeDefined();
        });
    });

    describe('File Upload Validation', () => {
        it('should validate file upload', () => {
            const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
            const result = securityManager.validateFileUpload(file);

            expect(result.valid).toBe(true);
        });

        it('should reject invalid file type', () => {
            const file = new File(['content'], 'test.exe', { type: 'application/x-msdownload' });
            const result = securityManager.validateFileUpload(file);

            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
        });
    });
});

// ============= PERFORMANCE TESTS =============

describe('PerformanceOptimizer', () => {
    let perfOptimizer;

    beforeEach(() => {
        perfOptimizer = new PerformanceOptimizer();
    });

    it('should track performance metrics', () => {
        const metrics = perfOptimizer.getMetrics();

        expect(metrics.pageLoadTime).toBeDefined();
        expect(metrics.resourceSize).toBeDefined();
    });

    it('should detect network speed', () => {
        const networkInfo = perfOptimizer.getNetworkInfo();

        if (networkInfo) {
            expect(['4g', '3g', '2g', 'slow-2g']).toContain(networkInfo.effectiveType);
        }
    });

    it('should generate secure tokens', () => {
        const token = perfOptimizer.generateSecureToken(32);

        expect(token.length).toBe(32);
        expect(/^[a-zA-Z0-9]+$/.test(token)).toBe(true);
    });
});

// ============= API CLIENT TESTS =============

describe('BackendAPIClient', () => {
    let apiClient;

    beforeEach(() => {
        apiClient = new BackendAPIClient();
        localStorage.setItem('api_mock_mode', 'true');
    });

    it('should fetch parks', async () => {
        const result = await apiClient.getParks();

        expect(result.success).toBe(true);
        expect(Array.isArray(result.parks)).toBe(true);
        expect(result.parks.length).toBeGreaterThan(0);
    });

    it('should get park details', async () => {
        const result = await apiClient.getParkDetails('algonquin-park');

        expect(result.success).toBe(true);
        expect(result.park.id).toBe('algonquin-park');
    });

    it('should search parks', async () => {
        const result = await apiClient.searchParks('algonquin');

        expect(result.success).toBe(true);
        expect(Array.isArray(result.parks)).toBe(true);
    });

    it('should create booking', async () => {
        const result = await apiClient.createBooking({
            parkId: 'algonquin-park',
            guestName: 'John Doe',
            checkIn: '2026-06-01',
            checkOut: '2026-06-03',
            totalCost: 299.99
        });

        expect(result.success).toBe(true);
        expect(result.booking.confirmationId).toBeDefined();
    });

    it('should check availability', async () => {
        const result = await apiClient.checkAvailability(
            'algonquin-park',
            '2026-06-01',
            '2026-06-03'
        );

        expect(result.available).toBeDefined();
        expect(typeof result.availableSites).toBe('number');
    });
});

export default {};
