// Performance Optimization Module
// Lazy loading, code splitting, and asset optimization

class PerformanceOptimizer {
    constructor() {
        this.imageObserver = null;
        this.moduleCache = {};
        this.preloadedAssets = new Set();
        this.metrics = {
            pageLoadTime: 0,
            firstContentfulPaint: 0,
            largestContentfulPaint: 0,
            cumulativeLayoutShift: 0
        };

        this.initPerformanceMonitoring();
    }

    // Initialize performance monitoring
    initPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            // Monitor Core Web Vitals
            const observer = new PerformanceObserver((entryList) => {
                for (const entry of entryList.getEntries()) {
                    if (entry.name === 'largest-contentful-paint') {
                        this.metrics.largestContentfulPaint = entry.startTime;
                    }
                    if (entry.name === 'first-contentful-paint') {
                        this.metrics.firstContentfulPaint = entry.startTime;
                    }
                }
            });

            observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
        }

        // Page load time
        if (document.readyState === 'complete') {
            this.metrics.pageLoadTime = performance.now();
        } else {
            window.addEventListener('load', () => {
                this.metrics.pageLoadTime = performance.now();
            });
        }
    }

    // Lazy load images
    lazyLoadImages(selector = 'img[data-src]') {
        const images = document.querySelectorAll(selector);

        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        this.imageObserver.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            images.forEach(img => this.imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }

    // Preload critical resources
    preloadResource(href, type = 'script') {
        if (this.preloadedAssets.has(href)) return;

        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = type;

        if (type === 'font') {
            link.crossOrigin = 'anonymous';
        }

        document.head.appendChild(link);
        this.preloadedAssets.add(href);
    }

    // Prefetch resources
    prefetchResource(href) {
        if (this.preloadedAssets.has(href)) return;

        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;

        document.head.appendChild(link);
        this.preloadedAssets.add(href);
    }

    // Code splitting: Dynamically load modules
    async loadModule(modulePath) {
        if (this.moduleCache[modulePath]) {
            return this.moduleCache[modulePath];
        }

        try {
            const module = await import(modulePath);
            this.moduleCache[modulePath] = module;
            return module;
        } catch (error) {
            console.error('Failed to load module:', modulePath, error);
            throw error;
        }
    }

    // Defer non-critical JavaScript
    deferScript(src, options = {}) {
        const script = document.createElement('script');
        script.src = src;
        script.defer = true;

        if (options.async) script.async = true;
        if (options.noModule) script.noModule = true;

        const target = options.head ? document.head : document.body;
        target.appendChild(script);
    }

    // Optimize images with responsive srcset
    optimizeImage(imgElement, sizes = {}) {
        if (!sizes.small || !sizes.medium || !sizes.large) {
            console.error('Please provide small, medium, and large sizes');
            return;
        }

        imgElement.srcset = `
            ${sizes.small} 480w,
            ${sizes.medium} 800w,
            ${sizes.large} 1200w
        `;

        imgElement.sizes = `
            (max-width: 480px) 480px,
            (max-width: 1024px) 800px,
            1200px
        `;
    }

    // Compress and optimize CSS
    optimizeCriticalCSS() {
        const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
        let criticalCss = '';

        styles.forEach(style => {
            if (style.tagName === 'STYLE') {
                criticalCss += style.textContent;
            }
        });

        return criticalCss;
    }

    // Generate and inject critical CSS inline
    inlineCriticalCSS(criticalStyles) {
        const style = document.createElement('style');
        style.textContent = criticalStyles;
        document.head.insertBefore(style, document.head.firstChild);
    }

    // Minify and debounce DOM updates
    debounceUpdate(callback, delay = 250) {
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(callback, delay);
        };
    }

    // Batch DOM reads and writes
    requestAnimationFrameScheduler(task) {
        return new Promise(resolve => {
            requestAnimationFrame(() => {
                task();
                resolve();
            });
        });
    }

    // Cache busting
    getCacheBustingUrl(url) {
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}v=${new Date().getTime()}`;
    }

    // Get performance metrics
    getMetrics() {
        const navigationTiming = performance.getEntriesByType('navigation')[0];

        return {
            pageLoadTime: this.metrics.pageLoadTime,
            firstContentfulPaint: this.metrics.firstContentfulPaint,
            largestContentfulPaint: this.metrics.largestContentfulPaint,
            domContentLoaded: navigationTiming?.domContentLoadedEventEnd || 0,
            timeToFirstByte: navigationTiming?.responseStart - navigationTiming?.requestStart || 0,
            resourceSize: this.calculateResourceSize()
        };
    }

    // Calculate total resource size
    calculateResourceSize() {
        let totalSize = 0;
        const resources = performance.getEntriesByType('resource');

        resources.forEach(resource => {
            if (resource.transferSize) {
                totalSize += resource.transferSize;
            }
        });

        return (totalSize / 1024).toFixed(2) + ' KB';
    }

    // Report metrics to analytics
    reportMetrics(analyticsManager) {
        const metrics = this.getMetrics();

        if (analyticsManager) {
            analyticsManager.trackEvent('performance_metrics', {
                page_load_time: Math.round(metrics.pageLoadTime),
                first_contentful_paint: Math.round(metrics.firstContentfulPaint),
                largest_contentful_paint: Math.round(metrics.largestContentfulPaint),
                dom_content_loaded: Math.round(metrics.domContentLoaded)
            });
        }

        console.log('Performance Metrics:', metrics);
    }

    // Detect network speed and adapt
    getNetworkInfo() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            return {
                effectiveType: connection.effectiveType, // '4g', '3g', '2g', 'slow-2g'
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            };
        }
        return null;
    }

    // Adaptive loading based on network
    adaptiveLoad() {
        const networkInfo = this.getNetworkInfo();

        if (!networkInfo) return 'high-quality';

        if (networkInfo.saveData || networkInfo.effectiveType === 'slow-2g' || networkInfo.effectiveType === '2g') {
            return 'low-quality';
        } else if (networkInfo.effectiveType === '3g') {
            return 'medium-quality';
        }

        return 'high-quality';
    }

    // Service worker registration for caching
    registerServiceWorker(swPath = '/sw.js') {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register(swPath)
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.error('Service Worker registration failed:', error);
                });
        }
    }

    // Monitor and report Long Tasks
    monitorLongTasks() {
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((entryList) => {
                    for (const entry of entryList.getEntries()) {
                        console.warn('Long Task detected:', {
                            duration: entry.duration,
                            startTime: entry.startTime,
                            name: entry.name
                        });
                    }
                });

                observer.observe({ entryTypes: ['longtask'] });
            } catch (error) {
                console.log('Long Task API not supported');
            }
        }
    }

    // Cleanup resources
    cleanup() {
        if (this.imageObserver) {
            this.imageObserver.disconnect();
        }
    }
}

// Initialize globally
const perfOptimizer = new PerformanceOptimizer();
