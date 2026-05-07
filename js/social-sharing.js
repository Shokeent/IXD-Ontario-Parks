// Social Sharing Manager
// Share parks, bookings, and content on social media

class SocialSharingManager {
    constructor() {
        this.platforms = {
            'facebook': { icon: 'fab fa-facebook', name: 'Facebook' },
            'twitter': { icon: 'fab fa-twitter', name: 'Twitter' },
            'linkedin': { icon: 'fab fa-linkedin', name: 'LinkedIn' },
            'whatsapp': { icon: 'fab fa-whatsapp', name: 'WhatsApp' },
            'email': { icon: 'fas fa-envelope', name: 'Email' },
            'copy': { icon: 'fas fa-link', name: 'Copy Link' }
        };
        this.currentUrl = window.location.href;
        this.trackingEnabled = true;
    }

    // Generate share URL for platform
    generateShareUrl(platform, content) {
        const {
            title = 'Ontario Parks',
            description = 'Discover Ontario\'s beautiful parks',
            url = this.currentUrl,
            hashtags = 'ontarioparks,camping,nature',
            via = 'ontarioparks'
        } = content;

        const encodedUrl = encodeURIComponent(url);
        const encodedTitle = encodeURIComponent(title);
        const encodedDesc = encodeURIComponent(description);
        const encodedHashtags = encodeURIComponent(hashtags);

        const shareUrls = {
            'facebook': `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
            'twitter': `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${encodedHashtags}&via=${via}`,
            'linkedin': `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
            'whatsapp': `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
            'email': `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A${encodedUrl}`,
            'reddit': `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`
        };

        return shareUrls[platform] || null;
    }

    // Share to platform
    share(platform, content, windowFeatures = null) {
        const url = this.generateShareUrl(platform, content);

        if (!url) {
            console.error(`Platform ${platform} not supported`);
            return false;
        }

        // Track share
        if (this.trackingEnabled && window.gaManager) {
            window.gaManager.trackEvent('social_share', {
                platform: platform,
                content_title: content.title || 'Ontario Parks',
                content_url: content.url || this.currentUrl
            });
        }

        // Handle native sharing for mobile
        if (platform === 'copy') {
            this.copyToClipboard(content.url || this.currentUrl);
            return true;
        }

        // For email, don't open window
        if (platform === 'email') {
            window.location.href = url;
            return true;
        }

        // Open share window for social platforms
        const width = 600;
        const height = 400;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        const features = windowFeatures || `width=${width},height=${height},left=${left},top=${top},resizable=yes`;
        window.open(url, 'share-' + platform, features);

        return true;
    }

    // Use native web share API if available
    async nativeShare(content) {
        if (!navigator.share) {
            return false;
        }

        try {
            await navigator.share({
                title: content.title || 'Ontario Parks',
                text: content.description || 'Discover Ontario parks',
                url: content.url || this.currentUrl
            });

            if (this.trackingEnabled && window.gaManager) {
                window.gaManager.trackEvent('social_share', {
                    platform: 'native',
                    content_title: content.title || 'Ontario Parks'
                });
            }

            return true;
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Share failed:', error);
            }
            return false;
        }
    }

    // Check if native share is available
    canNativeShare() {
        return !!navigator.share;
    }

    // Copy URL to clipboard
    copyToClipboard(url) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('Link copied to clipboard!');

                if (this.trackingEnabled && window.gaManager) {
                    window.gaManager.trackEvent('social_share', {
                        platform: 'clipboard',
                        content_url: url
                    });
                }
            }).catch(err => {
                console.error('Failed to copy:', err);
            });
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = url;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showNotification('Link copied to clipboard!');
        }
    }

    // Show notification
    showNotification(message, duration = 3000) {
        const notification = document.createElement('div');
        notification.className = 'share-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4a9eff;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, duration);
    }

    // Share park
    sharePark(parkData) {
        return this.generateShareUrl('twitter', {
            title: `Check out ${parkData.name}!`,
            description: parkData.description || 'A beautiful Ontario park',
            url: `${window.location.origin}/park-details.html?id=${parkData.id}`,
            hashtags: 'ontarioparks,camping,nature,adventure'
        });
    }

    // Share booking
    shareBooking(bookingData) {
        const checkIn = new Date(bookingData.checkIn).toLocaleDateString();
        const checkOut = new Date(bookingData.checkOut).toLocaleDateString();

        return this.generateShareUrl('facebook', {
            title: `Booked my camping trip!`,
            description: `Going to ${bookingData.parkName} from ${checkIn} to ${checkOut}. Join me!`,
            url: `${window.location.origin}/booking.html?park=${bookingData.parkId}`,
            hashtags: 'camping,adventure,ontarioparks'
        });
    }

    // Render share buttons
    renderShareButtons(containerId, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const {
            platforms = ['facebook', 'twitter', 'whatsapp', 'email', 'copy'],
            size = 'medium',
            style = 'button'
        } = options;

        let html = `<div class="share-buttons share-buttons-${size} share-buttons-${style}">`;

        platforms.forEach(platform => {
            const platformData = this.platforms[platform];
            if (!platformData) return;

            if (style === 'button') {
                html += `
                    <button
                        class="share-btn share-btn-${platform}"
                        onclick="socialSharingManager.share('${platform}', window.currentShareContent || {})"
                        title="Share on ${platformData.name}"
                        aria-label="Share on ${platformData.name}"
                    >
                        <i class="${platformData.icon}"></i>
                        <span>${platformData.name}</span>
                    </button>
                `;
            } else {
                html += `
                    <a
                        href="#"
                        class="share-link share-link-${platform}"
                        onclick="socialSharingManager.share('${platform}', window.currentShareContent || {}); return false;"
                        title="Share on ${platformData.name}"
                        aria-label="Share on ${platformData.name}"
                    >
                        <i class="${platformData.icon}"></i>
                    </a>
                `;
            }
        });

        html += '</div>';
        container.innerHTML = html;
    }

    // Get available platforms
    getAvailablePlatforms() {
        return Object.entries(this.platforms).map(([key, data]) => ({
            id: key,
            ...data
        }));
    }

    // Track share metrics
    getShareMetrics() {
        const metrics = JSON.parse(localStorage.getItem('share-metrics') || '{}');
        return metrics;
    }

    // Update share metrics
    updateShareMetrics(platform, content) {
        const metrics = this.getShareMetrics();

        if (!metrics[platform]) {
            metrics[platform] = { count: 0, lastShared: null };
        }

        metrics[platform].count++;
        metrics[platform].lastShared = new Date().toISOString();

        localStorage.setItem('share-metrics', JSON.stringify(metrics));
    }

    // Check if platform is available
    isPlatformAvailable(platform) {
        return !!this.platforms[platform];
    }

    // Create shareable link with parameters
    createShareableLink(content) {
        const params = new URLSearchParams({
            title: content.title || 'Ontario Parks',
            description: content.description || '',
            parkId: content.parkId || '',
            bookingId: content.bookingId || '',
            utm_source: 'organic_share',
            utm_medium: 'social'
        });

        return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    }

    // Parse share parameters
    parseShareParameters() {
        const params = new URLSearchParams(window.location.search);
        return {
            title: params.get('title'),
            description: params.get('description'),
            parkId: params.get('parkId'),
            bookingId: params.get('bookingId'),
            source: params.get('utm_source'),
            medium: params.get('utm_medium')
        };
    }
}

const socialSharingManager = new SocialSharingManager();
