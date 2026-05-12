// Park Comparison Tool
// Side-by-side park comparison, scoring, and decision helper

class ParkComparisonTool {
    constructor() {
        this.comparisonList = JSON.parse(localStorage.getItem('comparison-list') || '[]');
        this.parkDatabase = this.loadParkDatabase();
        this.maxComparisons = 3;
    }

    loadParkDatabase() {
        return {
            'algonquin-park': {
                name: 'Algonquin Provincial Park',
                region: 'Central Ontario',
                size: 7653,
                established: 1893,
                distanceFromToronto: 260,
                rating: 4.8,
                reviewCount: 4521,
                pricePerNight: 42,
                difficulty: 'moderate',
                bestSeason: ['summer', 'fall'],
                scores: { scenery: 5, wildlife: 5, hiking: 4, camping: 4, swimming: 3, families: 3, accessibility: 3, value: 4 },
                highlights: ['Backcountry camping', 'Canoe routes', 'Wolf howling', 'Fall colours'],
                drawbacks: ['Very crowded in summer', 'Expensive in peak season', 'Distance from Toronto'],
                facilities: { restaurant: true, wifi: true, showers: true, playground: false, beach: false },
                campsites: { total: 1300, electrical: 140, accessible: 8 }
            },
            'pinery-park': {
                name: 'Pinery Provincial Park',
                region: 'Southwestern Ontario',
                size: 2532,
                established: 1957,
                distanceFromToronto: 220,
                rating: 4.7,
                reviewCount: 3218,
                pricePerNight: 38,
                difficulty: 'easy',
                bestSeason: ['summer'],
                scores: { scenery: 4, wildlife: 3, hiking: 3, camping: 5, swimming: 5, families: 5, accessibility: 5, value: 4 },
                highlights: ['Beautiful beach', 'Family-friendly', 'Accessible facilities', 'Lake Huron sunsets'],
                drawbacks: ['Gets very busy', 'Limited backcountry', 'Fewer wildlife sightings'],
                facilities: { restaurant: false, wifi: false, showers: true, playground: true, beach: true },
                campsites: { total: 1060, electrical: 320, accessible: 12 }
            },
            'killarney-park': {
                name: 'Killarney Provincial Park',
                region: 'Northern Ontario',
                size: 4869,
                established: 1964,
                distanceFromToronto: 370,
                rating: 4.9,
                reviewCount: 2876,
                pricePerNight: 44,
                difficulty: 'hard',
                bestSeason: ['summer', 'fall'],
                scores: { scenery: 5, wildlife: 4, hiking: 5, camping: 4, swimming: 3, families: 2, accessibility: 1, value: 3 },
                highlights: ['Pristine scenery', 'Georgian Bay views', 'World-class hiking', 'Solitude'],
                drawbacks: ['Very rugged', 'Not family-friendly', 'Minimal accessibility', 'Far from Toronto'],
                facilities: { restaurant: false, wifi: false, showers: false, playground: false, beach: false },
                campsites: { total: 128, electrical: 0, accessible: 0 }
            },
            'sandbanks-park': {
                name: 'Sandbanks Provincial Park',
                region: 'Eastern Ontario',
                size: 1551,
                established: 1970,
                distanceFromToronto: 220,
                rating: 4.6,
                reviewCount: 3890,
                pricePerNight: 45,
                difficulty: 'easy',
                bestSeason: ['summer'],
                scores: { scenery: 5, wildlife: 2, hiking: 2, camping: 4, swimming: 5, families: 5, accessibility: 4, value: 3 },
                highlights: ['World\'s largest freshwater dunes', 'Stunning beaches', 'Shallow safe swimming', 'Close to wineries'],
                drawbacks: ['Very expensive in summer', 'Hard to get reservations', 'Limited hiking'],
                facilities: { restaurant: false, wifi: false, showers: true, playground: false, beach: true },
                campsites: { total: 524, electrical: 136, accessible: 6 }
            },
            'bon-echo-park': {
                name: 'Bon Echo Provincial Park',
                region: 'Eastern Ontario',
                size: 6765,
                established: 1959,
                distanceFromToronto: 220,
                rating: 4.7,
                reviewCount: 2341,
                pricePerNight: 40,
                difficulty: 'moderate',
                bestSeason: ['summer', 'fall'],
                scores: { scenery: 5, wildlife: 4, hiking: 4, camping: 4, swimming: 4, families: 4, accessibility: 3, value: 4 },
                highlights: ['Mazinaw Rock cliff', 'Indigenous pictographs', 'Crystal clear lake', 'Cliff jumping'],
                drawbacks: ['Boat required for some areas', 'Can be buggy', 'Limited cell service'],
                facilities: { restaurant: false, wifi: false, showers: true, playground: true, beach: true },
                campsites: { total: 530, electrical: 152, accessible: 4 }
            },
            'point-pelee-park': {
                name: 'Point Pelee Provincial Park',
                region: 'Southwestern Ontario',
                size: 15,
                established: 1918,
                distanceFromToronto: 370,
                rating: 4.5,
                reviewCount: 1876,
                pricePerNight: 0,
                difficulty: 'easy',
                bestSeason: ['spring', 'fall'],
                scores: { scenery: 4, wildlife: 5, hiking: 3, camping: 1, swimming: 3, families: 4, accessibility: 5, value: 5 },
                highlights: ['Bird migration hotspot', 'Southernmost point in Canada', 'Monarch butterfly migration', 'Wetlands boardwalk'],
                drawbacks: ['No overnight camping', 'Very small park', 'Crowds during migration'],
                facilities: { restaurant: false, wifi: false, showers: false, playground: false, beach: true },
                campsites: { total: 0, electrical: 0, accessible: 0 }
            }
        };
    }

    // Add to comparison
    addToComparison(parkId) {
        if (this.comparisonList.includes(parkId)) {
            return { success: false, error: 'Park already in comparison' };
        }

        if (this.comparisonList.length >= this.maxComparisons) {
            return { success: false, error: `Maximum ${this.maxComparisons} parks can be compared at once` };
        }

        this.comparisonList.push(parkId);
        localStorage.setItem('comparison-list', JSON.stringify(this.comparisonList));

        if (window.gaManager) {
            window.gaManager.trackEvent('park_added_to_comparison', { park_id: parkId });
        }

        return { success: true, count: this.comparisonList.length };
    }

    // Remove from comparison
    removeFromComparison(parkId) {
        this.comparisonList = this.comparisonList.filter(id => id !== parkId);
        localStorage.setItem('comparison-list', JSON.stringify(this.comparisonList));
    }

    // Clear comparison
    clearComparison() {
        this.comparisonList = [];
        localStorage.setItem('comparison-list', JSON.stringify(this.comparisonList));
    }

    // Is park in comparison
    isInComparison(parkId) {
        return this.comparisonList.includes(parkId);
    }

    // Get best park for criteria
    getBestParkFor(criteria) {
        const parks = Object.values(this.parkDatabase);

        const criteriaMap = {
            families: p => p.scores.families + p.scores.accessibility + p.scores.swimming,
            hiking: p => p.scores.hiking + p.scores.scenery,
            wildlife: p => p.scores.wildlife,
            accessibility: p => p.scores.accessibility,
            budget: p => p.scores.value + (p.pricePerNight === 0 ? 3 : 5 - Math.floor(p.pricePerNight / 10)),
            beginner: p => (6 - ['easy', 'moderate', 'hard'].indexOf(p.difficulty) * 2) + p.scores.accessibility,
            photography: p => p.scores.scenery + p.scores.wildlife
        };

        const scorer = criteriaMap[criteria];
        if (!scorer) return null;

        return parks.sort((a, b) => scorer(b) - scorer(a))[0];
    }

    // Generate comparison report
    generateReport(parkIds) {
        const parks = parkIds.map(id => this.parkDatabase[id]).filter(Boolean);
        if (parks.length < 2) return null;

        const categories = ['scenery', 'wildlife', 'hiking', 'camping', 'swimming', 'families', 'accessibility', 'value'];

        const winners = {};
        categories.forEach(cat => {
            const best = parks.reduce((a, b) => a.scores[cat] > b.scores[cat] ? a : b);
            winners[cat] = best.name;
        });

        return {
            parks,
            winners,
            overallBest: parks.reduce((a, b) => {
                const aTotal = Object.values(a.scores).reduce((s, v) => s + v, 0);
                const bTotal = Object.values(b.scores).reduce((s, v) => s + v, 0);
                return aTotal > bTotal ? a : b;
            }).name,
            bestValue: parks.reduce((a, b) => a.pricePerNight < b.pricePerNight ? a : b).name,
            closestToToronto: parks.reduce((a, b) => a.distanceFromToronto < b.distanceFromToronto ? a : b).name
        };
    }

    // Render comparison table
    renderComparisonTable(parkIds = null, containerId = 'comparison-table') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const ids = parkIds || this.comparisonList;
        const parks = ids.map(id => this.parkDatabase[id]).filter(Boolean);

        if (parks.length < 2) {
            container.innerHTML = '<p class="no-results">Add at least 2 parks to compare.</p>';
            return;
        }

        const report = this.generateReport(ids);
        const categories = ['scenery', 'wildlife', 'hiking', 'camping', 'swimming', 'families', 'accessibility', 'value'];

        let html = `<div class="comparison-table-wrapper"><table class="comparison-table">
            <thead><tr>
                <th>Feature</th>
                ${parks.map(p => `<th>${p.name}</th>`).join('')}
            </tr></thead>
            <tbody>
                <tr class="highlight-row">
                    <td>⭐ Rating</td>
                    ${parks.map(p => `<td>${p.rating} (${p.reviewCount.toLocaleString()} reviews)</td>`).join('')}
                </tr>
                <tr>
                    <td>💰 Price/night</td>
                    ${parks.map(p => `<td>${p.pricePerNight === 0 ? 'Free' : '$' + p.pricePerNight}</td>`).join('')}
                </tr>
                <tr>
                    <td>🚗 From Toronto</td>
                    ${parks.map(p => `<td>${p.distanceFromToronto} km</td>`).join('')}
                </tr>
                <tr>
                    <td>📏 Difficulty</td>
                    ${parks.map(p => `<td class="difficulty-${p.difficulty}">${p.difficulty}</td>`).join('')}
                </tr>
                <tr>
                    <td>🏕️ Campsites</td>
                    ${parks.map(p => `<td>${p.campsites.total} total · ${p.campsites.electrical} electric</td>`).join('')}
                </tr>
        `;

        categories.forEach(cat => {
            const maxScore = Math.max(...parks.map(p => p.scores[cat]));
            html += `<tr>
                <td>${cat.charAt(0).toUpperCase() + cat.slice(1)}</td>
                ${parks.map(p => `
                    <td class="${p.scores[cat] === maxScore ? 'best-score' : ''}">
                        ${'★'.repeat(p.scores[cat])}${'☆'.repeat(5 - p.scores[cat])}
                    </td>
                `).join('')}
            </tr>`;
        });

        html += `</tbody></table></div>
            <div class="comparison-verdict">
                <h3>Verdict</h3>
                <p>🏆 Overall Best: <strong>${report.overallBest}</strong></p>
                <p>💰 Best Value: <strong>${report.bestValue}</strong></p>
                <p>🚗 Closest Drive: <strong>${report.closestToToronto}</strong></p>
            </div>
        `;

        container.innerHTML = html;
    }
}

const parkComparisonTool = new ParkComparisonTool();
