// All Parks Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initSearchFilters();
    initFilterTags();
    initParkCards();
    initMapToggle();
    setDefaultDates();
});

// Initialize search filters
function initSearchFilters() {
    const searchBtn = document.querySelector('.search-btn');
    const searchForm = document.querySelector('.search-card');
    
    // Search button functionality
    searchBtn.addEventListener('click', function() {
        performSearch();
    });
    
    // Real-time search on form changes
    const searchInputs = searchForm.querySelectorAll('select, input');
    searchInputs.forEach(input => {
        input.addEventListener('change', function() {
            // Debounce the search to avoid too many calls
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => {
                performSearch();
            }, 500);
        });
    });
    
    // Enter key search
    searchForm.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
}

// Initialize filter tags
function initFilterTags() {
    const filterTags = document.querySelectorAll('.filter-tag:not(.map-toggle)');
    
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Toggle active state
            this.classList.toggle('active');
            
            // Apply filters
            applyFilters();
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Initialize park cards
function initParkCards() {
    const parkCards = document.querySelectorAll('.park-card-all');
    
    parkCards.forEach((card, index) => {
        // Add staggered animation
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Click functionality
        card.addEventListener('click', function() {
            const parkName = this.querySelector('h3').textContent;
            openParkDetails(parkName);
        });
        
        // Hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Keyboard navigation
        card.setAttribute('tabindex', '0');
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Initialize map toggle
function initMapToggle() {
    const mapToggle = document.querySelector('.map-toggle');
    
    mapToggle.addEventListener('click', function() {
        // Toggle map view
        toggleMapView();
        
        // Update button text
        const isMapView = this.classList.contains('active');
        if (isMapView) {
            this.innerHTML = '<span class="map-icon">📋</span> Show in List';
            this.classList.remove('active');
        } else {
            this.innerHTML = '<span class="map-icon">🗺️</span> Show in Map';
            this.classList.add('active');
        }
    });
}

// Set default dates
function setDefaultDates() {
    const arrivalInput = document.querySelector('input[type="date"]:first-of-type');
    const departureInput = document.querySelector('input[type="date"]:last-of-type');
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(dayAfter.getDate() + 3);
    
    if (arrivalInput && departureInput) {
        arrivalInput.value = tomorrow.toISOString().split('T')[0];
        departureInput.value = dayAfter.toISOString().split('T')[0];
        
        // Add date validation
        arrivalInput.addEventListener('change', function() {
            const arrivalDate = new Date(this.value);
            const departureDate = new Date(departureInput.value);
            
            if (arrivalDate >= departureDate) {
                const newDeparture = new Date(arrivalDate);
                newDeparture.setDate(newDeparture.getDate() + 1);
                departureInput.value = newDeparture.toISOString().split('T')[0];
            }
        });
    }
}

// Perform search functionality
function performSearch() {
    const searchData = getSearchFormData();
    
    // Show loading state
    showLoadingState();
    
    // Simulate API call
    setTimeout(() => {
        filterParksBySearch(searchData);
        hideLoadingState();
        showNotification('Search completed! Found matching parks.', 'success');
    }, 1000);
}

// Get search form data
function getSearchFormData() {
    const form = document.querySelector('.search-card');
    const selects = form.querySelectorAll('select');
    const inputs = form.querySelectorAll('input');
    
    const data = {};
    
    selects.forEach(select => {
        const label = select.closest('.search-field').querySelector('label').textContent.toLowerCase();
        data[label] = select.value;
    });
    
    inputs.forEach(input => {
        const label = input.closest('.search-field').querySelector('label').textContent.toLowerCase();
        data[label] = input.value;
    });
    
    return data;
}

// Apply filter tags
function applyFilters() {
    const activeFilters = document.querySelectorAll('.filter-tag.active:not(.map-toggle)');
    const parkCards = document.querySelectorAll('.park-card-all');
    
    const activeFilterTexts = Array.from(activeFilters).map(filter => 
        filter.textContent.trim().toLowerCase()
    );
    
    parkCards.forEach(card => {
        let shouldShow = true;
        
        if (activeFilterTexts.length > 0) {
            const cardTags = card.querySelectorAll('.park-tag');
            const cardTagTexts = Array.from(cardTags).map(tag => 
                tag.textContent.trim().toLowerCase()
            );
            
            // Check if card matches any active filter
            const hasMatchingFilter = activeFilterTexts.some(filterText => {
                if (filterText.includes('kids program')) {
                    return cardTagTexts.some(tag => tag.includes('kids programs'));
                }
                if (filterText.includes('easy trail')) {
                    return cardTagTexts.some(tag => tag.includes('easy trails'));
                }
                if (filterText.includes('biking')) {
                    return cardTagTexts.some(tag => tag.includes('biking'));
                }
                return false;
            });
            
            shouldShow = hasMatchingFilter;
        }
        
        // Apply visibility with animation
        if (shouldShow) {
            card.style.display = 'block';
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    // Update results count
    updateResultsCount();
}

// Filter parks by search criteria
function filterParksBySearch(searchData) {
    const parkCards = document.querySelectorAll('.park-card-all');
    
    parkCards.forEach(card => {
        let shouldShow = true;
        
        // Example filtering logic (can be expanded)
        if (searchData.park && searchData.park !== 'All Parks') {
            const parkName = card.querySelector('h3').textContent;
            shouldShow = parkName.toLowerCase().includes(searchData.park.toLowerCase());
        }
        
        // Apply visibility
        if (shouldShow) {
            card.style.display = 'block';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
    
    updateResultsCount();
}

// Toggle map view
function toggleMapView() {
    const parksGrid = document.querySelector('.parks-grid-all');
    const isMapView = parksGrid.classList.contains('map-view');
    
    if (isMapView) {
        // Switch to grid view
        parksGrid.classList.remove('map-view');
        showNotification('Switched to grid view', 'info');
    } else {
        // Switch to map view (placeholder functionality)
        parksGrid.classList.add('map-view');
        showNotification('Map view coming soon! Showing grid for now.', 'info');
    }
}

// Open park details
function openParkDetails(parkName) {
    // Navigate to park details page
    showNotification(`Opening details for ${parkName}...`, 'info');
    
    setTimeout(() => {
        window.location.href = 'park-details.html';
    }, 1000);
}

// Show loading state
function showLoadingState() {
    const parkCards = document.querySelectorAll('.park-card-all');
    
    parkCards.forEach(card => {
        card.style.opacity = '0.5';
        card.style.pointerEvents = 'none';
    });
    
    // Add loading overlay
    const searchCard = document.querySelector('.search-card');
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'loading-overlay';
    loadingOverlay.innerHTML = '<div class="loading-spinner">🔄</div>';
    loadingOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 16px;
        z-index: 10;
    `;
    
    searchCard.style.position = 'relative';
    searchCard.appendChild(loadingOverlay);
}

// Hide loading state
function hideLoadingState() {
    const parkCards = document.querySelectorAll('.park-card-all');
    const loadingOverlay = document.querySelector('.loading-overlay');
    
    parkCards.forEach(card => {
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
    });
    
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

// Update results count
function updateResultsCount() {
    const visibleCards = document.querySelectorAll('.park-card-all[style*="opacity: 1"], .park-card-all:not([style*="display: none"])');
    const totalCards = document.querySelectorAll('.park-card-all');
    
    // Update section subtitle
    const subtitle = document.querySelector('.section-subtitle');
    if (subtitle) {
        const count = visibleCards.length;
        subtitle.textContent = `Showing ${count} of ${totalCards.length} parks with excellent facilities and beginner-friendly features`;
    }
}

// Enhanced notification system (reusing from main script)
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
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
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// Add slideOut animation
const style = document.createElement('style');
style.textContent += `
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
    
    .loading-spinner {
        font-size: 2rem;
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Initialize results count on page load
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateResultsCount, 100);
});
