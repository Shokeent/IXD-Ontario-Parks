// Ontario Parks Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initHeroSlider();
    initNewsletterForm();
    initParkCards();
    initScrollAnimations();
    initMobileMenu();

    // Register service worker for PWA
    registerServiceWorker();

    // Load featured parks from API
    loadFeaturedParks();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'white';
            navbar.style.backdropFilter = 'none';
        }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Hero slider functionality
function initHeroSlider() {
    const dots = document.querySelectorAll('.hero-dots .dot');
    const heroContent = document.querySelector('.hero-content');
    
    // Only initialize if hero content exists (for homepage)
    if (!heroContent || !dots.length) {
        return;
    }
    
    const heroSlides = [
        {
            title: "Your First Ontario<br>Adventure Starts Here",
            description: "We guide newcomers and first-time campers through every step<br>from gear prep to unforgettable memories. No experience needed, just curiosity!",
            background: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        },
        {
            title: "Discover Ontario's<br>Natural Wonders",
            description: "From pristine lakes to ancient forests, explore over 330 parks<br>with expert guidance and beginner-friendly facilities.",
            background: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        },
        {
            title: "Family Adventures<br>Made Simple",
            description: "Safe, educational, and fun outdoor experiences designed<br>specifically for families and children of all ages.",
            background: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2089&q=80"
        },
        {
            title: "Connect with Nature<br>and Community",
            description: "Join thousands of newcomers discovering Ontario's outdoors<br>with multilingual support and cultural welcome programs.",
            background: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        },
        {
            title: "Year-Round Outdoor<br>Experiences",
            description: "From summer camping to winter activities, discover<br>Ontario's parks in every season with expert guidance.",
            background: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
        }
    ];

    let currentSlide = 0;

    function updateSlide(index) {
        const slide = heroSlides[index];
        const title = heroContent.querySelector('.hero-title');
        const description = heroContent.querySelector('.hero-description');
        const heroSection = document.getElementById('hero-section');
        
        // Add fade out effect
        title.style.opacity = '0';
        description.style.opacity = '0';
        
        // Update background image
        if (slide && slide.background && heroSection) {
            heroSection.style.backgroundImage = `url('${slide.background}')`;
        }
        
        setTimeout(() => {
            if (slide) {
                title.innerHTML = slide.title;
                description.innerHTML = slide.description;
            }
            title.style.opacity = '1';
            description.style.opacity = '1';
        }, 300);

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            currentSlide = index;
            updateSlide(currentSlide);
        });
    });

    // Initialize first slide background
    const heroSection = document.getElementById('hero-section');
    if (heroSection && heroSlides[0].background) {
        heroSection.style.backgroundImage = `url('${heroSlides[0].background}')`;
    }

    // Auto-advance slides
    setInterval(() => {
        currentSlide = (currentSlide + 1) % heroSlides.length;
        updateSlide(currentSlide);
    }, 5000);
}

// Newsletter form functionality
function initNewsletterForm() {
    const forms = document.querySelectorAll('.newsletter-form, .newsletter-form-modern');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = this.querySelector('.email-input, .email-input-modern');
            if (!emailInput) return;

            const email = emailInput.value.trim();
            if (validateEmail(email)) {
                localStorage.setItem('newsletterEmail', email);
                showNotification(`Subscribed! We'll send park updates to ${email}.`, 'success');
                emailInput.value = '';
                form.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    });
}

// Park cards interactions
function initParkCards() {
    const parkCards = document.querySelectorAll('.park-card');
    
    parkCards.forEach(card => {
        const viewDetailsBtn = card.querySelector('.btn-secondary');
        const bookNowBtn = card.querySelector('.btn-primary');
        
        // View Details functionality
        viewDetailsBtn?.addEventListener('click', function() {
            const parkId = card.dataset.parkId;
            if (parkId) {
                localStorage.setItem('selectedParkId', parkId);
                window.location.href = 'park-details.html';
            } else {
                const parkName = card.querySelector('h3').textContent;
                showParkModal(parkName);
            }
        });
        
        // Book Now functionality
        bookNowBtn?.addEventListener('click', function() {
            const parkId = card.dataset.parkId;
            if (parkId) {
                localStorage.setItem('selectedParkId', parkId);
                window.location.href = 'booking.html';
            } else {
                const parkName = card.querySelector('h3').textContent;
                startBookingProcess(parkName);
            }
        });

        // Card hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.park-card, .feature-card, .section-title').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Mobile menu functionality
function initMobileMenu() {
    // Create mobile menu toggle button if it doesn't exist
    const navbar = document.querySelector('.nav-container');
    const navMenu = document.querySelector('.nav-menu');

    if (!navbar || !navMenu) return;

    let mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (!mobileMenuBtn) {
        mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '☰';
        mobileMenuBtn.setAttribute('aria-label', 'Toggle navigation menu');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        navbar.appendChild(mobileMenuBtn);
    }

    mobileMenuBtn.addEventListener('click', function() {
        const isOpen = navMenu.classList.toggle('mobile-active');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll('a, button');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('mobile-active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
        });
    });

    // Show/hide mobile menu based on screen size
    function checkScreenSize() {
        const isMobile = window.innerWidth <= 768;
        mobileMenuBtn.style.display = isMobile ? 'block' : 'none';
        navMenu.style.display = isMobile ? (navMenu.classList.contains('mobile-active') ? 'flex' : 'none') : 'flex';
    }

    window.addEventListener('resize', debounceResize(checkScreenSize, 250));
    checkScreenSize();
}

// Debounce function for resize events
function debounceResize(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utility functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Sanitize user input to prevent XSS attacks
function sanitizeInput(input) {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}

// Validate and sanitize search input
function validateSearchInput(input) {
    if (!input || typeof input !== 'string') return '';
    // Remove potentially dangerous characters
    return input.replace(/[<>\"']/g, '').trim();
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#17a2b8'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    const closeBtn = notification.querySelector('button');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        margin: 0;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function showParkModal(parkName) {
    // Navigate to park details page
    showNotification(`Loading detailed information for ${parkName}...`, 'info');
    
    setTimeout(() => {
        window.location.href = 'park-details.html';
    }, 1000);
}

function startBookingProcess(parkName) {
    // This would typically start the booking flow
    showNotification(`Starting booking process for ${parkName}...`, 'info');
    
    // In a real implementation, you would:
    // 1. Redirect to booking page or open booking modal
    // 2. Pre-populate the park selection
    // 3. Guide user through date selection, site selection, etc.
}

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error caught:', event.error);
    showNotification('An unexpected error occurred. Please refresh the page.', 'error');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showNotification('An error occurred. Please try again.', 'error');
});
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .mobile-menu-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #2c5530;
    }
    
    @media (max-width: 768px) {
        .nav-menu {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            padding: 1rem;
            gap: 1rem;
        }
        
        .nav-menu.mobile-active {
            display: flex !important;
        }
    }
`;
document.head.appendChild(style);

// Loading state manager
const loadingManager = {
    isLoading: false,
    loadingElement: null,

    show(message = 'Loading...') {
        if (this.isLoading) return;

        this.isLoading = true;
        this.loadingElement = document.createElement('div');
        this.loadingElement.id = 'global-loading-overlay';
        this.loadingElement.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 9999;">
                <div style="background: white; padding: 2rem; border-radius: 12px; text-align: center;">
                    <div style="width: 40px; height: 40px; border: 4px solid #e5e7eb; border-top: 4px solid #059669; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;"></div>
                    <p style="color: #6b7280; margin: 0;">${message}</p>
                </div>
            </div>
        `;
        document.body.appendChild(this.loadingElement);
    },

    hide() {
        if (!this.isLoading) return;
        if (this.loadingElement) {
            this.loadingElement.remove();
        }
        this.isLoading = false;
    }
};

// Add spin animation
const spinStyle = document.createElement('style');
spinStyle.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(spinStyle);
    constructor() {
        this.selectedPark = null;
        this.selectedDates = null;
        this.selectedSite = null;
    }
    
    selectPark(parkName) {
        this.selectedPark = parkName;
        showNotification(`Selected ${parkName} for booking`, 'success');
    }
    
    selectDates(checkIn, checkOut) {
        this.selectedDates = { checkIn, checkOut };
        showNotification(`Dates selected: ${checkIn} to ${checkOut}`, 'success');
    }
    
    completeBooking() {
        if (this.selectedPark && this.selectedDates) {
            showNotification('Booking confirmed! Check your email for details.', 'success');
            this.reset();
        } else {
            showNotification('Please select a park and dates first.', 'error');
        }
    }
    
    reset() {
        this.selectedPark = null;
        this.selectedDates = null;
        this.selectedSite = null;
    }
}

// Simple analytics tracker for user interactions
const analyticsTracker = {
    events: [],
    sessionId: generateSessionId(),

    track(eventName, eventData = {}) {
        const event = {
            name: eventName,
            timestamp: new Date().toISOString(),
            data: eventData,
            url: window.location.href,
            sessionId: this.sessionId
        };
        this.events.push(event);

        // Log to console in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('[Analytics]', eventName, eventData);
        }

        // Store in localStorage (simple implementation)
        try {
            localStorage.setItem(`analytics_${this.sessionId}`, JSON.stringify(this.events));
        } catch (e) {
            console.warn('Failed to store analytics:', e);
        }
    },

    trackPageView(pageName) {
        this.track('page_view', { pageName });
    },

    trackButton(buttonName, buttonLocation) {
        this.track('button_click', { buttonName, buttonLocation });
    },

    trackSearch(searchTerm, resultsCount) {
        this.track('search', { searchTerm, resultsCount });
    },

    trackBooking(parkName, campsiteName) {
        this.track('booking_started', { parkName, campsiteName });
    }
};

function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Track initial page view
document.addEventListener('DOMContentLoaded', function() {
    const pageName = document.title.split(' - ')[0] || 'Unknown';
    analyticsTracker.trackPageView(pageName);
});

// Register service worker for PWA support
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration);

                // Check for updates periodically
                setInterval(() => {
                    registration.update();
                }, 60000); // Check every 60 seconds

                // Listen for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            // New service worker is ready, show update notification
                            showNotification('App update available! Refresh to get the latest version.', 'info');
                        }
                    });
                });
            })
            .catch(error => {
                console.warn('Service Worker registration failed:', error);
            });

        // Handle controller change (new service worker activated)
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            console.log('Service Worker controller changed');
        });
    }
}

// Navigate to park details with park ID
function navigateToParkDetails(parkId) {
    localStorage.setItem('selectedParkId', parkId);
    window.location.href = 'park-details.html';
}

// Scroll-to-top button — injected on every page
(function() {
    const btn = document.createElement('button');
    btn.id = 'scroll-to-top-btn';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '&#8679;';
    btn.style.cssText = 'position:fixed;bottom:24px;right:24px;width:44px;height:44px;border-radius:50%;background:#059669;color:white;border:none;font-size:22px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.2);display:none;align-items:center;justify-content:center;z-index:9000;transition:opacity 0.2s;';
    document.body.appendChild(btn);
    window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 400 ? 'flex' : 'none';
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// Navigate to booking page with park ID
function navigateToBooking(parkId) {
    localStorage.setItem('selectedParkId', parkId);
    window.location.href = 'booking.html';
}

// Load featured parks from API
async function loadFeaturedParks() {
    // Only load on homepage (check if featured parks container exists)
    const featuredParksContainer = document.querySelector('.perfect-parks .parks-grid') || 
                                 document.querySelector('.featured-parks .parks-grid') ||
                                 document.querySelector('.featured-parks-container') ||
                                 document.querySelector('.parks-showcase');
    
    if (!featuredParksContainer) {
        return; // Not on homepage
    }
    
    try {
        // Show loading state
        featuredParksContainer.innerHTML = `
            <div class="loading-featured-parks">
                <div class="loading-spinner"></div>
                <p>Loading featured parks...</p>
            </div>
        `;
        
        // Wait for API to be available
        if (!window.ontarioParksAPI) {
            console.warn('Parks API not available, using fallback');
            loadFallbackFeaturedParks(featuredParksContainer);
            return;
        }
        
        // Get featured parks from API
        const featuredParks = await window.ontarioParksAPI.getFeaturedParks(6);
        
        // Render featured parks
        renderFeaturedParks(featuredParks, featuredParksContainer);
        
    } catch (error) {
        console.error('Error loading featured parks:', error);
        loadFallbackFeaturedParks(featuredParksContainer);
    }
}

// Render featured parks
function renderFeaturedParks(parks, container) {
    container.innerHTML = parks.map(park => `
        <div class="park-card" data-park-id="${park.id}">
            <div class="park-image">
                <img src="${park.image}" alt="${park.name}" loading="lazy">
                <span class="difficulty-badge ${park.difficulty.toLowerCase()}">${park.difficulty}</span>
                ${park.pets ? '<span class="pets-badge">🐕 Pet Friendly</span>' : ''}
            </div>
            <div class="park-content">
                <h3>${park.name}</h3>
                <p class="park-region">${park.region}</p>
                <p class="park-description">${park.description.substring(0, 120)}...</p>
                <div class="park-highlights">
                    <span class="highlight">🏕️ ${park.campgrounds} Campgrounds</span>
                    <span class="highlight">👥 Up to ${park.maxOccupancy}</span>
                    ${park.accessibility ? '<span class="highlight">♿ Accessible</span>' : ''}
                </div>
                <div class="park-actions">
                    <button class="btn btn-secondary">View Details</button>
                    <button class="btn btn-primary">Book Now</button>
                </div>
                <div class="park-pricing">
                    <span class="price">From $${park.pricing.tent}/night</span>
                </div>
            </div>
        </div>
    `).join('');
    
    // Re-initialize park card interactions
    initParkCards();
}

// Fallback featured parks if API fails
function loadFallbackFeaturedParks(container) {
    const fallbackParks = [
        {
            id: 'algonquin-fallback',
            name: 'Algonquin Provincial Park',
            region: 'Central Ontario',
            description: 'Experience pristine wilderness, crystal-clear lakes, and diverse wildlife in Ontario\'s most famous park.',
            image: 'https://via.placeholder.com/400x250/059669/ffffff?text=Algonquin+Park',
            difficulty: 'Beginner',
            campgrounds: 8,
            maxOccupancy: 6,
            pets: true,
            accessibility: true,
            pricing: { tent: 42 }
        },
        {
            id: 'sandbanks-fallback',
            name: 'Sandbanks Provincial Park',
            region: 'Eastern Ontario',
            description: 'Enjoy world-class sandy beaches and unique dune formations perfect for family camping adventures.',
            image: 'https://via.placeholder.com/400x250/ea580c/ffffff?text=Sandbanks+Park',
            difficulty: 'Beginner',
            campgrounds: 4,
            maxOccupancy: 6,
            pets: true,
            accessibility: true,
            pricing: { tent: 45 }
        },
        {
            id: 'killarney-fallback',
            name: 'Killarney Provincial Park',
            region: 'Northern Ontario',
            description: 'Discover stunning white quartzite ridges and crystal-clear lakes in this iconic wilderness destination.',
            image: 'https://via.placeholder.com/400x250/4f46e5/ffffff?text=Killarney+Park',
            difficulty: 'Beginner',
            campgrounds: 6,
            maxOccupancy: 8,
            pets: true,
            accessibility: false,
            pricing: { tent: 38 }
        }
    ];
    
    renderFeaturedParks(fallbackParks, container);
}
