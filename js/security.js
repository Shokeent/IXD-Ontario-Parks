// Security Hardening Module
// Headers, CORS, rate limiting, input validation, XSS/CSRF protection

class SecurityManager {
    constructor() {
        this.rateLimitStore = new Map();
        this.blockList = new Set();
        this.sessionStore = new Map();
        this.csrfTokens = new Map();
        this.initializeSecurityHeaders();
    }

    // Initialize security headers
    initializeSecurityHeaders() {
        // These should be set on server-side, but we can set some via meta tags
        this.addSecurityMetaTags();
        this.setContentSecurityPolicy();
    }

    // Add security meta tags
    addSecurityMetaTags() {
        const metaTags = [
            { name: 'referrer', content: 'strict-origin-when-cross-origin' },
            { name: 'x-ua-compatible', content: 'IE=edge' },
            { httpEquiv: 'x-ua-compatible', content: 'IE=edge' }
        ];

        metaTags.forEach(tag => {
            let meta = document.querySelector(`meta[name="${tag.name}"], meta[http-equiv="${tag.httpEquiv}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                if (tag.name) meta.name = tag.name;
                if (tag.httpEquiv) meta.httpEquiv = tag.httpEquiv;
                meta.content = tag.content;
                document.head.appendChild(meta);
            }
        });
    }

    // Content Security Policy
    setContentSecurityPolicy() {
        const csp = `
            default-src 'self';
            script-src 'self' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com;
            style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
            font-src 'self' https://fonts.gstatic.com;
            img-src 'self' data: https:;
            connect-src 'self' https://api.stripe.com https://www.google-analytics.com https://www.googletagmanager.com;
            frame-src https://js.stripe.com;
            object-src 'none';
            base-uri 'self';
            form-action 'self';
            frame-ancestors 'none';
        `;

        const meta = document.createElement('meta');
        meta.httpEquiv = 'Content-Security-Policy';
        meta.content = csp.replace(/\n/g, ' ');
        document.head.appendChild(meta);
    }

    // CSRF Token Generation & Validation
    generateCSRFToken(identifier = 'default') {
        const token = this.generateSecureToken(32);
        this.csrfTokens.set(identifier, {
            token,
            timestamp: Date.now(),
            expiresIn: 3600000 // 1 hour
        });
        return token;
    }

    validateCSRFToken(token, identifier = 'default') {
        const stored = this.csrfTokens.get(identifier);

        if (!stored) {
            return false;
        }

        if (Date.now() - stored.timestamp > stored.expiresIn) {
            this.csrfTokens.delete(identifier);
            return false;
        }

        return stored.token === token;
    }

    // Rate Limiting
    checkRateLimit(identifier, limit = 10, windowMs = 60000) {
        const now = Date.now();
        const key = `ratelimit_${identifier}`;

        if (!this.rateLimitStore.has(key)) {
            this.rateLimitStore.set(key, []);
        }

        const timestamps = this.rateLimitStore.get(key);
        const recentRequests = timestamps.filter(t => now - t < windowMs);

        if (recentRequests.length >= limit) {
            this.blockList.add(identifier);
            return { allowed: false, retryAfter: (recentRequests[0] + windowMs - now) / 1000 };
        }

        recentRequests.push(now);
        this.rateLimitStore.set(key, recentRequests);

        return { allowed: true };
    }

    // XSS Protection - Input Sanitization
    sanitizeInput(input) {
        if (typeof input !== 'string') return input;

        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // XSS Protection - HTML Escape
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    // XSS Protection - Remove HTML Tags
    stripHtmlTags(input) {
        const regex = /<[^>]*>/g;
        return input.replace(regex, '');
    }

    // Validate Email
    validateEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Validate URL
    validateUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    // Validate Phone Number
    validatePhone(phone) {
        const regex = /^[\d\s\-\+\(\)]{7,}$/;
        return regex.test(phone);
    }

    // Validate Password Strength
    validatePasswordStrength(password) {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*]/.test(password)
        };

        const score = Object.values(requirements).filter(Boolean).length;

        return {
            score, // 0-5
            strength: ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][score],
            requirements,
            isValid: score >= 3 // At least 3 requirements
        };
    }

    // Secure Session Management
    createSession(userId, data = {}) {
        const sessionId = this.generateSecureToken(32);
        const session = {
            userId,
            sessionId,
            data,
            createdAt: Date.now(),
            lastActivity: Date.now(),
            expiresIn: 86400000 // 24 hours
        };

        this.sessionStore.set(sessionId, session);
        localStorage.setItem('session_id', sessionId);

        return sessionId;
    }

    validateSession(sessionId) {
        const session = this.sessionStore.get(sessionId);

        if (!session) {
            return { valid: false, error: 'Session not found' };
        }

        const now = Date.now();
        if (now - session.createdAt > session.expiresIn) {
            this.sessionStore.delete(sessionId);
            return { valid: false, error: 'Session expired' };
        }

        // Update last activity
        session.lastActivity = now;
        return { valid: true, session };
    }

    endSession(sessionId) {
        this.sessionStore.delete(sessionId);
        localStorage.removeItem('session_id');
        return { success: true };
    }

    // Detect and Prevent Common Attacks
    detectSuspiciousActivity(input) {
        const suspiciousPatterns = [
            /<script[^>]*>[\s\S]*?<\/script>/gi, // Script tags
            /javascript:/gi, // JavaScript protocol
            /on\w+\s*=/gi, // Event handlers
            /(<iframe|<object|<embed|<img[^>]+onerror)/gi, // Dangerous tags
            /(union|select|insert|delete|drop|update|exec|execute)/gi // SQL keywords
        ];

        for (const pattern of suspiciousPatterns) {
            if (pattern.test(input)) {
                return {
                    suspicious: true,
                    pattern: pattern.toString()
                };
            }
        }

        return { suspicious: false };
    }

    // Generate Secure Token
    generateSecureToken(length = 32) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let token = '';
        const array = new Uint8Array(length);

        if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
            crypto.getRandomValues(array);
            for (let i = 0; i < length; i++) {
                token += chars[array[i] % chars.length];
            }
        } else {
            // Fallback for older browsers
            for (let i = 0; i < length; i++) {
                token += chars[Math.floor(Math.random() * chars.length)];
            }
        }

        return token;
    }

    // Content-Type Validation
    validateContentType(contentType, allowedTypes = []) {
        if (allowedTypes.length === 0) {
            allowedTypes = ['application/json', 'text/plain', 'image/jpeg', 'image/png'];
        }

        return allowedTypes.some(type => contentType.includes(type));
    }

    // File Upload Validation
    validateFileUpload(file, options = {}) {
        const maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB default
        const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/png', 'application/pdf'];
        const allowedExtensions = options.allowedExtensions || ['jpg', 'jpeg', 'png', 'pdf'];

        const errors = [];

        // Check file size
        if (file.size > maxSize) {
            errors.push(`File size exceeds maximum of ${maxSize / 1024 / 1024}MB`);
        }

        // Check MIME type
        if (!allowedTypes.includes(file.type)) {
            errors.push(`File type ${file.type} not allowed`);
        }

        // Check file extension
        const extension = file.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(extension)) {
            errors.push(`File extension .${extension} not allowed`);
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    // CORS Configuration
    setupCORS(options = {}) {
        const allowedOrigins = options.allowedOrigins || [
            'https://ontarioparks.com',
            'https://www.ontarioparks.com',
            'http://localhost:3000'
        ];

        // Store CORS config for backend
        localStorage.setItem('cors_config', JSON.stringify({
            allowedOrigins,
            allowedMethods: options.allowedMethods || ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
            allowedHeaders: options.allowedHeaders || ['Content-Type', 'Authorization'],
            credentials: options.credentials !== false,
            maxAge: options.maxAge || 86400
        }));

        return { configured: true };
    }

    // HTTP Security Headers (Client-side info for backend)
    getSecurityHeadersConfig() {
        return {
            'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
            'X-Content-Type-Options': 'nosniff',
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Content-Security-Policy': "default-src 'self'",
            'Referrer-Policy': 'strict-origin-when-cross-origin',
            'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
        };
    }

    // Audit Logging
    logSecurityEvent(eventType, details) {
        const event = {
            timestamp: new Date().toISOString(),
            type: eventType,
            details,
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // Store in memory for session
        if (!window.securityAuditLog) {
            window.securityAuditLog = [];
        }
        window.securityAuditLog.push(event);

        // Log to server (in production)
        console.log('Security Event:', event);

        return event;
    }

    // Get Audit Log
    getAuditLog() {
        return window.securityAuditLog || [];
    }

    // Detect Outdated Browser
    detectOutdatedBrowser() {
        const ua = navigator.userAgent;
        const isOldIE = /MSIE|Trident/.test(ua) && !/rv:11/.test(ua);
        const isOldChrome = /Chrome\/([0-9]+)/.test(ua) && parseInt(RegExp.$1) < 50;

        if (isOldIE) {
            return { outdated: true, browser: 'Internet Explorer', recommend: 'Chrome, Firefox, Safari, or Edge' };
        }

        if (isOldChrome) {
            return { outdated: true, browser: 'Chrome ' + RegExp.$1, recommend: 'Please update Chrome' };
        }

        return { outdated: false };
    }

    // SSL/TLS Check
    checkSSL() {
        return {
            isSecure: window.location.protocol === 'https:',
            protocol: window.location.protocol,
            recommendHTTPS: window.location.protocol !== 'https:',
            message: window.location.protocol !== 'https:' ? 'This site should use HTTPS' : 'Site is secure'
        };
    }
}

const securityManager = new SecurityManager();
