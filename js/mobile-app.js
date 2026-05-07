// Mobile App Installation Manager
// PWA app installation, native feel, and app shell

class MobileAppManager {
    constructor() {
        this.isInstalled = this.checkInstallation();
        this.isAndroid = /Android/.test(navigator.userAgent);
        this.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        this.isStandalone = window.navigator.standalone === true;
        this.installPrompt = null;
        this.initializeAppShell();
    }

    // Check if app is installed
    checkInstallation() {
        return this.isStandalone || document.documentElement.getAttribute('data-pwa') === 'installed';
    }

    // Initialize app shell
    initializeAppShell() {
        if (this.isInstalled || this.isStandalone) {
            document.documentElement.classList.add('app-mode');
            this.setupAppBehaviors();
        }

        // Listen for install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.installPrompt = e;
            this.showInstallPrompt();
        });

        // Listen for app installed
        window.addEventListener('appinstalled', () => {
            this.onAppInstalled();
        });

        // Handle display mode changes
        window.matchMedia('(display-mode: standalone)').addListener((e) => {
            if (e.matches) {
                this.onAppInstalled();
            }
        });
    }

    // Show install prompt
    showInstallPrompt() {
        const prompt = document.getElementById('app-install-prompt');
        if (prompt) {
            prompt.style.display = 'block';

            const installBtn = document.getElementById('app-install-btn');
            if (installBtn) {
                installBtn.addEventListener('click', () => {
                    this.triggerInstall();
                });
            }

            const dismissBtn = document.getElementById('app-dismiss-btn');
            if (dismissBtn) {
                dismissBtn.addEventListener('click', () => {
                    prompt.style.display = 'none';
                });
            }
        }
    }

    // Trigger app installation
    async triggerInstall() {
        if (!this.installPrompt) {
            return;
        }

        this.installPrompt.prompt();
        const { outcome } = await this.installPrompt.userChoice;

        if (outcome === 'accepted') {
            this.onAppInstalled();
        }

        this.installPrompt = null;
    }

    // On app installed
    onAppInstalled() {
        document.documentElement.classList.add('app-mode');
        document.documentElement.setAttribute('data-pwa', 'installed');
        localStorage.setItem('pwa-installed', 'true');
        this.setupAppBehaviors();

        if (window.gaManager) {
            window.gaManager.trackEvent('app_installed');
        }
    }

    // Setup app-specific behaviors
    setupAppBehaviors() {
        // Add status bar style for iOS
        if (this.isIOS) {
            this.addStatusBarStyle('black-translucent');
        }

        // Disable bounce scroll
        document.body.addEventListener('touchmove', (e) => {
            if (e.target.closest('.scrollable')) return;
            e.preventDefault();
        }, { passive: false });

        // Handle app links
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (!link) return;

            const href = link.getAttribute('href');
            if (href && (href.startsWith('http') || href.startsWith('//'))) {
                if (!link.hasAttribute('target')) {
                    e.preventDefault();
                    window.location.href = href;
                }
            }
        });

        // Setup app navigation
        this.setupAppNavigation();
    }

    // Setup app navigation (back button, etc)
    setupAppNavigation() {
        if (this.isAndroid) {
            // Android physical back button
            document.addEventListener('backbutton', () => {
                if (history.length > 1) {
                    history.back();
                } else {
                    navigator.app?.exitApp?.();
                }
            });
        }

        // Custom back button
        const backBtn = document.getElementById('app-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                if (history.length > 1) {
                    history.back();
                }
            });
        }
    }

    // Add status bar style
    addStatusBarStyle(style = 'default') {
        let meta = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'apple-mobile-web-app-status-bar-style';
            document.head.appendChild(meta);
        }
        meta.content = style;
    }

    // Get install instructions
    getInstallInstructions() {
        if (this.isIOS) {
            return {
                platform: 'iOS',
                steps: [
                    'Tap the Share button (middle bottom icon)',
                    'Scroll down and tap "Add to Home Screen"',
                    'Tap "Add" in the top right',
                    'App will be installed on your home screen'
                ]
            };
        }

        if (this.isAndroid) {
            return {
                platform: 'Android',
                steps: [
                    'Tap the menu button (three dots, top right)',
                    'Select "Install app" or "Add to Home screen"',
                    'Confirm installation',
                    'App will be installed on your home screen'
                ]
            };
        }

        return {
            platform: 'Web',
            steps: ['Install prompt will appear automatically on supported browsers']
        };
    }

    // Check feature support
    getFeatureSupport() {
        return {
            serviceWorker: 'serviceWorker' in navigator,
            pushNotifications: 'Notification' in window,
            offlineStorage: typeof Storage !== 'undefined',
            geolocation: 'geolocation' in navigator,
            camera: navigator.mediaDevices?.getUserMedia !== undefined,
            backgroundSync: 'sync' in navigator.serviceWorker?.registration,
            periodicSync: 'periodicSync' in navigator.serviceWorker?.registration,
            webShare: 'share' in navigator,
            vibration: 'vibrate' in navigator,
            orientationLock: 'orientation' in screen,
            fullscreen: 'fullscreenElement' in document
        };
    }

    // Request notification permission
    async requestNotificationPermission() {
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                return true;
            }

            if (Notification.permission !== 'denied') {
                const permission = await Notification.requestPermission();
                return permission === 'granted';
            }
        }

        return false;
    }

    // Send notification
    sendNotification(title, options = {}) {
        if ('serviceWorker' in navigator && Notification.permission === 'granted') {
            navigator.serviceWorker.ready.then(registration => {
                registration.showNotification(title, {
                    icon: '/images/logo-192.png',
                    badge: '/images/badge-72.png',
                    ...options
                });
            });
        }
    }

    // Get app metrics
    getAppMetrics() {
        return {
            isInstalled: this.isInstalled,
            isStandalone: this.isStandalone,
            platform: this.isAndroid ? 'Android' : this.isIOS ? 'iOS' : 'Web',
            appMode: document.documentElement.classList.contains('app-mode'),
            installationTime: localStorage.getItem('pwa-install-time'),
            featureSupport: this.getFeatureSupport()
        };
    }

    // Track app events
    trackAppEvent(eventName, data = {}) {
        if (window.gaManager) {
            window.gaManager.trackEvent(`app_${eventName}`, {
                app_installed: this.isInstalled,
                app_platform: this.isAndroid ? 'android' : this.isIOS ? 'ios' : 'web',
                ...data
            });
        }
    }
}

const mobileAppManager = new MobileAppManager();
