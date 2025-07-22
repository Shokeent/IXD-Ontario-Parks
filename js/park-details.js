// Park Details Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
    initFilterTabs();
    initMapInteractions();
    initBookingButtons();
    initCampingOptions();
    initDateFilter();
    
    // Load park details from API
    loadParkDetails();
});

// Initialize hero carousel
function initCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;

    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Add active class to current slide and indicator
        slides[index].classList.add('active');
        indicators[index].classList.add('active');

        currentSlide = index;
    }

    // Indicator click handlers
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Auto-advance carousel
    setInterval(() => {
        const nextSlide = (currentSlide + 1) % slides.length;
        showSlide(nextSlide);
    }, 5000);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            const prevSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
            showSlide(prevSlide);
        } else if (e.key === 'ArrowRight') {
            const nextSlide = (currentSlide + 1) % slides.length;
            showSlide(nextSlide);
        }
    });
}

// Initialize filter tabs
function initFilterTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            tabBtns.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Get tab type
            const tabType = this.dataset.tab;
            
            // Filter content based on tab (you can expand this)
            filterContentByTab(tabType);
            
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Initialize map interactions
function initMapInteractions() {
    const mapMarkers = document.querySelectorAll('.map-marker');
    const zoomInBtn = document.querySelector('.zoom-in');
    const zoomOutBtn = document.querySelector('.zoom-out');
    let zoomLevel = 1;

    // Map marker interactions
    mapMarkers.forEach(marker => {
        marker.addEventListener('click', function() {
            const location = this.dataset.location;
            highlightCampground(location);
            showNotification(`Viewing ${location} area details`, 'info');
        });

        // Enhanced hover effect
        marker.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.3)';
            this.style.zIndex = '10';
        });

        marker.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.zIndex = '1';
        });
    });

    // Zoom controls
    zoomInBtn.addEventListener('click', function() {
        if (zoomLevel < 3) {
            zoomLevel += 0.2;
            updateMapZoom();
            showNotification('Zoomed in', 'info');
        }
    });

    zoomOutBtn.addEventListener('click', function() {
        if (zoomLevel > 0.5) {
            zoomLevel -= 0.2;
            updateMapZoom();
            showNotification('Zoomed out', 'info');
        }
    });

    function updateMapZoom() {
        const mapPlaceholder = document.querySelector('.map-placeholder');
        mapPlaceholder.style.transform = `scale(${zoomLevel})`;
        mapPlaceholder.style.transformOrigin = 'center';
    }
}

// Initialize booking buttons
function initBookingButtons() {
    const bookBtns = document.querySelectorAll('.book-btn');
    
    bookBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const campgroundCard = this.closest('.campground-card');
            const campgroundName = campgroundCard.querySelector('h3').textContent;
            
            // Start booking process
            startBookingProcess(campgroundName);
            
            // Visual feedback
            this.style.transform = 'scale(0.95)';
            this.textContent = 'BOOKING...';
            
            setTimeout(() => {
                this.style.transform = 'scale(1)';
                this.textContent = 'BOOK NOW';
            }, 1000);
        });
    });
}

// Initialize camping options
function initCampingOptions() {
    const campingOptions = document.querySelectorAll('.camping-option');
    
    campingOptions.forEach(option => {
        option.addEventListener('click', function() {
            const campingType = this.querySelector('h3').textContent;
            showCampingDetails(campingType);
        });

        // Hover effects
        option.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
        });

        option.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });
}

// Initialize date filter
function initDateFilter() {
    const dateInput = document.querySelector('.filter-input[type="date"]');
    
    if (dateInput) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        dateInput.addEventListener('change', function() {
            const selectedDate = new Date(this.value);
            filterByDate(selectedDate);
        });
    }
}

// Filter content by tab
function filterContentByTab(tabType) {
    const campgroundCards = document.querySelectorAll('.campground-card');
    
    campgroundCards.forEach(card => {
        let shouldShow = true;
        
        switch(tabType) {
            case 'park':
                shouldShow = true; // Show all for park view
                break;
            case 'campground':
                // Show only campgrounds (filter out backpacking)
                const title = card.querySelector('h3').textContent;
                shouldShow = !title.toLowerCase().includes('backpacking');
                break;
            case 'site':
                // Show specific sites
                shouldShow = true;
                break;
            case 'campsite':
                // Show campsites only
                shouldShow = true;
                break;
        }
        
        if (shouldShow) {
            card.style.display = 'block';
            card.style.opacity = '1';
        } else {
            card.style.opacity = '0.5';
        }
    });
    
    showNotification(`Filtered by ${tabType}`, 'info');
}

// Highlight campground on map
function highlightCampground(location) {
    const campgroundCards = document.querySelectorAll('.campground-card');
    
    campgroundCards.forEach(card => {
        const title = card.querySelector('h3').textContent;
        if (title.toLowerCase().includes(location.toLowerCase())) {
            // Highlight the matching campground
            card.style.border = '2px solid #2c5530';
            card.style.backgroundColor = '#f8fff8';
            
            // Scroll to the card
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
                card.style.border = '1px solid #e0e0e0';
                card.style.backgroundColor = 'white';
            }, 3000);
        }
    });
}

// Filter by date
function filterByDate(selectedDate) {
    // This would typically check availability against a database
    const campgroundCards = document.querySelectorAll('.campground-card');
    
    campgroundCards.forEach(card => {
        // Simulate availability check
        const isAvailable = Math.random() > 0.3; // 70% chance of availability
        
        if (isAvailable) {
            card.style.opacity = '1';
            card.querySelector('.book-btn').disabled = false;
            card.querySelector('.book-btn').textContent = 'BOOK NOW';
        } else {
            card.style.opacity = '0.6';
            card.querySelector('.book-btn').disabled = true;
            card.querySelector('.book-btn').textContent = 'UNAVAILABLE';
        }
    });
    
    const dateStr = selectedDate.toLocaleDateString();
    showNotification(`Checked availability for ${dateStr}`, 'info');
}

// Start booking process
function startBookingProcess(campgroundName) {
    showNotification(`Starting booking for ${campgroundName}...`, 'info');
    
    // In a real implementation, this would:
    // 1. Open a booking modal
    // 2. Redirect to booking page
    // 3. Start a multi-step booking wizard
    
    setTimeout(() => {
        // Simulate booking page redirect
        const encodedName = encodeURIComponent(campgroundName);
        showNotification(`Redirecting to booking page...`, 'success');
        
        // In real app: window.location.href = `booking.html?campground=${encodedName}`;
    }, 1500);
}

// Load park details from API
async function loadParkDetails() {
    try {
        // Get park ID from localStorage (set from previous page)
        const parkId = localStorage.getItem('selectedParkId');
        
        if (!parkId) {
            console.warn('No park ID found, using default park data');
            return;
        }
        
        // Wait for API to be available
        if (!window.ontarioParksAPI) {
            console.warn('Parks API not available');
            return;
        }
        
        // Get park data from API
        const park = await window.ontarioParksAPI.getParkById(parkId);
        
        if (!park) {
            console.warn('Park not found:', parkId);
            return;
        }
        
        // Update page content with park data
        updateParkDetailsContent(park);
        
        // Load weather data for the park
        loadParkWeather(parkId);
        
    } catch (error) {
        console.error('Error loading park details:', error);
    }
}

// Update page content with park data
function updateParkDetailsContent(park) {
    // Update park name
    const parkNameElements = document.querySelectorAll('.park-title, h1');
    parkNameElements.forEach(element => {
        if (element) element.textContent = park.name;
    });
    
    // Update breadcrumb
    const breadcrumbElement = document.querySelector('.breadcrumb .current');
    if (breadcrumbElement) breadcrumbElement.textContent = park.name;
    
    // Update page title
    document.title = `${park.name} - Ontario Parks`;
    
    // Update park location
    const locationElements = document.querySelectorAll('.park-location');
    locationElements.forEach(element => {
        if (element) element.textContent = park.region;
    });
    
    // Update park description/overview
    const overviewElements = document.querySelectorAll('.park-overview p');
    overviewElements.forEach(element => {
        if (element) {
            const readMoreLink = element.querySelector('.read-more');
            const readMoreHtml = readMoreLink ? ' <a href="#" class="read-more">Read More</a>' : '';
            element.innerHTML = park.description + readMoreHtml;
        }
    });
    
    // Update carousel images with gallery
    const carouselSlides = document.querySelectorAll('.carousel-slide .hero-image');
    if (carouselSlides.length > 0 && window.ontarioParksAPI) {
        const galleryImages = window.ontarioParksAPI.getParkGallery(park.name);
        
        carouselSlides.forEach((heroDiv, index) => {
            if (heroDiv && galleryImages[index]) {
                heroDiv.style.backgroundImage = `url('${galleryImages[index]}')`;
                heroDiv.style.backgroundSize = 'cover';
                heroDiv.style.backgroundPosition = 'center';
                heroDiv.className = `hero-image`; // Remove placeholder classes
            } else if (heroDiv && galleryImages.length > 0) {
                // Use the main image if we don't have enough gallery images
                heroDiv.style.backgroundImage = `url('${galleryImages[0]}')`;
                heroDiv.style.backgroundSize = 'cover';
                heroDiv.style.backgroundPosition = 'center';
                heroDiv.className = `hero-image`;
            }
        });
    }
    
    // Update activities
    const activitiesContainer = document.querySelector('.activity-tags');
    if (activitiesContainer && park.activities) {
        activitiesContainer.innerHTML = park.activities.map(activity => `
            <span class="activity-tag">${activity}</span>
        `).join('');
    }
    
    // Update amenities
    const amenitiesContainer = document.querySelector('.amenities-list, .park-amenities');
    if (amenitiesContainer && park.amenities) {
        amenitiesContainer.innerHTML = park.amenities.map(amenity => `
            <span class="amenity-tag">${amenity}</span>
        `).join('');
    }
    
    // Update pricing information
    const pricingElements = document.querySelectorAll('.pricing-info, .campsite-prices');
    pricingElements.forEach(element => {
        if (element && park.pricing) {
            element.innerHTML = `
                <div class="price-item">
                    <span class="price-label">Tent Sites:</span>
                    <span class="price-value">$${park.pricing.tent}/night</span>
                </div>
                <div class="price-item">
                    <span class="price-label">RV Sites:</span>
                    <span class="price-value">$${park.pricing.rv}/night</span>
                </div>
                <div class="price-item">
                    <span class="price-label">Cabins:</span>
                    <span class="price-value">$${park.pricing.cabin}/night</span>
                </div>
            `;
        }
    });
    
    // Update park features/details
    const featuresContainer = document.querySelector('.park-features, .park-details');
    if (featuresContainer) {
        featuresContainer.innerHTML = `
            <div class="feature-item">
                <span class="feature-icon">🏕️</span>
                <span class="feature-text">${park.campgrounds} Campgrounds</span>
            </div>
            <div class="feature-item">
                <span class="feature-icon">👥</span>
                <span class="feature-text">Up to ${park.maxOccupancy} people</span>
            </div>
            <div class="feature-item">
                <span class="feature-icon">${park.pets ? '🐕' : '🚫'}</span>
                <span class="feature-text">${park.pets ? 'Pet Friendly' : 'No Pets'}</span>
            </div>
            <div class="feature-item">
                <span class="feature-icon">${park.accessibility ? '♿' : '🚶'}</span>
                <span class="feature-text">${park.accessibility ? 'Accessible' : 'Standard Access'}</span>
            </div>
            <div class="feature-item">
                <span class="feature-icon">🗓️</span>
                <span class="feature-text">${park.season.open} - ${park.season.close}</span>
            </div>
        `;
    }
    
    // Update contact information
    const contactContainer = document.querySelector('.contact-info, .park-contact');
    if (contactContainer && park.contact) {
        contactContainer.innerHTML = `
            <div class="contact-item">
                <span class="contact-label">Phone:</span>
                <a href="tel:${park.contact.phone}" class="contact-value">${park.contact.phone}</a>
            </div>
            <div class="contact-item">
                <span class="contact-label">Email:</span>
                <a href="mailto:${park.contact.email}" class="contact-value">${park.contact.email}</a>
            </div>
        `;
    }
    
    // Update difficulty badge
    const difficultyBadges = document.querySelectorAll('.difficulty-badge');
    difficultyBadges.forEach(badge => {
        if (badge) {
            badge.textContent = park.difficulty;
            badge.className = `difficulty-badge ${park.difficulty.toLowerCase()}`;
        }
    });
}

// Load weather data for the park
async function loadParkWeather(parkId) {
    try {
        const weather = await window.ontarioParksAPI.getWeatherForPark(parkId);
        
        // Update weather display
        const weatherContainer = document.querySelector('.weather-info, .current-weather');
        if (weatherContainer) {
            weatherContainer.innerHTML = `
                <div class="weather-item">
                    <span class="weather-icon">🌡️</span>
                    <span class="weather-value">${weather.temperature}°C</span>
                </div>
                <div class="weather-item">
                    <span class="weather-icon">☁️</span>
                    <span class="weather-value">${weather.description}</span>
                </div>
                <div class="weather-item">
                    <span class="weather-icon">💧</span>
                    <span class="weather-value">${weather.humidity}%</span>
                </div>
                <div class="weather-item">
                    <span class="weather-icon">💨</span>
                    <span class="weather-value">${weather.windSpeed} km/h</span>
                </div>
            `;
        }
        
    } catch (error) {
        console.warn('Weather data not available:', error);
    }
}

// Show camping details
function showCampingDetails(campingType) {
    const detailsModal = createCampingDetailsModal(campingType);
    document.body.appendChild(detailsModal);
    
    // Show modal with animation
    setTimeout(() => {
        detailsModal.style.opacity = '1';
        detailsModal.querySelector('.modal-content').style.transform = 'scale(1)';
    }, 10);
}

// Create camping details modal
function createCampingDetailsModal(campingType) {
    const modal = document.createElement('div');
    modal.className = 'camping-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h2 style="margin: 0; color: #2c5530;">${campingType}</h2>
            <button class="close-modal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
        </div>
        <div style="margin-bottom: 1.5rem;">
            <p style="color: #666; line-height: 1.6;">
                ${getCampingDescription(campingType)}
            </p>
        </div>
        <div style="margin-bottom: 1.5rem;">
            <h3 style="color: #2c5530; margin-bottom: 0.5rem;">Features:</h3>
            <ul style="color: #666;">
                ${getCampingFeatures(campingType)}
            </ul>
        </div>
        <div style="text-align: center;">
            <button class="btn-primary" style="margin-right: 1rem;">Book This Option</button>
            <button class="btn-secondary">Learn More</button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    
    // Close modal functionality
    const closeBtn = modalContent.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.style.opacity = '0';
        setTimeout(() => modal.remove(), 300);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        }
    });
    
    return modal;
}

// Get camping description based on type
function getCampingDescription(type) {
    const descriptions = {
        'Car Camping': 'Drive right up to your campsite with convenient access to your vehicle. Perfect for families and first-time campers.',
        'Dog free Camping': 'Enjoy a peaceful camping experience in designated pet-free areas, ideal for those with allergies or seeking quiet.',
        'Group Camping': 'Large sites designed for groups, families, and organizations. Great for reunions and special events.',
        'Radio Free Camping': 'Disconnect completely in areas where radios and electronic devices are restricted for ultimate tranquility.'
    };
    return descriptions[type] || 'Experience the beauty of Algonquin Provincial Park with this camping option.';
}

// Get camping features based on type
function getCampingFeatures(type) {
    const features = {
        'Car Camping': '<li>Drive-up access</li><li>Electrical hookups available</li><li>Nearby washrooms</li><li>Fire pits and picnic tables</li>',
        'Dog free Camping': '<li>Quiet environment</li><li>Allergy-friendly</li><li>Family-focused</li><li>Peaceful atmosphere</li>',
        'Group Camping': '<li>Large capacity sites</li><li>Group fire pits</li><li>Shared facilities</li><li>Event planning support</li>',
        'Radio Free Camping': '<li>No electronic devices</li><li>Complete digital detox</li><li>Natural sounds only</li><li>Ultimate peace</li>'
    };
    return features[type] || '<li>Beautiful natural setting</li><li>Clean facilities</li><li>Park amenities</li>';
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
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
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent += `
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
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
