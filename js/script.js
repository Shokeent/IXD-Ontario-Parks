// Ontario Parks Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initHeroSlider();
    initNewsletterForm();
    initParkCards();
    initScrollAnimations();
    initMobileMenu();
    
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
            description: "We guide newcomers and first-time campers through every step<br>from gear prep to unforgettable memories. No experience needed, just curiosity!"
        },
        {
            title: "Discover Ontario's<br>Natural Wonders",
            description: "From pristine lakes to ancient forests, explore over 330 parks<br>with expert guidance and beginner-friendly facilities."
        },
        {
            title: "Family Adventures<br>Made Simple",
            description: "Safe, educational, and fun outdoor experiences designed<br>specifically for families and children of all ages."
        },
        {
            title: "Connect with Nature<br>and Community",
            description: "Join thousands of newcomers discovering Ontario's outdoors<br>with multilingual support and cultural welcome programs."
        },
        {
            title: "Year-Round Outdoor<br>Experiences",
            description: "From summer camping to winter activities, discover<br>Ontario's parks in every season with expert guidance."
        }
    ];

    let currentSlide = 0;

    function updateSlide(index) {
        const slide = heroSlides[index];
        const title = heroContent.querySelector('.hero-title');
        const description = heroContent.querySelector('.hero-description');
        
        // Add fade out effect
        title.style.opacity = '0';
        description.style.opacity = '0';
        
        setTimeout(() => {
            title.innerHTML = slide.title;
            description.innerHTML = slide.description;
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

    // Auto-advance slides
    setInterval(() => {
        currentSlide = (currentSlide + 1) % heroSlides.length;
        updateSlide(currentSlide);
    }, 5000);
}

// Newsletter form functionality
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    const emailInput = document.querySelector('.email-input');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        if (validateEmail(email)) {
            // Simulate subscription
            showNotification('Thank you for subscribing! Welcome to the Ontario Parks community.', 'success');
            emailInput.value = '';
        } else {
            showNotification('Please enter a valid email address.', 'error');
        }
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
    // Create mobile menu toggle button
    const navbar = document.querySelector('.nav-container');
    const navMenu = document.querySelector('.nav-menu');
    
    // Mobile menu button (you might want to add this to your HTML)
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '☰';
    mobileMenuBtn.style.display = 'none';
    
    navbar.appendChild(mobileMenuBtn);
    
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('mobile-active');
    });
    
    // Show/hide mobile menu based on screen size
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            mobileMenuBtn.style.display = 'block';
            navMenu.style.display = navMenu.classList.contains('mobile-active') ? 'flex' : 'none';
        } else {
            mobileMenuBtn.style.display = 'none';
            navMenu.style.display = 'flex';
        }
    }
    
    window.addEventListener('resize', checkScreenSize);
    checkScreenSize();
}

// Utility functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
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

// Add CSS for animations
const style = document.createElement('style');
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

// Booking functionality
class BookingSystem {
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
    
    completebooking() {
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

// Initialize booking system
const bookingSystem = new BookingSystem();

// Make booking system globally available
window.bookingSystem = bookingSystem;

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
