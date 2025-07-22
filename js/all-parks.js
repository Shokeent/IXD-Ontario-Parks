// All Parks Page JavaScript with API Integration

document.addEventListener('DOMContentLoaded', function() {
    initParksPage();
});

async function initParksPage() {
    try {
        console.log('Initializing parks page...');
        
        // Show loading state
        showLoadingState();
        
        // Initialize components
        initSearchAndFilters();
        initViewToggle();
        
        // Load parks data from API
        await loadParksData();
        
        // Initialize interactions after data is loaded
        initSortingOptions();
        initPagination();
        
        console.log('Parks page initialization complete');
        
    } catch (error) {
        console.error('Failed to initialize parks page:', error);
        showErrorState();
    }
}

// Global variables for parks data and filters
let allParks = [];
let filteredParks = [];
let currentPage = 1;
const parksPerPage = 12;
let currentView = 'grid'; // 'grid' or 'list'

// Load parks data from API
async function loadParksData() {
    try {
        // Wait for API to be available
        let attempts = 0;
        const maxAttempts = 10;
        
        while (!window.ontarioParksAPI && attempts < maxAttempts) {
            console.log('Waiting for Ontario Parks API to load...');
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
        }
        
        if (!window.ontarioParksAPI) {
            throw new Error('Ontario Parks API failed to load after multiple attempts');
        }
        
        console.log('Loading parks data...');
        allParks = await window.ontarioParksAPI.getAllParks();
        filteredParks = [...allParks];
        
        console.log(`Loaded ${allParks.length} parks successfully`);
        
        // Populate filter options
        await populateFilterOptions();
        
        // Render parks
        renderParks();
        updateParkCount();
        
        // Hide loading state
        hideLoadingState();
        
    } catch (error) {
        console.error('Error loading parks data:', error);
        
        // Try fallback with mock data
        try {
            console.log('Attempting to load fallback park data...');
            allParks = generateMockParks();
            filteredParks = [...allParks];
            
            console.log('Generated mock parks:', allParks);
            console.log('First park image:', allParks[0]?.image);
            
            // Populate filter options with mock data
            populateMockFilterOptions();
            
            // Render parks
            renderParks();
            updateParkCount();
            
            // Hide loading state
            hideLoadingState();
            
            console.log('Successfully loaded fallback park data');
        } catch (fallbackError) {
            console.error('Failed to load fallback data:', fallbackError);
            showErrorState();
        }
    }
}

// Show loading state
function showLoadingState() {
    const container = document.querySelector('.parks-grid-all') || 
                     document.querySelector('.parks-grid') || 
                     document.querySelector('.parks-container');
    if (container) {
        container.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                <p>Loading Ontario Parks...</p>
            </div>
        `;
    }
}

// Hide loading state
function hideLoadingState() {
    const loadingState = document.querySelector('.loading-state');
    if (loadingState) {
        loadingState.remove();
    }
}

// Show error state
function showErrorState() {
    const container = document.querySelector('.parks-grid-all') || 
                     document.querySelector('.parks-grid') || 
                     document.querySelector('.parks-container');
    if (container) {
        container.innerHTML = `
            <div class="error-state">
                <h3>Unable to load parks data</h3>
                <p>Please check your internet connection and try again.</p>
                <button onclick="location.reload()" class="btn btn-primary">Retry</button>
            </div>
        `;
    }
}

// Populate filter options from API data
async function populateFilterOptions() {
    try {
        // Populate region filter
        const regions = await window.ontarioParksAPI.getRegions();
        populateSelectOptions('region-filter', regions);
        
        // Populate activity filter
        const activities = await window.ontarioParksAPI.getActivities();
        populateSelectOptions('activity-filter', activities);
        
        // Populate amenity filter
        const amenities = await window.ontarioParksAPI.getAmenities();
        populateSelectOptions('amenity-filter', amenities);
        
    } catch (error) {
        console.error('Error populating filter options:', error);
    }
}

// Helper function to populate select options
function populateSelectOptions(selectId, options) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    // Keep the default "All" option
    const currentOptions = select.innerHTML;
    
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });
}

// Initialize search and filters
function initSearchAndFilters() {
    // Search functionality
    const searchInput = document.getElementById('park-search') || document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // Filter functionality
    const filters = document.querySelectorAll('.filter-select, .filter-checkbox');
    filters.forEach(filter => {
        filter.addEventListener('change', handleFilterChange);
    });
    
    // Clear filters button
    const clearFiltersBtn = document.querySelector('.clear-filters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

// Handle search input
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    
    filteredParks = allParks.filter(park => 
        park.name.toLowerCase().includes(searchTerm) ||
        park.description.toLowerCase().includes(searchTerm) ||
        park.region.toLowerCase().includes(searchTerm) ||
        park.activities.some(activity => activity.toLowerCase().includes(searchTerm))
    );
    
    currentPage = 1;
    renderParks();
    updateParkCount();
}

// Handle filter changes
function handleFilterChange() {
    const filters = getActiveFilters();
    
    filteredParks = allParks.filter(park => {
        // Region filter
        if (filters.region && park.region !== filters.region) {
            return false;
        }
        
        // Activity filter
        if (filters.activity && !park.activities.some(activity => 
            activity.toLowerCase().includes(filters.activity.toLowerCase()))) {
            return false;
        }
        
        // Amenity filter
        if (filters.amenity && !park.amenities.some(amenity => 
            amenity.toLowerCase().includes(filters.amenity.toLowerCase()))) {
            return false;
        }
        
        // Difficulty filter
        if (filters.difficulty && park.difficulty !== filters.difficulty) {
            return false;
        }
        
        // Pets filter
        if (filters.pets && !park.pets) {
            return false;
        }
        
        // Accessibility filter
        if (filters.accessibility && !park.accessibility) {
            return false;
        }
        
        return true;
    });
    
    currentPage = 1;
    renderParks();
    updateParkCount();
}

// Get active filters
function getActiveFilters() {
    const filters = {};
    
    const regionFilter = document.getElementById('region-filter');
    if (regionFilter && regionFilter.value) {
        filters.region = regionFilter.value;
    }
    
    const activityFilter = document.getElementById('activity-filter');
    if (activityFilter && activityFilter.value) {
        filters.activity = activityFilter.value;
    }
    
    const amenityFilter = document.getElementById('amenity-filter');
    if (amenityFilter && amenityFilter.value) {
        filters.amenity = amenityFilter.value;
    }
    
    const difficultyFilter = document.getElementById('difficulty-filter');
    if (difficultyFilter && difficultyFilter.value) {
        filters.difficulty = difficultyFilter.value;
    }
    
    const petsFilter = document.getElementById('pets-filter');
    if (petsFilter && petsFilter.checked) {
        filters.pets = true;
    }
    
    const accessibilityFilter = document.getElementById('accessibility-filter');
    if (accessibilityFilter && accessibilityFilter.checked) {
        filters.accessibility = true;
    }
    
    return filters;
}

// Clear all filters
function clearAllFilters() {
    // Clear search input
    const searchInput = document.getElementById('park-search') || document.querySelector('.search-input');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Reset all select filters
    const selectFilters = document.querySelectorAll('.filter-select');
    selectFilters.forEach(select => {
        select.selectedIndex = 0;
    });
    
    // Uncheck all checkbox filters
    const checkboxFilters = document.querySelectorAll('.filter-checkbox');
    checkboxFilters.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset filtered parks
    filteredParks = [...allParks];
    currentPage = 1;
    renderParks();
    updateParkCount();
}

// Initialize view toggle (grid/list)
function initViewToggle() {
    const gridViewBtn = document.querySelector('.view-grid');
    const listViewBtn = document.querySelector('.view-list');
    
    if (gridViewBtn) {
        gridViewBtn.addEventListener('click', () => {
            currentView = 'grid';
            updateViewButtons();
            renderParks();
        });
    }
    
    if (listViewBtn) {
        listViewBtn.addEventListener('click', () => {
            currentView = 'list';
            updateViewButtons();
            renderParks();
        });
    }
}

// Update view button states
function updateViewButtons() {
    const gridBtn = document.querySelector('.view-grid');
    const listBtn = document.querySelector('.view-list');
    
    if (gridBtn && listBtn) {
        gridBtn.classList.toggle('active', currentView === 'grid');
        listBtn.classList.toggle('active', currentView === 'list');
    }
}

// Initialize sorting options
function initSortingOptions() {
    const sortSelect = document.getElementById('sort-select') || document.querySelector('.sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', handleSortChange);
    }
}

// Handle sort change
function handleSortChange(event) {
    const sortBy = event.target.value;
    
    switch (sortBy) {
        case 'name':
            filteredParks.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'region':
            filteredParks.sort((a, b) => a.region.localeCompare(b.region));
            break;
        case 'difficulty':
            filteredParks.sort((a, b) => {
                const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
                return (difficultyOrder[a.difficulty] || 2) - (difficultyOrder[b.difficulty] || 2);
            });
            break;
        case 'price':
            filteredParks.sort((a, b) => a.pricing.tent - b.pricing.tent);
            break;
        default:
            // Default sort by name
            filteredParks.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    renderParks();
}

// Render parks based on current view and pagination
function renderParks() {
    try {
        console.log('Rendering parks...', {
            allParksCount: allParks.length,
            filteredParksCount: filteredParks.length,
            currentPage,
            parksPerPage
        });
        
        const container = document.querySelector('.parks-grid-all') || 
                         document.querySelector('.parks-grid') || 
                         document.querySelector('.parks-container');
        if (!container) {
            console.error('No container found for parks');
            return;
        }
        
        // Calculate pagination
        const startIndex = (currentPage - 1) * parksPerPage;
        const endIndex = startIndex + parksPerPage;
        const parksToShow = filteredParks.slice(startIndex, endIndex);
        
        console.log('Parks to show:', parksToShow.length);
        
        // Update container class based on view
        container.className = currentView === 'grid' ? 'parks-grid-all' : 'parks-list';
        
        // Render parks
        container.innerHTML = parksToShow.map(park => 
            currentView === 'grid' ? renderParkCard(park) : renderParkListItem(park)
        ).join('');
        
        console.log('Parks rendered successfully');
        
        // Add click handlers
        addParkClickHandlers();
        
        // Update pagination
        updatePagination();
        
    } catch (error) {
        console.error('Error rendering parks:', error);
        // Show a simple fallback
        const container = document.querySelector('.parks-grid-all') || 
                         document.querySelector('.parks-grid') || 
                         document.querySelector('.parks-container');
        if (container) {
            container.innerHTML = `
                <div class="error-state">
                    <h3>Error displaying parks</h3>
                    <p>There was a problem displaying the parks. Please refresh the page.</p>
                </div>
            `;
        }
    }
}

// Render individual park card (grid view)
function renderParkCard(park) {
    const difficultyClass = park.difficulty.toLowerCase();
    const amenitiesText = park.amenities.slice(0, 3).join(', ') + 
                         (park.amenities.length > 3 ? `, +${park.amenities.length - 3} more` : '');
    
    return `
        <div class="park-card-all" data-park-id="${park.id}">
            <div class="park-image">
                <img src="${park.image}" alt="${park.name}" loading="lazy" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;">
                <span class="difficulty-badge ${difficultyClass}">${park.difficulty}</span>
                ${park.pets ? '<span class="pets-badge">🐕 Pet Friendly</span>' : ''}
            </div>
            <div class="park-info-all">
                <h3>${park.name}</h3>
                <div class="park-location">📍 ${park.region}</div>
                <p class="park-description-all">${park.description.substring(0, 100)}...</p>
                
                <div class="park-tags">
                    <span class="park-tag">🏕️ ${park.campgrounds} Campgrounds</span>
                    <span class="park-tag">👥 Up to ${park.maxOccupancy}</span>
                    ${park.accessibility ? '<span class="park-tag">♿ Accessible</span>' : ''}
                </div>
                
                <div class="park-pricing-all">
                    <span class="price-label">From $${park.pricing.tent}/night</span>
                </div>
                
                <div class="park-actions-all">
                    <button class="btn-outline">View Details</button>
                    <button class="btn-book">Book Now</button>
                </div>
            </div>
        </div>
    `;
}

// Render individual park list item (list view)
function renderParkListItem(park) {
    const difficultyClass = park.difficulty.toLowerCase();
    
    return `
        <div class="park-list-item" data-park-id="${park.id}">
            <div class="park-image-small">
                <img src="${park.image}" alt="${park.name}" loading="lazy">
            </div>
            <div class="park-info">
                <div class="park-header">
                    <h3 class="park-name">${park.name}</h3>
                    <span class="difficulty-badge ${difficultyClass}">${park.difficulty}</span>
                </div>
                <p class="park-region">${park.region}</p>
                <p class="park-description">${park.description}</p>
                <div class="park-details">
                    <span class="detail">🏕️ ${park.campgrounds} Campgrounds</span>
                    <span class="detail">👥 Up to ${park.maxOccupancy}</span>
                    <span class="detail">From $${park.pricing.tent}/night</span>
                    ${park.pets ? '<span class="detail">🐕 Pet Friendly</span>' : ''}
                    ${park.accessibility ? '<span class="detail">♿ Accessible</span>' : ''}
                </div>
            </div>
            <div class="park-actions">
                <button class="btn btn-primary">View Details</button>
                <button class="btn btn-secondary">Quick Book</button>
            </div>
        </div>
    `;
}

// Add click handlers to park cards
function addParkClickHandlers() {
    const parkCards = document.querySelectorAll('.park-card-all, .park-list-item');
    parkCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('btn-outline') && !e.target.classList.contains('btn-book')) {
                const parkId = card.dataset.parkId;
                navigateToParkDetails(parkId);
            }
        });
        
        // Handle button clicks
        const detailsBtn = card.querySelector('.btn-outline');
        if (detailsBtn) {
            detailsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const parkId = card.dataset.parkId;
                navigateToParkDetails(parkId);
            });
        }
        
        const bookBtn = card.querySelector('.btn-book');
        if (bookBtn) {
            bookBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const parkId = card.dataset.parkId;
                navigateToBooking(parkId);
            });
        }
    });
}

// Navigate to park details page
function navigateToParkDetails(parkId) {
    // Store park ID in localStorage for the details page
    localStorage.setItem('selectedParkId', parkId);
    window.location.href = 'park-details.html';
}

// Navigate to booking page
function navigateToBooking(parkId) {
    // Store park ID in localStorage for the booking page
    localStorage.setItem('selectedParkId', parkId);
    window.location.href = 'booking.html';
}

// Initialize pagination
function initPagination() {
    const prevBtn = document.querySelector('.pagination-prev');
    const nextBtn = document.querySelector('.pagination-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderParks();
                scrollToTop();
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredParks.length / parksPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderParks();
                scrollToTop();
            }
        });
    }
}

// Update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(filteredParks.length / parksPerPage);
    const prevBtn = document.querySelector('.pagination-prev');
    const nextBtn = document.querySelector('.pagination-next');
    const pageInfo = document.querySelector('.pagination-info');
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
    }
    
    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    }
    
    // Update page numbers if they exist
    updatePageNumbers(totalPages);
}

// Update page number buttons
function updatePageNumbers(totalPages) {
    const pageNumbers = document.querySelector('.page-numbers');
    if (!pageNumbers) return;
    
    pageNumbers.innerHTML = '';
    
    // Show up to 5 page numbers
    const maxPages = Math.min(5, totalPages);
    let startPage = Math.max(1, currentPage - Math.floor(maxPages / 2));
    let endPage = Math.min(totalPages, startPage + maxPages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage < maxPages - 1) {
        startPage = Math.max(1, endPage - maxPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderParks();
            scrollToTop();
        });
        pageNumbers.appendChild(pageBtn);
    }
}

// Update park count display
function updateParkCount() {
    const countElement = document.querySelector('.park-count') || document.querySelector('.results-count');
    if (countElement) {
        const total = filteredParks.length;
        const showing = Math.min(parksPerPage, total - (currentPage - 1) * parksPerPage);
        const start = total > 0 ? (currentPage - 1) * parksPerPage + 1 : 0;
        const end = (currentPage - 1) * parksPerPage + showing;
        
        countElement.textContent = `Showing ${start}-${end} of ${total} parks`;
    }
}

// Scroll to top of page
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Debounce function for search
function debounce(func, wait) {
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

// Export functions for external use
window.parksPageAPI = {
    loadParksData,
    searchParks: async (criteria) => {
        return await window.ontarioParksAPI.searchParks(criteria);
    },
    getAllParks: () => allParks,
    getFilteredParks: () => filteredParks
};

// Mock data generation functions
function generateMockParks() {
    return [
        {
            id: 1,
            name: "Algonquin Provincial Park",
            region: "Central Ontario",
            location: "Huntsville, ON", 
            description: "Canada's oldest provincial park, perfect for canoeing and wildlife viewing with over 2,400 lakes and abundant wildlife.",
            image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80",
            activities: ["Canoeing", "Hiking", "Wildlife Viewing"],
            amenities: ["Visitor Centre", "Canoe Rentals", "Gift Shop"],
            difficulty: "Beginner Friendly",
            rating: 4.8,
            priceRange: "$$",
            campgrounds: 8,
            maxOccupancy: 6,
            accessibility: true,
            pets: true,
            pricing: {
                tent: 45,
                rv: 65,
                cabin: 120
            }
        },
        {
            id: 2,
            name: "Killarney Provincial Park",
            region: "Central Ontario", 
            location: "Killarney, ON",
            description: "Stunning white quartzite ridges and crystal-clear lakes in the La Cloche Mountains offering world-class hiking and photography.",
            image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            activities: ["Hiking", "Camping", "Photography"],
            amenities: ["Hiking Trails", "Campsites", "Lookout Points"],
            difficulty: "Intermediate",
            rating: 4.9,
            priceRange: "$$$",
            campgrounds: 6,
            maxOccupancy: 4,
            accessibility: false,
            pets: false,
            pricing: {
                tent: 52,
                rv: 72,
                cabin: 140
            }
        },
        {
            id: 3,
            name: "Bon Echo Provincial Park",
            region: "Eastern Ontario",
            location: "Cloyne, ON",
            description: "Famous for its massive cliff rising from Mazinaw Lake and ancient pictographs created by Indigenous peoples centuries ago.",
            image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
            activities: ["Rock Climbing", "Swimming", "Cultural Tours"],
            amenities: ["Beach Access", "Visitor Centre", "Boat Launch"],
            difficulty: "All Levels",
            rating: 4.7,
            priceRange: "$$",
            campgrounds: 4,
            maxOccupancy: 8,
            accessibility: true,
            pets: true,
            pricing: {
                tent: 48,
                rv: 68,
                cabin: 125
            }
        },
        {
            id: 4,
            name: "Bruce Peninsula National Park",
            region: "Central Ontario",
            location: "Tobermory, ON", 
            description: "Rugged cliffs, ancient cedar forests, and crystal-clear Georgian Bay waters featuring the famous Bruce Trail and underwater shipwrecks.",
            image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            activities: ["Hiking", "Snorkeling", "Cliff Views"],
            amenities: ["Hiking Trails", "Interpretive Centre", "Guided Tours"],
            difficulty: "Intermediate",
            rating: 4.6,
            priceRange: "$$$",
            campgrounds: 3,
            maxOccupancy: 6,
            accessibility: false,
            pets: false,
            pricing: {
                tent: 55,
                rv: 75,
                cabin: 150
            }
        },
        {
            id: 5,
            name: "Sandbanks Provincial Park",
            region: "Eastern Ontario",
            location: "Picton, ON",
            description: "World's largest freshwater sand dune system with pristine beaches perfect for families and water activities along Lake Ontario.",
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80",
            activities: ["Swimming", "Beach Activities", "Cycling"],
            amenities: ["Sandy Beaches", "Picnic Areas", "Bike Rentals"],
            difficulty: "Beginner Friendly", 
            rating: 4.5,
            priceRange: "$$",
            campgrounds: 5,
            maxOccupancy: 10,
            accessibility: true,
            pets: true,
            pricing: {
                tent: 42,
                rv: 62,
                cabin: 110
            }
        },
        {
            id: 6,
            name: "Muskoka River Provincial Park",
            region: "Central Ontario",
            location: "Bracebridge, ON",
            description: "Perfect for families with gentle rapids and beautiful Muskoka scenery featuring calm waters ideal for beginner canoeists.",
            image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
            activities: ["Canoeing", "Fishing", "Family Programs"],
            amenities: ["Canoe Access", "Kids Programs", "Picnic Facilities"],
            difficulty: "Beginner Friendly",
            rating: 4.4,
            priceRange: "$",
            campgrounds: 3,
            maxOccupancy: 8,
            accessibility: true,
            pets: true,
            pricing: {
                tent: 38,
                rv: 58,
                cabin: 95
            }
        }
    ];
}

function populateMockFilterOptions() {
    try {
        console.log('Populating mock filter options...');
        
        // Mock filter population
        const regions = ["All Regions", "Central Ontario", "Eastern Ontario", "Northern Ontario"];
        const activities = ["All Activities", "Hiking", "Canoeing", "Swimming", "Camping"];
        const amenities = ["All Amenities", "Visitor Centre", "Beach Access", "Hiking Trails"];
        
        populateSelectOptions('region-filter', regions);
        populateSelectOptions('activity-filter', activities);  
        populateSelectOptions('amenity-filter', amenities);
        
        console.log('Mock filter options populated successfully');
    } catch (error) {
        console.error('Error populating mock filter options:', error);
        // Don't throw - just log the error
    }
}