// Acknowledge Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeAcknowledgePage();
});

function initializeAcknowledgePage() {
    showParkAlertsModal();
    setupModalEvents();
    setupCampsiteSelection();
    setupMapToggle();
    setupSearchForm();
    setupDateInputs();
}

// Show Park Alerts Modal on page load
function showParkAlertsModal() {
    const modal = document.getElementById('park-alerts-modal');
    const mainContent = document.querySelector('.main-content');
    const header = document.querySelector('.page-header');
    const searchSection = document.querySelector('.search-filter-section');
    
    // Show modal immediately
    if (modal) {
        modal.style.display = 'flex';
        
        // Blur background content
        if (mainContent) mainContent.classList.add('page-blurred');
        if (header) header.classList.add('page-blurred');
        if (searchSection) searchSection.classList.add('page-blurred');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }
}

// Setup Modal Events
function setupModalEvents() {
    const modal = document.getElementById('park-alerts-modal');
    const closeBtn = document.getElementById('close-alerts');
    const acknowledgeBtn = document.getElementById('acknowledge-btn');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            closeParkAlertsModal();
        });
    }
    
    if (acknowledgeBtn) {
        acknowledgeBtn.addEventListener('click', function() {
            acknowledgeAlerts();
        });
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeParkAlertsModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
            closeParkAlertsModal();
        }
    });
}

function closeParkAlertsModal() {
    const modal = document.getElementById('park-alerts-modal');
    const mainContent = document.querySelector('.main-content');
    const header = document.querySelector('.page-header');
    const searchSection = document.querySelector('.search-filter-section');
    
    if (modal) {
        // Add fade out animation
        modal.classList.add('fade-out');
        
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('fade-out');
            
            // Remove blur effect
            if (mainContent) mainContent.classList.remove('page-blurred');
            if (header) header.classList.remove('page-blurred');
            if (searchSection) searchSection.classList.remove('page-blurred');
            
            // Restore body scroll
            document.body.style.overflow = '';
        }, 300);
    }
}

function acknowledgeAlerts() {
    const acknowledgeBtn = document.getElementById('acknowledge-btn');
    
    if (acknowledgeBtn) {
        // Show loading state
        acknowledgeBtn.textContent = 'Acknowledged...';
        acknowledgeBtn.disabled = true;
        acknowledgeBtn.style.background = '#9ca3af';
        
        // Store acknowledgment in localStorage
        localStorage.setItem('parkAlertsAcknowledged', 'true');
        localStorage.setItem('acknowledgmentDate', new Date().toISOString());
        
        // Close modal after brief delay
        setTimeout(() => {
            closeParkAlertsModal();
            showAcknowledgmentConfirmation();
        }, 1000);
    }
}

function showAcknowledgmentConfirmation() {
    const notification = document.createElement('div');
    notification.className = 'acknowledgment-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✓</span>
            <span>Park alerts acknowledged. You can now proceed with your booking.</span>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .acknowledgment-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #10b981;
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1001;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .notification-icon {
            font-size: 18px;
            flex-shrink: 0;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Check if alerts were already acknowledged
function checkPreviousAcknowledgment() {
    const acknowledged = localStorage.getItem('parkAlertsAcknowledged');
    const acknowledgmentDate = localStorage.getItem('acknowledgmentDate');
    
    if (acknowledged === 'true' && acknowledgmentDate) {
        const ackDate = new Date(acknowledgmentDate);
        const now = new Date();
        const daysDiff = (now - ackDate) / (1000 * 60 * 60 * 24);
        
        // Show modal again if it's been more than 7 days
        if (daysDiff > 7) {
            localStorage.removeItem('parkAlertsAcknowledged');
            localStorage.removeItem('acknowledgmentDate');
            return false;
        }
        return true;
    }
    return false;
}

// Campsite Selection (similar to booking.js)
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

function updateCampsitePreview(campsiteNumber) {
    const preview = document.querySelector('.campsite-preview');
    const previewImage = preview.querySelector('.preview-image');
    
    // Update preview image based on selected campsite
    if (previewImage) {
        previewImage.className = `preview-image placeholder-campsite-${campsiteNumber}`;
    }
}

// Map Toggle
function setupMapToggle() {
    const mapToggle = document.querySelector('.map-toggle');
    let mapVisible = false;
    
    if (mapToggle) {
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
}

function showCampsiteMap() {
    // Create map overlay (similar to booking.js but simpler)
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
    
    // Add styles (reuse from booking.js)
    addMapStyles();
    setupMapInteractions(mapOverlay);
}

function addMapStyles() {
    if (document.querySelector('#map-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'map-styles';
    style.textContent = `
        .campsite-map-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1001;
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
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
    `;
    document.head.appendChild(style);
}

function setupMapInteractions(mapOverlay) {
    const closeBtn = mapOverlay.querySelector('.close-map');
    const markers = mapOverlay.querySelectorAll('.campsite-marker');
    
    closeBtn.addEventListener('click', hideCampsiteMap);
    mapOverlay.addEventListener('click', function(e) {
        if (e.target === mapOverlay) {
            hideCampsiteMap();
        }
    });
    
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
    
    if (targetCard) {
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
    if (mapToggle) {
        mapToggle.innerHTML = '<span class="map-icon">🗺️</span> Show in Map';
        mapToggle.style.background = 'transparent';
        mapToggle.style.borderColor = '#d1d5db';
        mapToggle.style.color = '#374151';
    }
}

// Search Form
function setupSearchForm() {
    const searchBtn = document.querySelector('.search-btn');
    const searchInputs = document.querySelectorAll('.search-select, .search-input');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            performSearch();
        });
    }
    
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
    if (!searchBtn) return;
    
    const originalContent = searchBtn.innerHTML;
    searchBtn.innerHTML = '<span style="animation: spin 1s linear infinite;">⟳</span>';
    searchBtn.disabled = true;
    
    setTimeout(() => {
        searchBtn.innerHTML = originalContent;
        searchBtn.disabled = false;
        
        showSearchNotification('Updated availability for your search criteria');
    }, 1500);
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
            });
        }
    });
}

// Initialize page based on acknowledgment status
document.addEventListener('DOMContentLoaded', function() {
    // Check if user already acknowledged alerts recently
    if (checkPreviousAcknowledgment()) {
        // Don't show modal if already acknowledged within 7 days
        const modal = document.getElementById('park-alerts-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
});
