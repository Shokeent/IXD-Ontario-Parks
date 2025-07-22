// Interactive Map JavaScript for Ontario Parks

let map;
let parkMarkers = [];
let currentMarkers = [];
let selectedPark = null;

// Ontario Parks coordinates data
const ontarioParksData = [
    {
        id: "algonquin-park",
        name: "Algonquin Provincial Park",
        lat: 45.5607,
        lng: -78.3566,
        region: "central",
        type: "provincial",
        activities: ["hiking", "canoeing", "camping", "fishing"],
        description: "Canada's oldest provincial park, perfect for canoeing and wildlife viewing with over 2,400 lakes and abundant wildlife.",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        campgrounds: 8,
        maxOccupancy: 6,
        price: 45,
        features: ["Visitor Centre", "Canoe Rentals", "Wildlife Viewing"]
    },
    {
        id: "killarney-park",
        name: "Killarney Provincial Park",
        lat: 46.0122,
        lng: -81.4028,
        region: "central",
        type: "provincial", 
        activities: ["hiking", "camping", "photography"],
        description: "Stunning white quartzite ridges and crystal-clear lakes in the La Cloche Mountains offering world-class hiking and photography.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        campgrounds: 6,
        maxOccupancy: 4,
        price: 52,
        features: ["Hiking Trails", "Lookout Points", "Photography"]
    },
    {
        id: "bruce-peninsula-park",
        name: "Bruce Peninsula National Park",
        lat: 45.2352,
        lng: -81.5314,
        region: "central",
        type: "national",
        activities: ["hiking", "swimming", "snorkeling"],
        description: "Rugged cliffs, ancient cedar forests, and crystal-clear Georgian Bay waters featuring the famous Bruce Trail.",
        image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        campgrounds: 3,
        maxOccupancy: 6,
        price: 55,
        features: ["Bruce Trail", "Cliff Views", "Snorkeling"]
    },
    {
        id: "bon-echo-park",
        name: "Bon Echo Provincial Park",
        lat: 44.9186,
        lng: -77.2011,
        region: "eastern",
        type: "provincial",
        activities: ["hiking", "swimming", "canoeing"],
        description: "Famous for its massive cliff rising from Mazinaw Lake and ancient pictographs created by Indigenous peoples.",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        campgrounds: 4,
        maxOccupancy: 8,
        price: 48,
        features: ["Cliff Views", "Pictographs", "Lake Access"]
    },
    {
        id: "sandbanks-park",
        name: "Sandbanks Provincial Park",
        lat: 43.9186,
        lng: -77.2398,
        region: "eastern",
        type: "provincial",
        activities: ["swimming", "camping", "cycling"],
        description: "World's largest freshwater sand dune system with pristine beaches perfect for families and water activities.",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        campgrounds: 5,
        maxOccupancy: 10,
        price: 42,
        features: ["Sandy Beaches", "Sand Dunes", "Swimming"]
    },
    {
        id: "muskoka-river-park",
        name: "Muskoka River Provincial Park",
        lat: 45.0356,
        lng: -79.3025,
        region: "central",
        type: "provincial",
        activities: ["canoeing", "fishing", "camping"],
        description: "Perfect for families with gentle rapids and beautiful Muskoka scenery featuring calm waters ideal for beginner canoeists.",
        image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        campgrounds: 3,
        maxOccupancy: 8,
        price: 38,
        features: ["Gentle Rapids", "Family Friendly", "Fishing"]
    },
    {
        id: "pinery-park",
        name: "Pinery Provincial Park",
        lat: 43.2583,
        lng: -81.8375,
        region: "southwestern",
        type: "provincial",
        activities: ["swimming", "hiking", "cycling"],
        description: "Rare oak savanna and wetland ecosystem with 10km of sandy Lake Huron shoreline and diverse bird species.",
        image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        campgrounds: 4,
        maxOccupancy: 6,
        price: 44,
        features: ["Lake Huron", "Oak Savanna", "Bird Watching"]
    },
    {
        id: "kawartha-highlands-park",
        name: "Kawartha Highlands Provincial Park",
        lat: 44.8667,
        lng: -78.2833,
        region: "central",
        type: "provincial",
        activities: ["hiking", "canoeing", "camping"],
        description: "Rugged wilderness park featuring ancient granite ridges, pristine lakes, and extensive backcountry camping opportunities.",
        image: "https://images.unsplash.com/photo-1486022111811-889bb0e44c12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=400&q=80",
        campgrounds: 2,
        maxOccupancy: 4,
        price: 40,
        features: ["Backcountry", "Granite Ridges", "Wilderness"]
    }
];

// Initialize map when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    setupEventListeners();
    loadParksOnMap();
});

// Initialize the Leaflet map
function initializeMap() {
    // Center on Ontario
    map = L.map('parkMap').setView([45.5, -80.0], 6);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Set max bounds to keep focus on Ontario
    const ontarioBounds = [
        [41.7, -95.2], // Southwest
        [56.9, -74.3]  // Northeast
    ];
    map.setMaxBounds(ontarioBounds);
}

// Setup event listeners
function setupEventListeners() {
    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const locationSearch = document.getElementById('locationSearch');
    
    searchBtn.addEventListener('click', performLocationSearch);
    locationSearch.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performLocationSearch();
        }
    });
    
    // Filter functionality
    const regionFilter = document.getElementById('regionFilter');
    const activityFilter = document.getElementById('activityFilter');
    const clearFilters = document.getElementById('clearFilters');
    
    regionFilter.addEventListener('change', applyFilters);
    activityFilter.addEventListener('change', applyFilters);
    clearFilters.addEventListener('click', clearAllFilters);
    
    // Map view toggles
    const satelliteView = document.getElementById('satelliteView');
    const terrainView = document.getElementById('terrainView');
    
    satelliteView.addEventListener('click', () => switchMapView('satellite'));
    terrainView.addEventListener('click', () => switchMapView('terrain'));
    
    // Close park info panel
    const closeParkInfo = document.getElementById('closeParkInfo');
    closeParkInfo.addEventListener('click', closeParkInfoPanel);
}

// Load parks as markers on the map
function loadParksOnMap() {
    // Clear existing markers
    currentMarkers.forEach(marker => map.removeLayer(marker));
    currentMarkers = [];
    
    // Add markers for each park
    ontarioParksData.forEach(park => {
        const marker = createParkMarker(park);
        currentMarkers.push(marker);
        map.addLayer(marker);
    });
}

// Create a marker for a park
function createParkMarker(park) {
    // Custom icon based on park type
    const iconColor = getMarkerColor(park.type);
    
    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${iconColor}; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
    
    // Create marker
    const marker = L.marker([park.lat, park.lng], { icon: customIcon });
    
    // Create popup content
    const popupContent = createPopupContent(park);
    marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup'
    });
    
    // Add click event to show park info panel
    marker.on('click', function() {
        showParkInfoPanel(park);
    });
    
    return marker;
}

// Get marker color based on park type
function getMarkerColor(type) {
    switch(type) {
        case 'provincial': return '#059669';
        case 'national': return '#dc2626';
        case 'conservation': return '#2563eb';
        default: return '#059669';
    }
}

// Create popup content for markers
function createPopupContent(park) {
    return `
        <div class="popup-content">
            <h4>${park.name}</h4>
            <p>${park.description.substring(0, 100)}...</p>
            <div class="popup-features">
                ${park.features.slice(0, 2).map(feature => 
                    `<span class="popup-feature">${feature}</span>`
                ).join('')}
            </div>
            <div class="popup-actions">
                <button class="popup-btn primary" onclick="showParkDetails(${park.id})">Details</button>
                <button class="popup-btn secondary" onclick="bookPark(${park.id})">Book</button>
            </div>
        </div>
    `;
}

// Show park info panel
function showParkInfoPanel(park) {
    selectedPark = park;
    
    // Update panel content
    document.getElementById('parkImage').src = park.image;
    document.getElementById('parkImage').alt = park.name;
    document.getElementById('parkName').textContent = park.name;
    document.getElementById('parkRegion').textContent = park.region.charAt(0).toUpperCase() + park.region.slice(1) + ' Ontario';
    document.getElementById('parkDescription').textContent = park.description;
    document.getElementById('parkCampgrounds').textContent = `${park.campgrounds} Campgrounds`;
    document.getElementById('parkOccupancy').textContent = `Up to ${park.maxOccupancy} people`;
    document.getElementById('parkPrice').textContent = `From $${park.price}/night`;
    
    // Setup action buttons
    document.getElementById('viewDetailsBtn').onclick = () => showParkDetails(park.id);
    document.getElementById('bookNowBtn').onclick = () => bookPark(park.id);
    
    // Show panel
    const panel = document.getElementById('parkInfoPanel');
    panel.classList.remove('hidden');
}

// Close park info panel
function closeParkInfoPanel() {
    const panel = document.getElementById('parkInfoPanel');
    panel.classList.add('hidden');
    selectedPark = null;
}

// Perform location search
function performLocationSearch() {
    const searchTerm = document.getElementById('locationSearch').value.trim();
    if (!searchTerm) return;
    
    // Simple search implementation - in a real app, you'd use a geocoding service
    const foundPark = ontarioParksData.find(park => 
        park.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        park.region.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    if (foundPark) {
        map.setView([foundPark.lat, foundPark.lng], 10);
        showParkInfoPanel(foundPark);
    } else {
        alert('Location not found. Try searching for a park name or region.');
    }
}

// Apply filters to map markers
function applyFilters() {
    const regionFilter = document.getElementById('regionFilter').value;
    const activityFilter = document.getElementById('activityFilter').value;
    
    // Clear existing markers
    currentMarkers.forEach(marker => map.removeLayer(marker));
    currentMarkers = [];
    
    // Filter parks based on criteria
    const filteredParks = ontarioParksData.filter(park => {
        const regionMatch = !regionFilter || park.region === regionFilter;
        const activityMatch = !activityFilter || park.activities.includes(activityFilter);
        return regionMatch && activityMatch;
    });
    
    // Add filtered markers
    filteredParks.forEach(park => {
        const marker = createParkMarker(park);
        currentMarkers.push(marker);
        map.addLayer(marker);
    });
    
    // Update statistics
    updateStatistics(filteredParks);
}

// Clear all filters
function clearAllFilters() {
    document.getElementById('regionFilter').value = '';
    document.getElementById('activityFilter').value = '';
    document.getElementById('locationSearch').value = '';
    
    // Reload all parks
    loadParksOnMap();
    updateStatistics(ontarioParksData);
    
    // Reset map view
    map.setView([45.5, -80.0], 6);
}

// Switch map view (satellite/terrain)
function switchMapView(viewType) {
    // Remove existing tile layers
    map.eachLayer(function(layer) {
        if (layer instanceof L.TileLayer) {
            map.removeLayer(layer);
        }
    });
    
    // Add new tile layer based on view type
    if (viewType === 'satellite') {
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri'
        }).addTo(map);
        
        // Update button states
        document.getElementById('satelliteView').classList.add('active');
        document.getElementById('terrainView').classList.remove('active');
    } else {
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
        // Update button states
        document.getElementById('terrainView').classList.add('active');
        document.getElementById('satelliteView').classList.remove('active');
    }
}

// Update statistics display
function updateStatistics(parks = ontarioParksData) {
    const provincialParks = parks.filter(p => p.type === 'provincial').length;
    const nationalParks = parks.filter(p => p.type === 'national').length;
    const conservationAreas = parks.filter(p => p.type === 'conservation').length;
    
    document.getElementById('totalParks').textContent = parks.length;
    document.getElementById('provincialParks').textContent = provincialParks;
    document.getElementById('nationalParks').textContent = nationalParks;
    document.getElementById('conservationAreas').textContent = conservationAreas;
}

// Navigate to park details (called from popup buttons)
function showParkDetails(parkId) {
    localStorage.setItem('selectedParkId', parkId);
    window.location.href = 'park-details.html';
}

// Navigate to booking (called from popup buttons)
function bookPark(parkId) {
    localStorage.setItem('selectedParkId', parkId);
    window.location.href = 'booking.html';
}

// Export functions for external use
window.mapAPI = {
    showParkDetails,
    bookPark,
    showParkInfoPanel,
    ontarioParksData
};
