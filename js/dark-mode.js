// Dark Mode Manager
// Theme switching with persistent preferences and automatic detection

class DarkModeManager {
    constructor() {
        this.darkModeEnabled = this.getStoredTheme() || this.detectSystemPreference();
        this.initializeTheme();
    }

    // Initialize theme on page load
    initializeTheme() {
        this.applyTheme(this.darkModeEnabled);
        this.setupThemeToggle();
        this.setupMediaQueryListener();
    }

    // Detect system theme preference
    detectSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return true;
        }
        return false;
    }

    // Get stored theme preference
    getStoredTheme() {
        const stored = localStorage.getItem('theme-mode');
        return stored ? stored === 'dark' : null;
    }

    // Apply theme to document
    applyTheme(isDark) {
        this.darkModeEnabled = isDark;

        if (isDark) {
            document.documentElement.classList.add('dark-mode');
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme-mode', 'dark');
        } else {
            document.documentElement.classList.remove('dark-mode');
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme-mode', 'light');
        }

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', isDark ? '#1a1a1a' : '#ffffff');
        }

        // Notify other components
        if (window.gaManager) {
            window.gaManager.trackEvent('theme_changed', {
                theme: isDark ? 'dark' : 'light'
            });
        }

        // Trigger custom event
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { isDark } }));
    }

    // Toggle dark mode
    toggleDarkMode() {
        this.applyTheme(!this.darkModeEnabled);
        return this.darkModeEnabled;
    }

    // Set theme explicitly
    setTheme(isDark) {
        this.applyTheme(isDark);
    }

    // Check if dark mode is enabled
    isDarkMode() {
        return this.darkModeEnabled;
    }

    // Setup theme toggle button
    setupThemeToggle(buttonId = 'theme-toggle') {
        const button = document.getElementById(buttonId);
        if (!button) return;

        const updateButtonContent = () => {
            button.innerHTML = this.darkModeEnabled
                ? '<i class="icon-sun"></i><span>Light Mode</span>'
                : '<i class="icon-moon"></i><span>Dark Mode</span>';
            button.setAttribute('aria-pressed', this.darkModeEnabled);
            button.title = this.darkModeEnabled ? 'Switch to light mode' : 'Switch to dark mode';
        };

        updateButtonContent();
        button.addEventListener('click', () => {
            this.toggleDarkMode();
            updateButtonContent();
        });
    }

    // Listen for system theme changes
    setupMediaQueryListener() {
        if (!window.matchMedia) return;

        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        darkModeQuery.addEventListener('change', (e) => {
            // Only apply if user hasn't manually set a preference
            if (!localStorage.getItem('theme-mode')) {
                this.applyTheme(e.matches);
            }
        });
    }

    // Get CSS variables for current theme
    getCSSVariables() {
        return {
            'dark': {
                '--bg-primary': '#1a1a1a',
                '--bg-secondary': '#2d2d2d',
                '--bg-tertiary': '#3d3d3d',
                '--text-primary': '#ffffff',
                '--text-secondary': '#b0b0b0',
                '--text-tertiary': '#808080',
                '--border-color': '#404040',
                '--shadow-color': 'rgba(0, 0, 0, 0.5)',
                '--input-bg': '#2d2d2d',
                '--input-border': '#404040',
                '--hover-bg': '#3d3d3d',
                '--accent-color': '#4a9eff'
            },
            'light': {
                '--bg-primary': '#ffffff',
                '--bg-secondary': '#f5f5f5',
                '--bg-tertiary': '#eeeeee',
                '--text-primary': '#000000',
                '--text-secondary': '#505050',
                '--text-tertiary': '#808080',
                '--border-color': '#e0e0e0',
                '--shadow-color': 'rgba(0, 0, 0, 0.1)',
                '--input-bg': '#ffffff',
                '--input-border': '#d0d0d0',
                '--hover-bg': '#f5f5f5',
                '--accent-color': '#0066cc'
            }
        };
    }

    // Apply CSS variables
    applyCSSVariables() {
        const theme = this.darkModeEnabled ? 'dark' : 'light';
        const variables = this.getCSSVariables()[theme];

        Object.entries(variables).forEach(([key, value]) => {
            document.documentElement.style.setProperty(key, value);
        });
    }

    // Get theme stats
    getThemeStats() {
        return {
            currentTheme: this.darkModeEnabled ? 'dark' : 'light',
            systemPreference: this.detectSystemPreference() ? 'dark' : 'light',
            isAutomatic: !localStorage.getItem('theme-mode'),
            userPreference: this.getStoredTheme()
        };
    }
}

const darkModeManager = new DarkModeManager();
