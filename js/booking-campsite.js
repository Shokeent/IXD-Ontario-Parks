// Booking Campsite Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeBookingCampsitePage();
});

function initializeBookingCampsitePage() {
    setupSiteSelection();
    setupMapToggle();
    setupSearchForm();
    setupDateInputs();
    setupReservationFlow();
    setupEquipmentDetails();
    initializeFromURL();
}

// Initialize page based on URL parameters
function initializeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const campsiteParam = urlParams.get('campsite');
    
    if (campsiteParam) {
        selectSite(parseInt(campsiteParam));
        updateSearchSelect(campsiteParam);
    }
}

function updateSearchSelect(siteNumber) {
    const campsiteSelect = document.querySelector('.search-select');
    if (campsiteSelect) {
        campsiteSelect.value = `Site ${siteNumber}`;
    }
}

// Site Selection
function setupSiteSelection() {
    const siteCards = document.querySelectorAll('.site-card');
    
    siteCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            selectSite(index + 1);
        });
        
        // Add hover effects
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

function selectSite(siteNumber) {
    const siteCards = document.querySelectorAll('.site-card');
    
    // Remove selected class from all cards
    siteCards.forEach(card => card.classList.remove('selected'));
    
    // Add selected class to target card
    if (siteCards[siteNumber - 1]) {
        siteCards[siteNumber - 1].classList.add('selected');
    }
    
    // Update booking details
    updateBookingDetails(siteNumber);
    
    // Update URL
    updateURL(siteNumber);
}

function updateBookingDetails(siteNumber) {
    const bookingTitle = document.querySelector('.booking-details h3');
    const bookingImage = document.querySelector('.booking-image');
    
    if (bookingTitle) {
        bookingTitle.textContent = `Site ${siteNumber}`;
    }
    
    if (bookingImage) {
        bookingImage.className = `booking-image placeholder-site-${siteNumber}`;
    }
    
    // Update pricing based on site (could be different for each site)
    updatePricing(siteNumber);
}

function updatePricing(siteNumber) {
    const priceElement = document.querySelector('.price');
    const prices = {
        1: '$45',
        2: '$40',
        3: '$50'
    };
    
    if (priceElement && prices[siteNumber]) {
        priceElement.textContent = prices[siteNumber];
    }
}

function updateURL(siteNumber) {
    const newURL = new URL(window.location);
    newURL.searchParams.set('campsite', siteNumber);
    window.history.replaceState({}, '', newURL);
}

// Map Toggle (similar to booking.js but adapted for sites)
function setupMapToggle() {
    const mapToggle = document.querySelector('.map-toggle');
    let mapVisible = false;
    
    mapToggle.addEventListener('click', function() {
        mapVisible = !mapVisible;
        
        if (mapVisible) {
            showSiteMap();
            this.innerHTML = '<span class="map-icon">🗺️</span> Hide Map';
            this.style.background = '#f0fdf4';
            this.style.borderColor = '#059669';
            this.style.color = '#059669';
        } else {
            hideSiteMap();
            this.innerHTML = '<span class="map-icon">🗺️</span> Show in Map';
            this.style.background = 'transparent';
            this.style.borderColor = '#d1d5db';
            this.style.color = '#374151';
        }
    });
}

function showSiteMap() {
    const existingMap = document.querySelector('.site-map-overlay');
    if (existingMap) {
        existingMap.remove();
    }
    
    const mapOverlay = document.createElement('div');
    mapOverlay.className = 'site-map-overlay';
    mapOverlay.innerHTML = `
        <div class="map-container">
            <div class="map-header">
                <h3>Campsite Locations</h3>
                <button class="close-map">&times;</button>
            </div>
            <div class="interactive-map">
                <div class="map-placeholder">
                    <div class="site-marker" data-site="1" style="top: 25%; left: 30%;">
                        <span class="marker-number">1</span>
                    </div>
                    <div class="site-marker" data-site="2" style="top: 55%; left: 65%;">
                        <span class="marker-number">2</span>
                    </div>
                    <div class="site-marker" data-site="3" style="top: 75%; left: 35%;">
                        <span class="marker-number">3</span>
                    </div>
                    <div class="facilities-marker" style="top: 40%; left: 50%;">
                        <span class="facility-icon">🚿</span>
                    </div>
                    <div class="facilities-marker" style="top: 60%; left: 20%;">
                        <span class="facility-icon">🏛️</span>
                    </div>
                </div>
            </div>
            <div class="map-legend">
                <div class="legend-item">
                    <div class="legend-color" style="background: #ef4444;"></div>
                    <span>Campsites</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: #3b82f6;"></div>
                    <span>Facilities</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(mapOverlay);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .site-map-overlay {
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
            max-width: 700px;
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
        
        .site-marker {
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
        
        .facilities-marker {
            position: absolute;
            width: 32px;
            height: 32px;
            background: white;
            border: 3px solid #3b82f6;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            transform: translate(-50%, -50%);
        }
        
        .marker-number {
            font-weight: 600;
            color: #ef4444;
            font-size: 14px;
        }
        
        .facility-icon {
            font-size: 14px;
        }
        
        .map-legend {
            display: flex;
            gap: 20px;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .legend-color {
            width: 16px;
            height: 16px;
            border-radius: 50%;
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
    
    setupSiteMapInteractions(mapOverlay);
}

function setupSiteMapInteractions(mapOverlay) {
    const closeBtn = mapOverlay.querySelector('.close-map');
    const markers = mapOverlay.querySelectorAll('.site-marker');
    
    closeBtn.addEventListener('click', hideSiteMap);
    mapOverlay.addEventListener('click', function(e) {
        if (e.target === mapOverlay) {
            hideSiteMap();
        }
    });
    
    markers.forEach(marker => {
        marker.addEventListener('click', function() {
            const siteNumber = this.dataset.site;
            selectSite(parseInt(siteNumber));
            hideSiteMap();
        });
    });
}

function hideSiteMap() {
    const mapOverlay = document.querySelector('.site-map-overlay');
    if (mapOverlay) {
        mapOverlay.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            mapOverlay.remove();
        }, 300);
    }
    
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
    const searchBtn = document.querySelector('.search-btn');
    const originalContent = searchBtn.innerHTML;
    searchBtn.innerHTML = '<span style="animation: spin 1s linear infinite;">⟳</span>';
    searchBtn.disabled = true;
    
    setTimeout(() => {
        searchBtn.innerHTML = originalContent;
        searchBtn.disabled = false;
        
        showSearchNotification('Updated availability for your new dates');
    }, 1000);
}

function showSearchNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'search-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✓</span>
            <span>${message}</span>
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
        input.min = today;
        
        if (index === 1) {
            const arrivalInput = dateInputs[0];
            
            arrivalInput.addEventListener('change', function() {
                const arrivalDate = new Date(this.value);
                const nextDay = new Date(arrivalDate);
                nextDay.setDate(nextDay.getDate() + 1);
                
                input.min = nextDay.toISOString().split('T')[0];
                
                if (input.value && new Date(input.value) <= arrivalDate) {
                    input.value = nextDay.toISOString().split('T')[0];
                }
                
                updateBookingDates();
            });
            
            input.addEventListener('change', updateBookingDates);
        }
    });
}

function updateBookingDates() {
    const arrivalInput = document.querySelectorAll('input[type="date"]')[0];
    const departureInput = document.querySelectorAll('input[type="date"]')[1];
    
    if (arrivalInput.value && departureInput.value) {
        const arrivalDate = new Date(arrivalInput.value);
        const departureDate = new Date(departureInput.value);
        
        // Update display dates
        const arrivalDisplay = document.querySelectorAll('.date-field span')[2];
        const departureDisplay = document.querySelectorAll('.date-field span')[3];
        
        if (arrivalDisplay && departureDisplay) {
            arrivalDisplay.textContent = formatDate(arrivalDate);
            departureDisplay.textContent = formatDate(departureDate);
        }
        
        // Calculate and update total nights
        const nights = Math.ceil((departureDate - arrivalDate) / (1000 * 60 * 60 * 24));
        updateTotalCost(nights);
    }
}

function formatDate(date) {
    const options = { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

function updateTotalCost(nights) {
    const priceElement = document.querySelector('.price');
    const pricePerNight = parseInt(priceElement.textContent.replace('$', ''));
    const totalCost = pricePerNight * nights;
    
    // Could show total cost somewhere if needed
    console.log(`Total cost for ${nights} nights: $${totalCost}`);
}

// Reservation Flow
function setupReservationFlow() {
    const reserveBtn = document.querySelector('.reserve-btn');
    
    reserveBtn.addEventListener('click', function() {
        startReservationProcess();
    });
}

function startReservationProcess() {
    const reserveBtn = document.querySelector('.reserve-btn');
    const originalText = reserveBtn.textContent;
    
    // Show loading state
    reserveBtn.textContent = 'Processing...';
    reserveBtn.disabled = true;
    reserveBtn.style.background = '#9ca3af';
    
    // Simulate reservation process
    setTimeout(() => {
        showReservationModal();
        
        // Reset button
        reserveBtn.textContent = originalText;
        reserveBtn.disabled = false;
        reserveBtn.style.background = '#1f2937';
    }, 2000);
}

function showReservationModal() {
    const modal = document.createElement('div');
    modal.className = 'reservation-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Confirm Your Reservation</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="reservation-summary">
                    <h4>Reservation Details</h4>
                    <div class="summary-item">
                        <span>Campsite:</span>
                        <span>Site 1 - Algonquin Achray</span>
                    </div>
                    <div class="summary-item">
                        <span>Dates:</span>
                        <span>Aug 21 - Aug 24, 2025</span>
                    </div>
                    <div class="summary-item">
                        <span>Guests:</span>
                        <span>2 people</span>
                    </div>
                    <div class="summary-item">
                        <span>Equipment:</span>
                        <span>Single Tent</span>
                    </div>
                    <div class="summary-total">
                        <span>Total:</span>
                        <span>$135 (3 nights)</span>
                    </div>
                </div>
                <div class="guest-info">
                    <h4>Guest Information</h4>
                    <form class="reservation-form">
                        <div class="form-row">
                            <input type="text" placeholder="First Name" required>
                            <input type="text" placeholder="Last Name" required>
                        </div>
                        <div class="form-row">
                            <input type="email" placeholder="Email Address" required>
                            <input type="tel" placeholder="Phone Number" required>
                        </div>
                        <textarea placeholder="Special Requests (Optional)"></textarea>
                    </form>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn-cancel">Cancel</button>
                <button class="btn-confirm">Confirm Reservation</button>
            </div>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .reservation-modal {
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
        
        .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 600px;
            width: 90%;
            max-height: 80%;
            overflow-y: auto;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 24px 24px 0;
        }
        
        .modal-header h3 {
            margin: 0;
            font-size: 24px;
            color: #1f2937;
        }
        
        .close-modal {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #6b7280;
        }
        
        .modal-body {
            padding: 24px;
        }
        
        .reservation-summary {
            background: #f9fafb;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 24px;
        }
        
        .reservation-summary h4 {
            margin: 0 0 16px 0;
            color: #1f2937;
        }
        
        .summary-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        .summary-total {
            display: flex;
            justify-content: space-between;
            font-weight: 600;
            font-size: 16px;
            border-top: 1px solid #e5e7eb;
            padding-top: 12px;
            margin-top: 12px;
        }
        
        .guest-info h4 {
            margin: 0 0 16px 0;
            color: #1f2937;
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-bottom: 12px;
        }
        
        .reservation-form input,
        .reservation-form textarea {
            padding: 12px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            font-size: 14px;
        }
        
        .reservation-form textarea {
            resize: vertical;
            min-height: 80px;
            grid-column: 1 / -1;
        }
        
        .modal-footer {
            display: flex;
            gap: 12px;
            padding: 0 24px 24px;
        }
        
        .btn-cancel,
        .btn-confirm {
            flex: 1;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            border: none;
        }
        
        .btn-cancel {
            background: #f3f4f6;
            color: #374151;
        }
        
        .btn-confirm {
            background: #059669;
            color: white;
        }
        
        .btn-cancel:hover {
            background: #e5e7eb;
        }
        
        .btn-confirm:hover {
            background: #047857;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(modal);
    
    setupReservationModalEvents(modal);
}

function setupReservationModalEvents(modal) {
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.btn-cancel');
    const confirmBtn = modal.querySelector('.btn-confirm');
    
    closeBtn.addEventListener('click', () => modal.remove());
    cancelBtn.addEventListener('click', () => modal.remove());
    
    confirmBtn.addEventListener('click', function() {
        const form = modal.querySelector('.reservation-form');
        if (form.checkValidity()) {
            processReservation(modal);
        } else {
            form.reportValidity();
        }
    });
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function processReservation(modal) {
    const confirmBtn = modal.querySelector('.btn-confirm');
    confirmBtn.textContent = 'Processing...';
    confirmBtn.disabled = true;
    
    setTimeout(() => {
        modal.remove();
        showSuccessMessage();
    }, 2000);
}

function showSuccessMessage() {
    const successModal = document.createElement('div');
    successModal.className = 'success-modal';
    successModal.innerHTML = `
        <div class="success-content">
            <div class="success-icon">✓</div>
            <h3>Reservation Confirmed!</h3>
            <p>Your booking confirmation has been sent to your email.</p>
            <p><strong>Confirmation Number:</strong> ONT-${Date.now()}</p>
            <button class="btn-ok">OK</button>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .success-modal {
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
        
        .success-content {
            background: white;
            border-radius: 12px;
            padding: 40px;
            text-align: center;
            max-width: 400px;
        }
        
        .success-icon {
            width: 60px;
            height: 60px;
            background: #10b981;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 30px;
            margin: 0 auto 20px;
        }
        
        .success-content h3 {
            margin: 0 0 16px 0;
            color: #1f2937;
        }
        
        .success-content p {
            color: #6b7280;
            margin-bottom: 12px;
        }
        
        .btn-ok {
            background: #059669;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 32px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 20px;
        }
        
        .btn-ok:hover {
            background: #047857;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(successModal);
    
    successModal.querySelector('.btn-ok').addEventListener('click', () => {
        successModal.remove();
    });
}

// Equipment Details
function setupEquipmentDetails() {
    const moreDetailsBtn = document.querySelector('.more-details-btn');
    
    moreDetailsBtn.addEventListener('click', function() {
        showEquipmentModal();
    });
}

function showEquipmentModal() {
    const modal = document.createElement('div');
    modal.className = 'equipment-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Site 1 - Equipment & Restrictions</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="equipment-details">
                    <h4>Allowed Equipment</h4>
                    <ul>
                        <li>Single Tent (up to 4 people)</li>
                        <li>2 Tents (family camping)</li>
                        <li>3 Tents (group camping)</li>
                        <li>Trailer or RV up to 10m (35 feet)</li>
                    </ul>
                    
                    <h4>Site Features</h4>
                    <ul>
                        <li>Fire pit with grill</li>
                        <li>Picnic table</li>
                        <li>Partial shade (PM sun)</li>
                        <li>Close to washrooms (50m)</li>
                        <li>WiFi available</li>
                    </ul>
                    
                    <h4>Restrictions</h4>
                    <ul>
                        <li>No pets allowed</li>
                        <li>Generator-free zone</li>
                        <li>Quiet hours: 10 PM - 7 AM</li>
                        <li>No glass containers on beach</li>
                    </ul>
                    
                    <h4>Service Information</h4>
                    <ul>
                        <li>No electrical hookup</li>
                        <li>Water tap nearby</li>
                        <li>Not a double site</li>
                        <li>Accessible washrooms</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .equipment-modal {
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
        
        .equipment-modal .modal-content {
            background: white;
            border-radius: 12px;
            max-width: 600px;
            width: 90%;
            max-height: 80%;
            overflow-y: auto;
        }
        
        .equipment-details h4 {
            color: #1f2937;
            margin: 20px 0 12px 0;
            font-size: 18px;
        }
        
        .equipment-details h4:first-child {
            margin-top: 0;
        }
        
        .equipment-details ul {
            list-style: none;
            padding: 0;
        }
        
        .equipment-details li {
            padding: 8px 0;
            padding-left: 20px;
            position: relative;
            color: #374151;
        }
        
        .equipment-details li:before {
            content: "•";
            color: #059669;
            font-weight: bold;
            position: absolute;
            left: 0;
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}
