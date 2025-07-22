// Ontario Parks Image Configuration
// Maps park names to high-quality images from public sources

const PARK_IMAGES = {
    // Major Provincial Parks
    'Algonquin Provincial Park': {
        main: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=500&fit=crop&crop=center',
        hero: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&crop=center',
        gallery: [
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=500&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&h=500&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=500&fit=crop&crop=center'
        ]
    },
    
    'Killarney Provincial Park': {
        main: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop&crop=center',
        hero: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&crop=center',
        gallery: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1464822759844-d150ad6c1dd5?w=800&h=500&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1442850473887-0fb77cd0b337?w=800&h=500&fit=crop&crop=center'
        ]
    },

    'Sandbanks Provincial Park': {
        main: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop&crop=center',
        hero: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=600&fit=crop&crop=center',
        gallery: [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=500&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&h=500&fit=crop&crop=center'
        ]
    },

    'Blue Mountain Provincial Park': {
        main: 'https://images.unsplash.com/photo-1464822759844-d150ad6c1dd5?w=800&h=500&fit=crop&crop=center',
        hero: 'https://images.unsplash.com/photo-1464822759844-d150ad6c1dd5?w=1200&h=600&fit=crop&crop=center',
        gallery: [
            'https://images.unsplash.com/photo-1464822759844-d150ad6c1dd5?w=800&h=500&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=500&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=500&fit=crop&crop=center'
        ]
    },

    'Bon Echo Provincial Park': {
        main: 'https://images.unsplash.com/photo-1442850473887-0fb77cd0b337?w=800&h=500&fit=crop&crop=center',
        hero: 'https://images.unsplash.com/photo-1442850473887-0fb77cd0b337?w=1200&h=600&fit=crop&crop=center',
        gallery: [
            'https://images.unsplash.com/photo-1442850473887-0fb77cd0b337?w=800&h=500&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=500&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1464822759844-d150ad6c1dd5?w=800&h=500&fit=crop&crop=center'
        ]
    },

    'Presqu\'ile Provincial Park': {
        main: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=500&fit=crop&crop=center',
        hero: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1200&h=600&fit=crop&crop=center',
        gallery: [
            'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=500&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&h=500&fit=crop&crop=center'
        ]
    },

    'Long Point Provincial Park': {
        main: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&h=500&fit=crop&crop=center',
        hero: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1200&h=600&fit=crop&crop=center',
        gallery: [
            'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&h=500&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=500&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop&crop=center'
        ]
    },

    'Arrowhead Provincial Park': {
        main: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=500&fit=crop&crop=center',
        hero: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1200&h=600&fit=crop&crop=center',
        gallery: [
            'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=500&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=500&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1464822759844-d150ad6c1dd5?w=800&h=500&fit=crop&crop=center'
        ]
    },

    'Silent Lake Provincial Park': {
        main: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&h=500&fit=crop&crop=center',
        hero: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1200&h=600&fit=crop&crop=center',
        gallery: [
            'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&h=500&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=500&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=500&fit=crop&crop=center'
        ]
    },

    'Pancake Bay Provincial Park': {
        main: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop&crop=center',
        hero: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&h=600&fit=crop&crop=center',
        gallery: [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&h=500&fit=crop&crop=center',
            'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&h=500&fit=crop&crop=center'
        ]
    }
};

// Hero images for different sections
const HERO_IMAGES = {
    homepage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=800&fit=crop&crop=center',
    allParks: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=600&fit=crop&crop=center',
    booking: 'https://images.unsplash.com/photo-1464822759844-d150ad6c1dd5?w=1920&h=600&fit=crop&crop=center',
    gear: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=600&fit=crop&crop=center'
};

// Gear category images
const GEAR_IMAGES = {
    shelter: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop&crop=center',
    hiking: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop&crop=center',
    fishing: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=300&fit=crop&crop=center',
    winter: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop&crop=center',
    biking: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
    birding: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop&crop=center'
};

// Activity icons and images
const ACTIVITY_IMAGES = {
    hiking: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=300&h=200&fit=crop&crop=center',
    canoeing: 'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=300&h=200&fit=crop&crop=center',
    fishing: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=300&h=200&fit=crop&crop=center',
    swimming: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=300&h=200&fit=crop&crop=center',
    wildlife: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=200&fit=crop&crop=center',
    photography: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=300&h=200&fit=crop&crop=center'
};

// Fallback images for unknown parks
const FALLBACK_IMAGES = [
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1464822759844-d150ad6c1dd5?w=800&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=500&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1442850473887-0fb77cd0b337?w=800&h=500&fit=crop&crop=center'
];

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PARK_IMAGES,
        HERO_IMAGES,
        GEAR_IMAGES,
        ACTIVITY_IMAGES,
        FALLBACK_IMAGES
    };
}

// Make available globally
if (typeof window !== 'undefined') {
    window.PARK_IMAGES = PARK_IMAGES;
    window.HERO_IMAGES = HERO_IMAGES;
    window.GEAR_IMAGES = GEAR_IMAGES;
    window.ACTIVITY_IMAGES = ACTIVITY_IMAGES;
    window.FALLBACK_IMAGES = FALLBACK_IMAGES;
}
