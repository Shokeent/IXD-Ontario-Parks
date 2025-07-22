// Booking Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeBookingPage();
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
    const preview = document.querySelector('.campsite-preview');
    const previewImage = preview.querySelector('.preview-image');
    const previewDescription = preview.querySelector('.preview-description');
    
    // Update preview image based on selected campsite
    previewImage.className = `preview-image placeholder-campsite-${campsiteNumber}`;
    
    // Update description based on campsite
    const descriptions = {
        1: "This premium campsite offers stunning lake views with easy access to hiking trails. Perfect for families with children, featuring nearby washrooms and playground facilities. The site can accommodate both tents and RVs.",
        2: "A secluded forest campsite ideal for those seeking a peaceful retreat. Surrounded by tall pines with excellent privacy. Close to the visitor center and canoe rental facilities. WiFi available.",
        3: "Waterfront campsite with direct beach access. Wake up to beautiful sunrise views over the lake. Popular spot for swimming and water activities. Accessible facilities nearby."
    };
    
    previewDescription.innerHTML = descriptions[campsiteNumber] + ' <a href="#" class="read-more">Read More</a>';
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
