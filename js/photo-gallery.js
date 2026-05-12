// Photo Gallery & Upload Manager
// User photo uploads, park galleries, community photos

class PhotoGalleryManager {
    constructor() {
        this.photos = JSON.parse(localStorage.getItem('park-photos') || '[]');
        this.userPhotos = JSON.parse(localStorage.getItem('user-photos') || '[]');
        this.featuredPhotos = this.loadFeaturedPhotos();
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        this.allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    }

    loadFeaturedPhotos() {
        return {
            'algonquin-park': [
                { id: 'f1', url: '/images/parks/algonquin-1.jpg', caption: 'Lake of Two Rivers at sunrise', likes: 234, photographer: 'Park Staff' },
                { id: 'f2', url: '/images/parks/algonquin-2.jpg', caption: 'Fall colours on the Barron Canyon trail', likes: 189, photographer: 'Park Staff' },
                { id: 'f3', url: '/images/parks/algonquin-3.jpg', caption: 'Moose sighting at dusk', likes: 312, photographer: 'Visitor' }
            ],
            'killarney-park': [
                { id: 'f4', url: '/images/parks/killarney-1.jpg', caption: 'The Crack trail panorama', likes: 278, photographer: 'Park Staff' },
                { id: 'f5', url: '/images/parks/killarney-2.jpg', caption: 'Georgian Bay sunset', likes: 345, photographer: 'Visitor' }
            ],
            'pinery-park': [
                { id: 'f6', url: '/images/parks/pinery-1.jpg', caption: 'Pinery beach on a summer afternoon', likes: 156, photographer: 'Park Staff' },
                { id: 'f7', url: '/images/parks/pinery-2.jpg', caption: 'Sand dunes boardwalk', likes: 198, photographer: 'Visitor' }
            ]
        };
    }

    // Upload photo
    async uploadPhoto(file, metadata = {}) {
        if (!this.allowedTypes.includes(file.type)) {
            return { success: false, error: 'File type not allowed. Use JPEG, PNG, or WebP.' };
        }

        if (file.size > this.maxFileSize) {
            return { success: false, error: 'File too large. Max size is 10MB.' };
        }

        const photoUrl = await this.readFileAsDataURL(file);
        const compressed = await this.compressImage(photoUrl, 1200, 0.85);

        const photo = {
            id: 'photo_' + Date.now(),
            url: compressed,
            thumbnail: await this.compressImage(photoUrl, 300, 0.7),
            caption: metadata.caption || '',
            parkId: metadata.parkId || '',
            userId: metadata.userId || localStorage.getItem('user_id'),
            tags: metadata.tags || [],
            location: metadata.location || null,
            takenAt: metadata.takenAt || new Date().toISOString(),
            uploadedAt: new Date().toISOString(),
            likes: 0,
            likedBy: [],
            approved: true,
            width: 0,
            height: 0
        };

        this.userPhotos.push(photo);
        this.photos.push(photo);
        this.savePhotos();

        if (window.gaManager) {
            window.gaManager.trackEvent('photo_uploaded', {
                park_id: metadata.parkId,
                has_caption: !!metadata.caption
            });
        }

        return { success: true, photo };
    }

    // Read file as data URL
    readFileAsDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Compress image using canvas
    compressImage(dataUrl, maxWidth, quality) {
        return new Promise(resolve => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round(height * maxWidth / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.src = dataUrl;
        });
    }

    // Get park photos
    getParkPhotos(parkId, options = {}) {
        const { limit = 20, offset = 0, sortBy = 'recent' } = options;

        let photos = [
            ...(this.featuredPhotos[parkId] || []),
            ...this.photos.filter(p => p.parkId === parkId && p.approved)
        ];

        if (sortBy === 'popular') {
            photos.sort((a, b) => b.likes - a.likes);
        } else {
            photos.sort((a, b) => new Date(b.uploadedAt || b.takenAt) - new Date(a.uploadedAt || a.takenAt));
        }

        return photos.slice(offset, offset + limit);
    }

    // Like photo
    likePhoto(photoId) {
        const userId = localStorage.getItem('user_id');
        const photo = this.photos.find(p => p.id === photoId);

        if (!photo) return { success: false, error: 'Photo not found' };

        if (photo.likedBy.includes(userId)) {
            photo.likes--;
            photo.likedBy = photo.likedBy.filter(id => id !== userId);
        } else {
            photo.likes++;
            photo.likedBy.push(userId);
        }

        this.savePhotos();
        return { success: true, likes: photo.likes };
    }

    // Delete photo
    deletePhoto(photoId) {
        const userId = localStorage.getItem('user_id');
        const index = this.userPhotos.findIndex(p => p.id === photoId && p.userId === userId);

        if (index === -1) return { success: false, error: 'Photo not found or unauthorized' };

        this.userPhotos.splice(index, 1);
        this.photos = this.photos.filter(p => p.id !== photoId);
        this.savePhotos();

        return { success: true };
    }

    // Add caption
    addCaption(photoId, caption) {
        const photo = this.photos.find(p => p.id === photoId);
        if (!photo) return { success: false, error: 'Photo not found' };

        photo.caption = caption;
        this.savePhotos();
        return { success: true };
    }

    // Get user photos
    getUserPhotos(userId = null) {
        const id = userId || localStorage.getItem('user_id');
        return this.userPhotos.filter(p => p.userId === id);
    }

    // Get photo count per park
    getPhotoStats() {
        const stats = {};

        this.photos.forEach(photo => {
            if (photo.parkId) {
                stats[photo.parkId] = (stats[photo.parkId] || 0) + 1;
            }
        });

        return {
            totalPhotos: this.photos.length,
            userPhotos: this.userPhotos.length,
            byPark: stats,
            totalLikes: this.photos.reduce((sum, p) => sum + (p.likes || 0), 0)
        };
    }

    // Render gallery
    renderGallery(parkId, containerId = 'photo-gallery') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const photos = this.getParkPhotos(parkId);

        let html = `
            <div class="photo-gallery">
                <div class="gallery-header">
                    <h3>Park Photos</h3>
                    <label class="upload-btn">
                        Upload Photo
                        <input type="file" accept="image/*" style="display:none"
                               onchange="photoGalleryManager.handleUpload(event, '${parkId}')">
                    </label>
                </div>
                <div class="gallery-grid">
        `;

        photos.forEach(photo => {
            const userId = localStorage.getItem('user_id');
            const isLiked = photo.likedBy?.includes(userId);

            html += `
                <div class="gallery-item" onclick="photoGalleryManager.openLightbox('${photo.id}')">
                    <img src="${photo.thumbnail || photo.url}" alt="${photo.caption}" loading="lazy">
                    <div class="gallery-overlay">
                        <p class="photo-caption">${photo.caption}</p>
                        <div class="photo-actions">
                            <button class="like-btn ${isLiked ? 'liked' : ''}"
                                    onclick="event.stopPropagation(); photoGalleryManager.likePhoto('${photo.id}')">
                                ♥ ${photo.likes || 0}
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div></div>';
        container.innerHTML = html;
    }

    // Handle file upload from input
    handleUpload(event, parkId) {
        const file = event.target.files[0];
        if (!file) return;

        this.uploadPhoto(file, { parkId }).then(result => {
            if (result.success) {
                this.renderGallery(parkId);
                if (window.notificationManager) {
                    window.notificationManager.createNotification({
                        type: 'success',
                        title: 'Photo Uploaded',
                        message: 'Your photo has been added to the gallery!'
                    });
                }
            } else {
                alert(result.error);
            }
        });
    }

    // Open lightbox
    openLightbox(photoId) {
        const photo = this.photos.find(p => p.id === photoId) ||
                      Object.values(this.featuredPhotos).flat().find(p => p.id === photoId);

        if (!photo) return;

        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-overlay" onclick="this.parentElement.remove()"></div>
            <div class="lightbox-content">
                <button class="lightbox-close" onclick="this.closest('.lightbox').remove()">✕</button>
                <img src="${photo.url}" alt="${photo.caption}">
                <div class="lightbox-caption">
                    <p>${photo.caption}</p>
                    <span>Photo by ${photo.photographer || 'Community Member'}</span>
                </div>
            </div>
        `;
        document.body.appendChild(lightbox);
    }

    savePhotos() {
        localStorage.setItem('park-photos', JSON.stringify(this.photos));
        localStorage.setItem('user-photos', JSON.stringify(this.userPhotos));
    }
}

const photoGalleryManager = new PhotoGalleryManager();
