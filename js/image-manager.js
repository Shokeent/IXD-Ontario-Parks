// Image Optimization and Loading Utilities

class ImageManager {
    constructor() {
        this.loadedImages = new Set();
        this.failedImages = new Set();
        this.loadingImages = new Map();
        
        // Detect WebP support
        this.supportsWebP = this.detectWebPSupport();
        
        // Preload critical images
        this.preloadCriticalImages();
    }

    // Detect WebP support
    detectWebPSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    // Preload critical images for better UX
    async preloadCriticalImages() {
        const criticalImages = [
            window.HERO_IMAGES?.homepage,
            ...(window.FALLBACK_IMAGES || []).slice(0, 3)
        ].filter(Boolean);

        const preloadPromises = criticalImages.map(src => this.preloadImage(src));
        await Promise.allSettled(preloadPromises);
    }

    // Preload a single image
    preloadImage(src) {
        return new Promise((resolve, reject) => {
            if (this.loadedImages.has(src)) {
                resolve(src);
                return;
            }

            if (this.failedImages.has(src)) {
                reject(new Error(`Image previously failed: ${src}`));
                return;
            }

            if (this.loadingImages.has(src)) {
                // Return existing promise
                return this.loadingImages.get(src);
            }

            const img = new Image();
            const promise = new Promise((res, rej) => {
                img.onload = () => {
                    this.loadedImages.add(src);
                    this.loadingImages.delete(src);
                    res(src);
                };

                img.onerror = () => {
                    this.failedImages.add(src);
                    this.loadingImages.delete(src);
                    rej(new Error(`Failed to load image: ${src}`));
                };
            });

            this.loadingImages.set(src, promise);
            img.src = src;

            return promise;
        });
    }

    // Load image with fallbacks and error handling
    async loadImageWithFallback(src, fallbacks = []) {
        const sources = [src, ...fallbacks].filter(Boolean);
        
        for (const source of sources) {
            try {
                await this.preloadImage(source);
                return source;
            } catch (error) {
                console.warn(`Failed to load image: ${source}`);
                continue;
            }
        }
        
        throw new Error('All image sources failed to load');
    }

    // Create optimized image element
    createImageElement(src, alt, options = {}) {
        const img = document.createElement('img');
        
        // Set basic attributes
        img.alt = alt || '';
        img.loading = options.lazy !== false ? 'lazy' : 'eager';
        
        // Add responsive classes
        if (options.responsive !== false) {
            img.style.width = '100%';
            img.style.height = 'auto';
        }
        
        // Add loading state
        img.classList.add('image-loading');
        
        // Load image with error handling
        this.loadImageWithFallback(src, options.fallbacks)
            .then(finalSrc => {
                img.src = finalSrc;
                img.classList.remove('image-loading');
                img.classList.add('lazy-loaded');
            })
            .catch(error => {
                console.error('Image loading failed:', error);
                img.classList.remove('image-loading');
                img.classList.add('image-error');
                img.textContent = 'Image unavailable';
            });
        
        return img;
    }

    // Update existing image element with new source
    updateImageElement(img, src, options = {}) {
        if (!img) return;
        
        // Add loading state
        img.classList.add('image-loading');
        img.classList.remove('image-error', 'lazy-loaded');
        
        this.loadImageWithFallback(src, options.fallbacks)
            .then(finalSrc => {
                img.src = finalSrc;
                img.classList.remove('image-loading');
                img.classList.add('lazy-loaded');
            })
            .catch(error => {
                console.error('Image loading failed:', error);
                img.classList.remove('image-loading');
                img.classList.add('image-error');
                img.style.backgroundColor = '#f3f4f6';
            });
    }

    // Get optimized image URL (with size parameters)
    getOptimizedImageUrl(src, width, height, quality = 80) {
        if (!src) return null;
        
        // If it's an Unsplash URL, add optimization parameters
        if (src.includes('unsplash.com')) {
            const url = new URL(src);
            url.searchParams.set('w', width.toString());
            if (height) url.searchParams.set('h', height.toString());
            url.searchParams.set('q', quality.toString());
            url.searchParams.set('fit', 'crop');
            url.searchParams.set('crop', 'center');
            return url.toString();
        }
        
        return src;
    }

    // Create responsive image with multiple sizes
    createResponsiveImage(baseSrc, alt, sizes = []) {
        const img = document.createElement('img');
        img.alt = alt || '';
        
        if (sizes.length > 0 && baseSrc.includes('unsplash.com')) {
            // Create srcset for responsive images
            const srcset = sizes.map(size => {
                const optimizedSrc = this.getOptimizedImageUrl(baseSrc, size.width, size.height);
                return `${optimizedSrc} ${size.width}w`;
            }).join(', ');
            
            img.srcset = srcset;
            img.sizes = sizes.map(size => `(max-width: ${size.breakpoint}px) ${size.width}px`).join(', ');
        }
        
        // Set default src to largest size or original
        const defaultSrc = sizes.length > 0 
            ? this.getOptimizedImageUrl(baseSrc, sizes[sizes.length - 1].width, sizes[sizes.length - 1].height)
            : baseSrc;
            
        this.updateImageElement(img, defaultSrc);
        
        return img;
    }

    // Lazy load images when they come into viewport
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.src;
                        
                        if (src) {
                            this.updateImageElement(img, src);
                            img.removeAttribute('data-src');
                            observer.unobserve(img);
                        }
                    }
                });
            });

            // Observe all images with data-src attribute
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // Get park image with fallbacks
    getParkImageWithFallbacks(parkName) {
        const primary = window.PARK_IMAGES?.[parkName]?.main;
        const fallbacks = window.FALLBACK_IMAGES || [];
        
        return {
            primary,
            fallbacks: primary ? fallbacks : fallbacks.slice(1)
        };
    }
}

// Create global instance
window.imageManager = new ImageManager();

// Initialize lazy loading when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.imageManager.setupLazyLoading();
    });
} else {
    window.imageManager.setupLazyLoading();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageManager;
}
