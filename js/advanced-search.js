// Advanced Search & Discovery System
// Intelligent search, saved searches, recommendations, and discovery

class AdvancedSearchManager {
    constructor() {
        this.searches = JSON.parse(localStorage.getItem('search-history') || '[]');
        this.savedSearches = JSON.parse(localStorage.getItem('saved-searches') || '[]');
        this.searchIndex = this.buildSearchIndex();
    }

    // Build search index for fast lookups
    buildSearchIndex() {
        // In production, would build from actual park data
        return {
            parks: this.mockParks(),
            trails: this.mockTrails(),
            keywords: this.buildKeywordIndex()
        };
    }

    // Mock parks data
    mockParks() {
        return [
            { id: 'algonquin-park', name: 'Algonquin Provincial Park', keywords: ['algonquin', 'lakes', 'hiking', 'camping', 'canoe'] },
            { id: 'killarney-park', name: 'Killarney Provincial Park', keywords: ['killarney', 'mountain', 'rocky', 'hiking'] },
            { id: 'bon-echo-park', name: 'Bon Echo Provincial Park', keywords: ['bon echo', 'cliff', 'lake', 'hiking'] },
            { id: 'pinery-park', name: 'Pinery Provincial Park', keywords: ['pinery', 'beach', 'lake michigan', 'dunes'] }
        ];
    }

    // Mock trails data
    mockTrails() {
        return [
            { id: 'algo-1', name: 'Lake of Two Rivers', parkId: 'algonquin-park', difficulty: 'easy', distance: 2.0 },
            { id: 'algo-2', name: 'Barron Canyon Trail', parkId: 'algonquin-park', difficulty: 'moderate', distance: 10.5 },
            { id: 'kill-1', name: 'The Crack Trail', parkId: 'killarney-park', difficulty: 'moderate', distance: 3.2 }
        ];
    }

    // Build keyword index
    buildKeywordIndex() {
        const index = {};

        this.mockParks().forEach(park => {
            park.keywords.forEach(keyword => {
                if (!index[keyword]) {
                    index[keyword] = [];
                }
                index[keyword].push(park.id);
            });
        });

        return index;
    }

    // Perform intelligent search
    search(query, options = {}) {
        const {
            type = 'all', // 'parks', 'trails', 'all'
            limit = 10,
            filters = {}
        } = options;

        if (!query || query.length < 2) {
            return [];
        }

        // Log search
        this.logSearch(query);

        // Tokenize query
        const tokens = this.tokenizeQuery(query);

        // Search by tokens
        let results = this.searchByTokens(tokens, type);

        // Apply filters
        if (Object.keys(filters).length > 0) {
            results = this.applyFilters(results, filters);
        }

        // Rank results by relevance
        results = this.rankResults(results, tokens);

        // Limit results
        return results.slice(0, limit);
    }

    // Tokenize search query
    tokenizeQuery(query) {
        return query
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(token => token.length > 0);
    }

    // Search by tokens
    searchByTokens(tokens, type) {
        const results = new Map();

        tokens.forEach(token => {
            const parkIds = this.searchIndex.keywords[token] || [];

            parkIds.forEach(parkId => {
                const park = this.searchIndex.parks.find(p => p.id === parkId);
                if (park) {
                    results.set(parkId, {
                        ...park,
                        type: 'park',
                        matchCount: (results.get(parkId)?.matchCount || 0) + 1
                    });
                }
            });

            // Search trail names
            this.searchIndex.trails.forEach(trail => {
                if (trail.name.toLowerCase().includes(token)) {
                    results.set(trail.id, {
                        ...trail,
                        type: 'trail',
                        matchCount: (results.get(trail.id)?.matchCount || 0) + 1
                    });
                }
            });
        });

        return Array.from(results.values());
    }

    // Apply filters
    applyFilters(results, filters) {
        return results.filter(result => {
            if (filters.difficulty && result.difficulty && result.difficulty !== filters.difficulty) {
                return false;
            }

            if (filters.maxDistance && result.distance && result.distance > filters.maxDistance) {
                return false;
            }

            if (filters.type && result.type !== filters.type) {
                return false;
            }

            return true;
        });
    }

    // Rank results by relevance
    rankResults(results, tokens) {
        return results.sort((a, b) => {
            // Exact matches rank higher
            const aExactMatch = tokens.some(token => a.name.toLowerCase() === token) ? 1 : 0;
            const bExactMatch = tokens.some(token => b.name.toLowerCase() === token) ? 1 : 0;

            if (aExactMatch !== bExactMatch) {
                return bExactMatch - aExactMatch;
            }

            // More tokens matched rank higher
            return b.matchCount - a.matchCount;
        });
    }

    // Log search
    logSearch(query) {
        const search = {
            id: 'search_' + Date.now(),
            query,
            timestamp: new Date().toISOString()
        };

        this.searches.push(search);

        // Keep only last 100 searches
        if (this.searches.length > 100) {
            this.searches = this.searches.slice(-100);
        }

        localStorage.setItem('search-history', JSON.stringify(this.searches));

        if (window.gaManager) {
            window.gaManager.trackEvent('search_performed', {
                query: query,
                timestamp: search.timestamp
            });
        }
    }

    // Get search suggestions
    getSuggestions(query) {
        if (!query || query.length < 2) {
            return [];
        }

        const suggestions = new Set();

        // Suggest parks
        this.searchIndex.parks.forEach(park => {
            if (park.name.toLowerCase().includes(query.toLowerCase())) {
                suggestions.add(park.name);
            }

            park.keywords.forEach(keyword => {
                if (keyword.includes(query.toLowerCase())) {
                    suggestions.add(keyword);
                }
            });
        });

        // Suggest trails
        this.searchIndex.trails.forEach(trail => {
            if (trail.name.toLowerCase().includes(query.toLowerCase())) {
                suggestions.add(trail.name);
            }
        });

        return Array.from(suggestions).slice(0, 5);
    }

    // Save search
    saveSearch(query, filters = {}) {
        const search = {
            id: 'saved_search_' + Date.now(),
            query,
            filters,
            createdAt: new Date().toISOString(),
            resultCount: 0
        };

        this.savedSearches.push(search);
        localStorage.setItem('saved-searches', JSON.stringify(this.savedSearches));

        if (window.gaManager) {
            window.gaManager.trackEvent('search_saved', {
                query: query
            });
        }

        return search;
    }

    // Get saved searches
    getSavedSearches() {
        return this.savedSearches;
    }

    // Delete saved search
    deleteSavedSearch(searchId) {
        this.savedSearches = this.savedSearches.filter(s => s.id !== searchId);
        localStorage.setItem('saved-searches', JSON.stringify(this.savedSearches));
    }

    // Get search history
    getSearchHistory(limit = 10) {
        return this.searches.slice(-limit).reverse();
    }

    // Get popular searches
    getPopularSearches() {
        const counts = {};

        this.searches.forEach(search => {
            counts[search.query] = (counts[search.query] || 0) + 1;
        });

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([query, count]) => ({ query, count }));
    }

    // Get trending searches
    getTrendingSearches(hours = 24) {
        const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
        const recentSearches = this.searches.filter(s => {
            return new Date(s.timestamp).getTime() > cutoffTime;
        });

        const counts = {};

        recentSearches.forEach(search => {
            counts[search.query] = (counts[search.query] || 0) + 1;
        });

        return Object.entries(counts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([query, count]) => ({ query, count }));
    }

    // Search filters for UI
    getSearchFilters() {
        return {
            difficulty: ['easy', 'moderate', 'hard'],
            maxDistance: [1, 3, 5, 10, 20, 50],
            type: ['parks', 'trails'],
            features: ['camping', 'hiking', 'fishing', 'swimming', 'picnic']
        };
    }

    // Render search interface
    renderSearchInterface(containerId = 'search-interface') {
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = `
            <div class="search-interface">
                <div class="search-input-group">
                    <input
                        type="text"
                        id="search-input"
                        placeholder="Search parks, trails, or activities..."
                        class="search-input"
                        autocomplete="off"
                        onkeyup="advancedSearchManager.handleSearchInput(this.value)"
                    >
                    <div id="search-suggestions" class="search-suggestions"></div>
                </div>

                <div class="search-filters">
                    <select onchange="advancedSearchManager.updateFilter('difficulty', this.value)">
                        <option value="">Any Difficulty</option>
                        <option value="easy">Easy</option>
                        <option value="moderate">Moderate</option>
                        <option value="hard">Hard</option>
                    </select>

                    <select onchange="advancedSearchManager.updateFilter('maxDistance', this.value)">
                        <option value="">Any Distance</option>
                        <option value="5">Up to 5 km</option>
                        <option value="10">Up to 10 km</option>
                        <option value="20">Up to 20 km</option>
                    </select>
                </div>

                <div class="search-history">
                    <h4>Recent Searches</h4>
                    <div class="history-list">
                        ${this.getSearchHistory(5).map(search => `
                            <button class="history-item" onclick="advancedSearchManager.performSavedSearch('${search.query}')">
                                ${search.query}
                            </button>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    // Handle search input
    handleSearchInput(query) {
        if (query.length < 2) {
            document.getElementById('search-suggestions').innerHTML = '';
            return;
        }

        const suggestions = this.getSuggestions(query);
        const container = document.getElementById('search-suggestions');

        let html = '<div class="suggestions-list">';

        suggestions.forEach(suggestion => {
            html += `
                <div class="suggestion-item" onclick="advancedSearchManager.performSavedSearch('${suggestion}')">
                    ${suggestion}
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    // Perform saved search
    performSavedSearch(query) {
        const results = this.search(query);
        this.renderSearchResults(results);
    }

    // Render search results
    renderSearchResults(results, containerId = 'search-results') {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (results.length === 0) {
            container.innerHTML = '<p class="no-results">No results found</p>';
            return;
        }

        let html = '<div class="search-results">';

        results.forEach(result => {
            if (result.type === 'park') {
                html += `
                    <div class="result-item park-result">
                        <h3>${result.name}</h3>
                        <p class="result-type">Park</p>
                        <button onclick="navigateToParkDetails('${result.id}')">View Park</button>
                    </div>
                `;
            } else if (result.type === 'trail') {
                html += `
                    <div class="result-item trail-result">
                        <h3>${result.name}</h3>
                        <p class="result-type">Trail - ${result.difficulty}</p>
                        <p>${result.distance} km</p>
                        <button onclick="viewTrailDetails('${result.id}')">View Trail</button>
                    </div>
                `;
            }
        });

        html += '</div>';
        container.innerHTML = html;
    }

    // Update filter
    updateFilter(filterName, value) {
        this.currentFilters = this.currentFilters || {};
        if (value) {
            this.currentFilters[filterName] = value;
        } else {
            delete this.currentFilters[filterName];
        }
        const input = document.getElementById('search-input');
        if (input && input.value.trim()) {
            this.search(input.value.trim());
        }
    }
}

const advancedSearchManager = new AdvancedSearchManager();
