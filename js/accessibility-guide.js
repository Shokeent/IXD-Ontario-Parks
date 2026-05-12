// Accessibility Guide & Inclusive Tourism Manager
// Detailed accessibility info, adaptive equipment, inclusive experiences

class AccessibilityGuideManager {
    constructor() {
        this.parkAccessibility = this.loadAccessibilityData();
        this.userProfile = JSON.parse(localStorage.getItem('accessibility-profile') || 'null');
        this.savedPreferences = JSON.parse(localStorage.getItem('accessibility-prefs') || '{}');
    }

    loadAccessibilityData() {
        return {
            'algonquin-park': {
                overall: 72,
                wheelchairPaths: [
                    { name: 'Visitor Centre Boardwalk', length: 0.8, surface: 'paved', grade: 'gentle', restrooms: true },
                    { name: 'Lake of Two Rivers Beach Access', length: 0.3, surface: 'compacted gravel', grade: 'flat', restrooms: true },
                    { name: 'Spruce Bog Boardwalk', length: 1.7, surface: 'wooden boardwalk', grade: 'flat', restrooms: false }
                ],
                adaptiveEquipment: [
                    { item: 'Beach wheelchair', available: 2, cost: 'free', booking: 'required' },
                    { item: 'Motorized scooter', available: 1, cost: 'free', booking: 'required' },
                    { item: 'All-terrain wheelchair (TrailRider)', available: 1, cost: 'free', booking: 'required' }
                ],
                accessibleCampsites: [
                    { number: 'T-12', features: ['paved pad', 'accessible picnic table', 'level surface', 'nearby restroom'], park: 'algonquin-park' },
                    { number: 'T-15', features: ['paved pad', 'accessible fire pit', 'level surface'], park: 'algonquin-park' },
                    { number: 'M-4', features: ['paved pad', 'accessible restroom nearby', 'level surface'], park: 'algonquin-park' }
                ],
                sensoryAccessibility: {
                    brailleSignage: true,
                    audioGuides: true,
                    tactileMaps: true,
                    largePrintMaterials: true,
                    hearingLoop: false,
                    signLanguageEvents: false
                },
                parkingAccessibility: {
                    designatedSpaces: 14,
                    location: 'Main visitor centre entrance',
                    surface: 'paved',
                    widthInches: 96
                },
                serviceDogPolicy: 'Service dogs welcome throughout the park',
                accessibleWashrooms: { count: 6, locations: ['Visitor Centre', 'Lake of Two Rivers', 'Mew Lake'] }
            },
            'pinery-park': {
                overall: 85,
                wheelchairPaths: [
                    { name: 'Dunes Boardwalk', length: 2.5, surface: 'wooden boardwalk', grade: 'flat', restrooms: true },
                    { name: 'Beach Access Ramp', length: 0.2, surface: 'firm sand mat', grade: 'gentle', restrooms: true },
                    { name: 'Picnic Area Loop', length: 1.2, surface: 'paved', grade: 'flat', restrooms: true }
                ],
                adaptiveEquipment: [
                    { item: 'Beach wheelchair', available: 3, cost: 'free', booking: 'recommended' },
                    { item: 'Pool lift (Keil swimming area)', available: 1, cost: 'free', booking: 'not required' }
                ],
                accessibleCampsites: [
                    { number: 'A-2', features: ['paved pad', 'accessible table', 'level surface', 'accessible restroom nearby'] },
                    { number: 'A-5', features: ['paved pad', 'accessible fire pit', 'level ground'] }
                ],
                sensoryAccessibility: {
                    brailleSignage: true,
                    audioGuides: false,
                    tactileMaps: false,
                    largePrintMaterials: true,
                    hearingLoop: false,
                    signLanguageEvents: false
                },
                parkingAccessibility: { designatedSpaces: 18, location: 'Visitor centre and beach areas', surface: 'paved', widthInches: 96 },
                serviceDogPolicy: 'Service dogs welcome throughout. Not permitted on some beach areas — check with staff.',
                accessibleWashrooms: { count: 8, locations: ['Visitor Centre', 'Beach 1', 'Beach 2', 'Campground'] }
            },
            'killarney-park': {
                overall: 28,
                wheelchairPaths: [],
                adaptiveEquipment: [],
                accessibleCampsites: [],
                sensoryAccessibility: {
                    brailleSignage: false,
                    audioGuides: false,
                    tactileMaps: false,
                    largePrintMaterials: true,
                    hearingLoop: false,
                    signLanguageEvents: false
                },
                parkingAccessibility: { designatedSpaces: 2, location: 'Main parking lot', surface: 'gravel', widthInches: 96 },
                serviceDogPolicy: 'Service dogs welcome throughout the park',
                accessibleWashrooms: { count: 1, locations: ['Visitor Centre'] },
                note: 'Killarney\'s rugged terrain limits wheelchair accessibility. Most trails are challenging rocky surfaces.'
            }
        };
    }

    // Get park accessibility
    getParkAccessibility(parkId) {
        return this.parkAccessibility[parkId] || null;
    }

    // Get accessibility score
    getAccessibilityScore(parkId) {
        const data = this.parkAccessibility[parkId];
        return data?.overall || 0;
    }

    // Save user accessibility profile
    saveUserProfile(profile) {
        this.userProfile = {
            ...profile,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem('accessibility-profile', JSON.stringify(this.userProfile));
    }

    // Get recommended parks based on accessibility needs
    getRecommendedParks(needs = []) {
        const recs = [];

        Object.entries(this.parkAccessibility).forEach(([parkId, data]) => {
            let score = data.overall;
            let matches = [];

            if (needs.includes('wheelchair') && data.wheelchairPaths.length > 0) {
                matches.push('Wheelchair accessible paths');
                score += 10;
            }
            if (needs.includes('adaptive-equipment') && data.adaptiveEquipment.length > 0) {
                matches.push('Adaptive equipment available');
                score += 10;
            }
            if (needs.includes('sensory') && (data.sensoryAccessibility.audioGuides || data.sensoryAccessibility.brailleSignage)) {
                matches.push('Sensory accessibility features');
                score += 10;
            }
            if (needs.includes('beach') && data.wheelchairPaths.some(p => p.name.toLowerCase().includes('beach'))) {
                matches.push('Accessible beach');
                score += 15;
            }

            if (score > 30) {
                recs.push({ parkId, score, matches, overall: data.overall });
            }
        });

        return recs.sort((a, b) => b.score - a.score);
    }

    // Get accessible amenities summary
    getAccessibleAmenitiesSummary(parkId) {
        const data = this.parkAccessibility[parkId];
        if (!data) return null;

        return {
            wheelchairPaths: data.wheelchairPaths.length,
            totalPathLength: data.wheelchairPaths.reduce((sum, p) => sum + p.length, 0).toFixed(1) + 'km',
            adaptiveEquipment: data.adaptiveEquipment.length,
            accessibleCampsites: data.accessibleCampsites.length,
            accessibleWashrooms: data.accessibleWashrooms.count,
            accessibleParking: data.parkingAccessibility.designatedSpaces,
            overallScore: data.overall,
            note: data.note || null
        };
    }

    // Render accessibility info
    renderAccessibilityInfo(parkId, containerId = 'accessibility-info') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const data = this.parkAccessibility[parkId];
        if (!data) {
            container.innerHTML = '<p>Accessibility information not available for this park.</p>';
            return;
        }

        const summary = this.getAccessibleAmenitiesSummary(parkId);
        const scoreColour = data.overall >= 70 ? '#4CAF50' : data.overall >= 40 ? '#FF9800' : '#F44336';

        let html = `
            <div class="accessibility-guide">
                <div class="accessibility-score-card" style="border-left: 4px solid ${scoreColour}">
                    <div class="score-number" style="color: ${scoreColour}">${data.overall}/100</div>
                    <div class="score-label">Accessibility Score</div>
                </div>

                ${data.note ? `<div class="accessibility-notice">⚠️ ${data.note}</div>` : ''}

                <div class="accessibility-section">
                    <h3>♿ Wheelchair Accessible Paths</h3>
                    ${data.wheelchairPaths.length === 0 ? '<p>No wheelchair-accessible paths at this park.</p>' : `
                        <div class="paths-list">
                            ${data.wheelchairPaths.map(path => `
                                <div class="path-item">
                                    <strong>${path.name}</strong>
                                    <div class="path-details">
                                        <span>${path.length}km</span>
                                        <span>${path.surface}</span>
                                        <span>${path.grade}</span>
                                        ${path.restrooms ? '<span>🚻 Restrooms</span>' : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>

                <div class="accessibility-section">
                    <h3>🛠️ Adaptive Equipment</h3>
                    ${data.adaptiveEquipment.length === 0 ? '<p>No adaptive equipment at this park.</p>' : `
                        <div class="equipment-list">
                            ${data.adaptiveEquipment.map(eq => `
                                <div class="equipment-item">
                                    <strong>${eq.item}</strong>
                                    <span>${eq.available} available · ${eq.cost} · ${eq.booking} booking</span>
                                </div>
                            `).join('')}
                        </div>
                        <p class="booking-note">📞 Contact park office to book adaptive equipment</p>
                    `}
                </div>

                <div class="accessibility-section">
                    <h3>🏕️ Accessible Campsites</h3>
                    ${data.accessibleCampsites.length === 0 ? '<p>No designated accessible campsites.</p>' : `
                        <div class="campsites-list">
                            ${data.accessibleCampsites.map(site => `
                                <div class="campsite-item">
                                    <strong>Site ${site.number}</strong>
                                    <ul>${site.features.map(f => `<li>${f}</li>`).join('')}</ul>
                                </div>
                            `).join('')}
                        </div>
                    `}
                </div>

                <div class="accessibility-section">
                    <h3>🐕 Service Animals</h3>
                    <p>${data.serviceDogPolicy}</p>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }
}

const accessibilityGuideManager = new AccessibilityGuideManager();
