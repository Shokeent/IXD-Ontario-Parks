// Booking Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeBookingPage();
    loadParkBookingData();
});

function initializeBookingPage() {
    setupCampsiteSelection();
    setupMapToggle();
    setupSearchForm();
    setupDateInputs();
}

// Campsite Selection
function setupCampsiteSelection() {
    const campsiteCards = document.querySelectorAll('.campsite-card');
    
    // Select first campsite by default
    if (campsiteCards.length > 0) {
        campsiteCards[0].classList.add('selected');
        updateCampsitePreview(1);
    }
    
    campsiteCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            // Remove selected class from all cards
            campsiteCards.forEach(c => c.classList.remove('selected'));
            
            // Add selected class to clicked card
            this.classList.add('selected');
            
            // Update preview
            updateCampsitePreview(index + 1);
            
            // Scroll to preview on mobile
            if (window.innerWidth <= 1200) {
                document.querySelector('.campsite-preview').scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        });
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 8px 24px rgba(5, 150, 105, 0.15)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = '';
            }
        });
    });
}

function updateCampsitePreview(campsiteNumber) {
    // Campsite data
    const campsiteData = {
        1: {
            title: "Campsite 1",
            type: "Waterfront Site",
            price: 45,
            baseRate: 40,
            premium: 5,
            image: "placeholder-campsite-1",
            features: [
                { icon: "🏕️", text: "Tent & RV friendly (up to 30ft)" },
                { icon: "💧", text: "Lake access • Fire pit • Picnic table" },
                { icon: "📶", text: "WiFi available • Accessible facilities" }
            ],
            description: "This premium waterfront campsite offers stunning lake views with easy access to hiking trails. Perfect for families with children, featuring nearby washrooms and playground facilities. The site can accommodate both tents and RVs up to 30 feet."
        },
        2: {
            title: "Campsite 2",
            type: "Forest Site",
            price: 35,
            baseRate: 30,
            premium: 5,
            image: "placeholder-campsite-2",
            features: [
                { icon: "🏕️", text: "Tent & RV friendly (up to 25ft)" },
                { icon: "🌲", text: "Forest setting • Fire pit • Picnic table" },
                { icon: "📶", text: "WiFi available • Pet friendly" }
            ],
            description: "A secluded forest campsite ideal for those seeking a peaceful retreat. Surrounded by tall pines with excellent privacy. Close to the visitor center and canoe rental facilities. Perfect for nature lovers."
        },
        3: {
            title: "Campsite 3",
            type: "Beach Access",
            price: 40,
            baseRate: 35,
            premium: 5,
            image: "placeholder-campsite-3",
            features: [
                { icon: "🏕️", text: "Tent friendly (RV up to 20ft)" },
                { icon: "🏖️", text: "Beach access • Fire pit • Picnic table" },
                { icon: "🚿", text: "Shower facilities • Accessible washrooms" }
            ],
            description: "Waterfront campsite with direct beach access. Wake up to beautiful sunrise views over the lake. Popular spot for swimming and water activities. Great for families who love water sports."
        }
    };

    const campsite = campsiteData[campsiteNumber];
    if (!campsite) return;

    // Update title and type
    document.getElementById('selected-campsite-title').textContent = campsite.title;
    document.getElementById('selected-campsite-type').textContent = campsite.type;

    // Update pricing
    document.getElementById('selected-price').textContent = `$${campsite.price}`;
    document.getElementById('base-rate').textContent = `$${campsite.baseRate}`;
    document.getElementById('site-premium').textContent = `$${campsite.premium}`;

    // Update image
    const imageElement = document.getElementById('selected-campsite-image');
    imageElement.className = `preview-image ${campsite.image}`;

    // Update features
    const featuresContainer = document.getElementById('selected-features');
    featuresContainer.innerHTML = campsite.features.map(feature => `
        <div class="feature-item">
            <span class="feature-icon">${feature.icon}</span>
            <span>${feature.text}</span>
        </div>
    `).join('');

    // Update description
    document.getElementById('selected-description').textContent = campsite.description;

    // Add visual feedback for selection
    const detailsContainer = document.querySelector('.campsite-details');
    detailsContainer.style.borderColor = '#059669';
    detailsContainer.style.boxShadow = '0 8px 24px rgba(5, 150, 105, 0.15)';
    
    // Reset border after animation
    setTimeout(() => {
        detailsContainer.style.borderColor = '#e5e7eb';
        detailsContainer.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.05)';
    }, 1000);
}

// Map Toggle
function setupMapToggle() {
    const mapToggle = document.querySelector('.map-toggle');
    let mapVisible = false;
    
    mapToggle.addEventListener('click', function() {
        mapVisible = !mapVisible;
        
        if (mapVisible) {
            showCampsiteMap();
            this.innerHTML = '<span class="map-icon">🗺️</span> Hide Map';
            this.style.background = '#f0fdf4';
            this.style.borderColor = '#059669';
            this.style.color = '#059669';
        } else {
            hideCampsiteMap();
            this.innerHTML = '<span class="map-icon">🗺️</span> Show in Map';
            this.style.background = 'transparent';
            this.style.borderColor = '#d1d5db';
            this.style.color = '#374151';
        }
    });
}

function showCampsiteMap() {
    // Create map overlay
    const existingMap = document.querySelector('.campsite-map-overlay');
    if (existingMap) {
        existingMap.remove();
    }
    
    const mapOverlay = document.createElement('div');
    mapOverlay.className = 'campsite-map-overlay';
    mapOverlay.innerHTML = `
        <div class="map-container">
            <div class="map-header">
                <h3>Campsite Locations</h3>
                <button class="close-map">&times;</button>
            </div>
            <div class="interactive-map">
                <div class="map-placeholder">
                    <div class="campsite-marker" data-campsite="1" style="top: 30%; left: 25%;">
                        <span class="marker-number">1</span>
                    </div>
                    <div class="campsite-marker" data-campsite="2" style="top: 50%; left: 60%;">
                        <span class="marker-number">2</span>
                    </div>
                    <div class="campsite-marker" data-campsite="3" style="top: 70%; left: 40%;">
                        <span class="marker-number">3</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(mapOverlay);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .campsite-map-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }
        
        .map-container {
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 600px;
            width: 90%;
            max-height: 80%;
        }
        
        .map-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .map-header h3 {
            margin: 0;
            font-size: 24px;
            color: #1f2937;
        }
        
        .close-map {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6b7280;
            padding: 4px;
        }
        
        .map-placeholder {
            width: 100%;
            height: 400px;
            background: linear-gradient(135deg, #10b981, #059669);
            border-radius: 8px;
            position: relative;
            overflow: hidden;
        }
        
        .campsite-marker {
            position: absolute;
            width: 32px;
            height: 32px;
            background: white;
            border: 3px solid #ef4444;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transform: translate(-50%, -50%);
            animation: pulse 2s infinite;
        }
        
        .marker-number {
            font-weight: 600;
            color: #ef4444;
            font-size: 14px;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
    `;
    document.head.appendChild(style);
    
    // Setup map interactions
    setupMapInteractions(mapOverlay);
}

function setupMapInteractions(mapOverlay) {
    const closeBtn = mapOverlay.querySelector('.close-map');
    const markers = mapOverlay.querySelectorAll('.campsite-marker');
    
    // Close map
    closeBtn.addEventListener('click', hideCampsiteMap);
    mapOverlay.addEventListener('click', function(e) {
        if (e.target === mapOverlay) {
            hideCampsiteMap();
        }
    });
    
    // Marker interactions
    markers.forEach(marker => {
        marker.addEventListener('click', function() {
            const campsiteNumber = this.dataset.campsite;
            selectCampsiteFromMap(campsiteNumber);
            hideCampsiteMap();
        });
    });
}

function selectCampsiteFromMap(campsiteNumber) {
    const campsiteCards = document.querySelectorAll('.campsite-card');
    const targetCard = campsiteCards[campsiteNumber - 1];
    
    // Remove selected class from all cards
    campsiteCards.forEach(c => c.classList.remove('selected'));
    
    // Select target card
    targetCard.classList.add('selected');
    updateCampsitePreview(parseInt(campsiteNumber));
    
    // Scroll to selected campsite
    targetCard.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

function hideCampsiteMap() {
    const mapOverlay = document.querySelector('.campsite-map-overlay');
    if (mapOverlay) {
        mapOverlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            mapOverlay.remove();
        }, 300);
    }
    
    // Reset map toggle button
    const mapToggle = document.querySelector('.map-toggle');
    mapToggle.innerHTML = '<span class="map-icon">🗺️</span> Show in Map';
    mapToggle.style.background = 'transparent';
    mapToggle.style.borderColor = '#d1d5db';
    mapToggle.style.color = '#374151';
}

// Search Form
function setupSearchForm() {
    const searchBtn = document.querySelector('.search-btn');
    const searchInputs = document.querySelectorAll('.search-select, .search-input');
    
    searchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        performSearch();
    });
    
    // Add enter key support
    searchInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    });
}

function performSearch() {
    // Get search values
    const searchData = {
        complete: document.querySelector('.search-select').value,
        park: document.querySelectorAll('.search-select')[1].value,
        arrival: document.querySelector('.search-input[type="date"]').value,
        departure: document.querySelectorAll('.search-input[type="date"]')[1].value,
        guests: document.querySelectorAll('.search-select')[2].value,
        equipment: document.querySelectorAll('.search-select')[3].value
    };
    
    // Show loading state
    const searchBtn = document.querySelector('.search-btn');
    const originalContent = searchBtn.innerHTML;
    searchBtn.innerHTML = '<span style="animation: spin 1s linear infinite;">⟳</span>';
    searchBtn.disabled = true;
    
    // Simulate search
    setTimeout(() => {
        // Reset button
        searchBtn.innerHTML = originalContent;
        searchBtn.disabled = false;
        
        // Show results (simulate)
        showSearchResults(searchData);
    }, 1500);
}

function showSearchResults(searchData) {
    // Create a notification
    const notification = document.createElement('div');
    notification.className = 'search-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✓</span>
            <span>Found 3 available campsites for your dates</span>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .search-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Date Inputs
function setupDateInputs() {
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const today = new Date().toISOString().split('T')[0];
    
    dateInputs.forEach((input, index) => {
        // Set minimum date to today
        input.min = today;
        
        // Ensure departure is after arrival
        if (index === 1) { // Departure date
            const arrivalInput = dateInputs[0];
            
            arrivalInput.addEventListener('change', function() {
                const arrivalDate = new Date(this.value);
                const nextDay = new Date(arrivalDate);
                nextDay.setDate(nextDay.getDate() + 1);
                
                input.min = nextDay.toISOString().split('T')[0];
                
                // Update departure if it's before new minimum
                if (input.value && new Date(input.value) <= arrivalDate) {
                    input.value = nextDay.toISOString().split('T')[0];
                }
            });
        }
    });
}

// Booking functionality (to be connected to campsite details page)
function proceedToBooking(campsiteNumber) {
    // Navigate to booking-campsite.html with parameters
    window.location.href = `booking-campsite.html?campsite=${campsiteNumber}`;
}

// Add click handlers for booking (if needed)
document.addEventListener('click', function(e) {
    if (e.target.closest('.campsite-card')) {
        const card = e.target.closest('.campsite-card');
        const campsiteNumber = card.dataset.campsite;
        
        // Double-click to proceed to booking
        let clickCount = parseInt(card.dataset.clickCount || '0');
        clickCount++;
        card.dataset.clickCount = clickCount;
        
        if (clickCount === 2) {
            proceedToBooking(campsiteNumber);
            card.dataset.clickCount = '0';
        }
        
        // Reset click count after 500ms
        setTimeout(() => {
            card.dataset.clickCount = '0';
        }, 500);
    }
});

// Load park data for booking page
async function loadParkBookingData() {
    try {
        // Get park ID from localStorage
        const parkId = localStorage.getItem('selectedParkId');
        
        if (!parkId) {
            console.warn('No park ID found for booking');
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
            console.warn('Park not found for booking:', parkId);
            return;
        }
        
        // Update booking page with park data
        updateBookingPageContent(park);
        
    } catch (error) {
        console.error('Error loading park booking data:', error);
    }
}

// Booking Actions
function setupBookingActions() {
    const bookNowBtn = document.querySelector('.book-now-btn');
    const viewCalendarBtn = document.querySelector('.view-calendar-btn');
    
    if (bookNowBtn) {
        bookNowBtn.addEventListener('click', function() {
            const selectedCampsite = document.querySelector('.campsite-card.selected');
            const campsiteNumber = selectedCampsite ? selectedCampsite.dataset.campsite : '1';
            
            // Add loading state
            this.innerHTML = '<span style="opacity: 0.7;">Processing...</span>';
            this.disabled = true;
            
            // Simulate booking process
            setTimeout(() => {
                // Navigate to booking confirmation or next step
                window.location.href = `booking-campsite.html?site=${campsiteNumber}`;
            }, 1500);
        });
    }
    
    if (viewCalendarBtn) {
        viewCalendarBtn.addEventListener('click', function() {
            // Toggle calendar view
            showAvailabilityCalendar();
        });
    }
}

function showAvailabilityCalendar() {
    // Create calendar modal
    const existingCalendar = document.querySelector('.calendar-overlay');
    if (existingCalendar) {
        existingCalendar.remove();
        return;
    }
    
    const calendarOverlay = document.createElement('div');
    calendarOverlay.className = 'calendar-overlay';
    calendarOverlay.innerHTML = `
        <div class="calendar-container">
            <div class="calendar-header">
                <h3>Available Dates</h3>
                <button class="close-calendar">&times;</button>
            </div>
            <div class="calendar-content">
                <div class="calendar-month">
                    <h4>August 2025</h4>
                    <div class="calendar-grid">
                        ${generateCalendarDays()}
                    </div>
                </div>
                <div class="calendar-legend">
                    <div class="legend-item">
                        <span class="legend-color available"></span>
                        <span>Available</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color booked"></span>
                        <span>Booked</span>
                    </div>
                    <div class="legend-item">
                        <span class="legend-color selected"></span>
                        <span>Selected</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(calendarOverlay);
    
    // Add calendar styles
    const style = document.createElement('style');
    style.textContent = `
        .calendar-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: fadeIn 0.3s ease;
        }
        
        .calendar-container {
            background: white;
            border-radius: 16px;
            padding: 32px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .calendar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }
        
        .close-calendar {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6b7280;
        }
        
        .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 8px;
            margin-bottom: 24px;
        }
        
        .calendar-day {
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
        }
        
        .calendar-day.available {
            background: #f0fdf4;
            color: #059669;
            border: 1px solid #bbf7d0;
        }
        
        .calendar-day.available:hover {
            background: #dcfce7;
            transform: scale(1.1);
        }
        
        .calendar-day.booked {
            background: #fef2f2;
            color: #dc2626;
            border: 1px solid #fecaca;
            cursor: not-allowed;
        }
        
        .calendar-day.selected {
            background: #059669;
            color: white;
            border: 1px solid #047857;
        }
        
        .calendar-legend {
            display: flex;
            gap: 16px;
            justify-content: center;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
        }
        
        .legend-color {
            width: 16px;
            height: 16px;
            border-radius: 4px;
            border: 1px solid #e5e7eb;
        }
        
        .legend-color.available {
            background: #f0fdf4;
            border-color: #bbf7d0;
        }
        
        .legend-color.booked {
            background: #fef2f2;
            border-color: #fecaca;
        }
        
        .legend-color.selected {
            background: #059669;
            border-color: #047857;
        }
    `;
    
    if (!document.querySelector('#calendar-styles')) {
        style.id = 'calendar-styles';
        document.head.appendChild(style);
    }
    
    // Add event listeners
    calendarOverlay.querySelector('.close-calendar').addEventListener('click', () => {
        calendarOverlay.remove();
    });
    
    calendarOverlay.addEventListener('click', (e) => {
        if (e.target === calendarOverlay) {
            calendarOverlay.remove();
        }
    });
}

function generateCalendarDays() {
    const days = [];
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    
    // Generate days for August 2025
    for (let day = 1; day <= 31; day++) {
        const isBooked = Math.random() < 0.3; // 30% chance of being booked
        const isPast = day < currentDay && currentDate.getMonth() === 7; // August is month 7
        const isSelected = day >= 21 && day <= 24; // Selected dates from form
        
        let className = 'calendar-day';
        if (isPast || isBooked) {
            className += ' booked';
        } else if (isSelected) {
            className += ' selected';
        } else {
            className += ' available';
        }
        
        days.push(`<div class="${className}" data-day="${day}">${day}</div>`);
    }
    
    return days.join('');
}

// Initialize booking actions when page loads
document.addEventListener('DOMContentLoaded', function() {
    setupBookingActions();
});

// Update booking page content with park data
function updateBookingPageContent(park) {
    // Update park name in page title and headers
    const parkNameElements = document.querySelectorAll('.park-name, .booking-title h1, .page-title');
    parkNameElements.forEach(element => {
        if (element) {
            element.textContent = `Book ${park.name}`;
        }
    });
    
    // Update park information in booking summary
    const parkInfoContainer = document.querySelector('.park-info, .booking-park-details');
    if (parkInfoContainer) {
        parkInfoContainer.innerHTML = `
            <div class="park-summary">
                <h3>${park.name}</h3>
                <p class="park-location">${park.region}</p>
                <p class="park-description">${park.description}</p>
            </div>
            <div class="park-booking-features">
                <span class="feature">🏕️ ${park.campgrounds} Campgrounds</span>
                <span class="feature">👥 Up to ${park.maxOccupancy}</span>
                ${park.pets ? '<span class="feature">🐕 Pet Friendly</span>' : ''}
                ${park.accessibility ? '<span class="feature">♿ Accessible</span>' : ''}
            </div>
        `;
    }
    
    // Update pricing in search results
    const priceElements = document.querySelectorAll('.price, .campsite-price');
    priceElements.forEach(element => {
        if (element && park.pricing) {
            // Determine site type and update accordingly
            const parentCard = element.closest('.campsite-card');
            if (parentCard) {
                const siteType = parentCard.querySelector('.site-type')?.textContent?.toLowerCase() || 'tent';
                
                if (siteType.includes('rv') || siteType.includes('electrical')) {
                    element.textContent = `$${park.pricing.rv}/night`;
                } else if (siteType.includes('cabin')) {
                    element.textContent = `$${park.pricing.cabin}/night`;
                } else {
                    element.textContent = `$${park.pricing.tent}/night`;
                }
            }
        }
    });
    
    // Update booking breadcrumb
    const breadcrumb = document.querySelector('.breadcrumb, .booking-steps');
    if (breadcrumb) {
        const parkLink = breadcrumb.querySelector('a[href*="park-details"]');
        if (parkLink) {
            parkLink.textContent = park.name;
        }
    }
    
    // Store park data for booking process
    localStorage.setItem('bookingParkData', JSON.stringify({
        id: park.id,
        name: park.name,
        region: park.region,
        pricing: park.pricing,
        maxOccupancy: park.maxOccupancy,
        contact: park.contact
    }));
}
