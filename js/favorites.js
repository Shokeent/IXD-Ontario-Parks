// Favorites Manager
// Bookmark parks, trails, and user preferences

class FavoritesManager {
    constructor() {
        this.favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        this.collections = JSON.parse(localStorage.getItem('favorite-collections') || '[]');
        this.initializeDefaultCollections();
    }

    // Initialize default collections
    initializeDefaultCollections() {
        if (this.collections.length === 0) {
            this.createCollection('My Favorites', 'Parks you love');
            this.createCollection('Want to Visit', 'Parks on your bucket list');
            this.createCollection('Visited Parks', 'Parks you\'ve been to');
        }
    }

    // Create a new collection
    createCollection(name, description = '') {
        const collection = {
            id: 'collection_' + Date.now(),
            name,
            description,
            items: [],
            createdAt: new Date().toISOString(),
            color: this.getRandomColor()
        };

        this.collections.push(collection);
        this.saveCollections();

        if (window.gaManager) {
            window.gaManager.trackEvent('collection_created', {
                collection_name: name
            });
        }

        return collection;
    }

    // Add favorite
    addFavorite(itemId, itemType, itemData = {}) {
        const favorite = {
            id: itemId,
            type: itemType,
            addedAt: new Date().toISOString(),
            data: itemData,
            collectionIds: ['collection_0'] // Default to first collection
        };

        // Check if already favorited
        if (this.isFavorited(itemId)) {
            return { success: false, error: 'Already in favorites' };
        }

        this.favorites.push(favorite);
        this.saveFavorites();

        if (window.gaManager) {
            window.gaManager.trackEvent('item_favorited', {
                item_id: itemId,
                item_type: itemType
            });
        }

        return { success: true, favorite };
    }

    // Remove favorite
    removeFavorite(itemId) {
        const index = this.favorites.findIndex(f => f.id === itemId);

        if (index === -1) {
            return { success: false, error: 'Favorite not found' };
        }

        this.favorites.splice(index, 1);
        this.saveFavorites();

        if (window.gaManager) {
            window.gaManager.trackEvent('item_unfavorited', {
                item_id: itemId
            });
        }

        return { success: true };
    }

    // Check if item is favorited
    isFavorited(itemId) {
        return this.favorites.some(f => f.id === itemId);
    }

    // Get all favorites
    getAllFavorites() {
        return this.favorites;
    }

    // Get favorites by type
    getFavoritesByType(type) {
        return this.favorites.filter(f => f.type === type);
    }

    // Get favorites count
    getFavoritesCount() {
        return this.favorites.length;
    }

    // Get parks favorites count
    getParkFavoritesCount() {
        return this.getFavoritesByType('park').length;
    }

    // Get trails favorites count
    getTrailFavoritesCount() {
        return this.getFavoritesByType('trail').length;
    }

    // Add favorite to collection
    addToCollection(itemId, collectionId) {
        const favorite = this.favorites.find(f => f.id === itemId);

        if (!favorite) {
            return { success: false, error: 'Favorite not found' };
        }

        const collection = this.collections.find(c => c.id === collectionId);

        if (!collection) {
            return { success: false, error: 'Collection not found' };
        }

        if (!favorite.collectionIds.includes(collectionId)) {
            favorite.collectionIds.push(collectionId);
            collection.items.push(itemId);
            this.saveFavorites();
            this.saveCollections();
        }

        return { success: true };
    }

    // Remove favorite from collection
    removeFromCollection(itemId, collectionId) {
        const favorite = this.favorites.find(f => f.id === itemId);

        if (!favorite) {
            return { success: false, error: 'Favorite not found' };
        }

        const collectionIndex = this.collections.findIndex(c => c.id === collectionId);

        if (collectionIndex === -1) {
            return { success: false, error: 'Collection not found' };
        }

        favorite.collectionIds = favorite.collectionIds.filter(id => id !== collectionId);
        this.collections[collectionIndex].items = this.collections[collectionIndex].items.filter(id => id !== itemId);

        this.saveFavorites();
        this.saveCollections();

        return { success: true };
    }

    // Get collection items
    getCollectionItems(collectionId) {
        const collection = this.collections.find(c => c.id === collectionId);

        if (!collection) {
            return [];
        }

        return collection.items.map(itemId => {
            return this.favorites.find(f => f.id === itemId);
        }).filter(Boolean);
    }

    // Get all collections
    getAllCollections() {
        return this.collections;
    }

    // Get collection by ID
    getCollectionById(collectionId) {
        return this.collections.find(c => c.id === collectionId);
    }

    // Delete collection
    deleteCollection(collectionId) {
        const index = this.collections.findIndex(c => c.id === collectionId);

        if (index === -1) {
            return { success: false, error: 'Collection not found' };
        }

        this.collections.splice(index, 1);
        this.saveFavorites();
        this.saveCollections();

        return { success: true };
    }

    // Update collection
    updateCollection(collectionId, updates) {
        const collection = this.collections.find(c => c.id === collectionId);

        if (!collection) {
            return { success: false, error: 'Collection not found' };
        }

        Object.assign(collection, updates);
        this.saveCollections();

        return { success: true };
    }

    // Export favorites
    exportFavorites(format = 'json') {
        if (format === 'json') {
            return JSON.stringify({
                favorites: this.favorites,
                collections: this.collections,
                exportDate: new Date().toISOString()
            }, null, 2);
        }

        if (format === 'csv') {
            let csv = 'Item ID,Type,Added At,Collection\n';

            this.favorites.forEach(fav => {
                const collections = fav.collectionIds.map(id => {
                    const col = this.collections.find(c => c.id === id);
                    return col ? col.name : id;
                }).join(';');

                csv += `${fav.id},${fav.type},${fav.addedAt},"${collections}"\n`;
            });

            return csv;
        }

        return null;
    }

    // Import favorites
    importFavorites(data) {
        try {
            const parsed = JSON.parse(data);

            if (parsed.favorites && Array.isArray(parsed.favorites)) {
                this.favorites = parsed.favorites;
                this.saveFavorites();
            }

            if (parsed.collections && Array.isArray(parsed.collections)) {
                this.collections = parsed.collections;
                this.saveCollections();
            }

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Save favorites to localStorage
    saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
    }

    // Save collections to localStorage
    saveCollections() {
        localStorage.setItem('favorite-collections', JSON.stringify(this.collections));
    }

    // Get favorite stats
    getFavoriteStats() {
        return {
            totalFavorites: this.favorites.length,
            parks: this.getFavoritesByType('park').length,
            trails: this.getFavoritesByType('trail').length,
            collections: this.collections.length,
            newestFavorite: this.favorites[this.favorites.length - 1]?.addedAt || null,
            oldestFavorite: this.favorites[0]?.addedAt || null
        };
    }

    // Render favorites list
    renderFavorites(containerId = 'favorites-list', type = null) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let favorites = type ? this.getFavoritesByType(type) : this.favorites;

        if (favorites.length === 0) {
            container.innerHTML = '<p class="no-results">No favorites yet. Start bookmarking!</p>';
            return;
        }

        let html = '<div class="favorites-list">';

        favorites.forEach(fav => {
            const addedDate = new Date(fav.addedAt).toLocaleDateString();

            html += `
                <div class="favorite-item" data-item-id="${fav.id}">
                    <div class="favorite-info">
                        <h3>${fav.data.name || fav.id}</h3>
                        <p class="favorite-type">${fav.type}</p>
                        <span class="favorite-date">Added: ${addedDate}</span>
                    </div>
                    <div class="favorite-actions">
                        <button class="btn-icon" onclick="favoritesManager.removeFavorite('${fav.id}'); location.reload();" title="Remove from favorites">
                            ✕
                        </button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    // Render collections
    renderCollections(containerId = 'collections-list') {
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = '<div class="collections-list">';

        this.collections.forEach(collection => {
            html += `
                <div class="collection-card" style="border-left: 4px solid ${collection.color}">
                    <div class="collection-header">
                        <h3>${collection.name}</h3>
                        <span class="collection-count">${collection.items.length} items</span>
                    </div>
                    <p class="collection-description">${collection.description}</p>
                    <div class="collection-actions">
                        <button class="btn-link" onclick="favoritesManager.viewCollection('${collection.id}')">
                            View
                        </button>
                        <button class="btn-link" onclick="favoritesManager.editCollection('${collection.id}')">
                            Edit
                        </button>
                        <button class="btn-link" onclick="favoritesManager.deleteCollection('${collection.id}'); location.reload();">
                            Delete
                        </button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    viewCollection(collectionId) {
        const collection = this.collections.find(c => c.id === collectionId);
        if (!collection) return;
        alert(`Collection: ${collection.name}\nItems: ${collection.items.join(', ') || 'No parks added yet'}`);
    }

    editCollection(collectionId) {
        const collection = this.collections.find(c => c.id === collectionId);
        if (!collection) return;
        const newName = prompt('Collection name:', collection.name);
        if (newName && newName.trim()) {
            collection.name = newName.trim();
            this.saveCollections();
            this.renderCollections();
        }
    }

    // Get random color for collection
    getRandomColor() {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Get favorite recommendations
    getRecommendations(limit = 5) {
        const stats = this.getFavoriteStats();

        // If user has favorites, recommend related items
        if (this.favorites.length === 0) {
            return [];
        }

        // Simple recommendation: show most recently favorited
        return this.favorites.slice(-limit).reverse();
    }

    // Track favorite interactions
    trackFavoriteInteraction(itemId, action) {
        if (window.gaManager) {
            window.gaManager.trackEvent('favorite_interaction', {
                item_id: itemId,
                action: action
            });
        }
    }
}

const favoritesManager = new FavoritesManager();
