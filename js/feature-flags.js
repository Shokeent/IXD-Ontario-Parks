// Feature Flags & A/B Testing System
// Enables progressive feature rollout and experimentation

class FeatureFlagsManager {
    constructor() {
        this.flags = this.loadFlags();
        this.experiments = this.loadExperiments();
        this.userVariant = this.getUserVariant();
    }

    loadFlags() {
        const stored = localStorage.getItem('feature_flags');
        return stored ? JSON.parse(stored) : this.getDefaultFlags();
    }

    loadExperiments() {
        const stored = localStorage.getItem('experiments');
        return stored ? JSON.parse(stored) : this.getDefaultExperiments();
    }

    getDefaultFlags() {
        return {
            'booking-redesign': { enabled: false, rolloutPercentage: 50 },
            'advanced-filters': { enabled: false, rolloutPercentage: 30 },
            'gear-rental': { enabled: false, rolloutPercentage: 20 },
            'social-sharing': { enabled: true, rolloutPercentage: 100 },
            'offline-mode': { enabled: true, rolloutPercentage: 100 },
            'analytics-enhanced': { enabled: true, rolloutPercentage: 100 },
            'payment-integration': { enabled: false, rolloutPercentage: 10 },
            'email-confirmations': { enabled: false, rolloutPercentage: 15 },
            'admin-dashboard': { enabled: false, rolloutPercentage: 5 },
            'dark-mode': { enabled: false, rolloutPercentage: 0 }
        };
    }

    getDefaultExperiments() {
        return {
            'checkout-flow-v2': {
                name: 'Simplified Checkout Flow',
                active: false,
                variants: {
                    control: { weight: 50, label: 'Original Flow' },
                    variant_a: { weight: 50, label: 'Simplified Flow' }
                },
                startDate: null,
                endDate: null
            },
            'search-ranking': {
                name: 'Park Search Ranking',
                active: false,
                variants: {
                    control: { weight: 50, label: 'Distance-based' },
                    variant_a: { weight: 50, label: 'Popularity-based' }
                },
                startDate: null,
                endDate: null
            },
            'recommendation-engine': {
                name: 'Park Recommendations',
                active: false,
                variants: {
                    control: { weight: 50, label: 'Random' },
                    variant_a: { weight: 50, label: 'ML-based' }
                },
                startDate: null,
                endDate: null
            }
        };
    }

    getUserVariant() {
        let variant = localStorage.getItem('user_variant');
        if (!variant) {
            variant = Math.random().toString(36).substring(2, 15);
            localStorage.setItem('user_variant', variant);
        }
        return variant;
    }

    // Check if feature is enabled for current user
    isEnabled(featureName) {
        const flag = this.flags[featureName];
        if (!flag) return false;

        if (flag.enabled === false) return false;
        if (flag.rolloutPercentage === 100) return true;

        const hash = this.hashUserVariant(this.userVariant, featureName);
        return (hash % 100) < flag.rolloutPercentage;
    }

    // Check experiment variant for user
    getExperimentVariant(experimentName) {
        const experiment = this.experiments[experimentName];
        if (!experiment || !experiment.active) return null;

        const now = new Date();
        if (experiment.startDate && new Date(experiment.startDate) > now) return null;
        if (experiment.endDate && new Date(experiment.endDate) < now) return null;

        const hash = this.hashUserVariant(this.userVariant, experimentName);
        let cumulative = 0;

        for (const [variantName, variant] of Object.entries(experiment.variants)) {
            cumulative += variant.weight;
            if ((hash % 100) < cumulative) {
                return { name: variantName, label: variant.label };
            }
        }

        return Object.entries(experiment.variants)[0];
    }

    hashUserVariant(variant, featureName) {
        let hash = 0;
        const str = variant + featureName;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    // Admin methods
    setFlag(featureName, enabled, rolloutPercentage = 100) {
        this.flags[featureName] = {
            enabled,
            rolloutPercentage: Math.min(100, Math.max(0, rolloutPercentage))
        };
        this.saveFlags();
    }

    startExperiment(experimentName, startDate = null, endDate = null) {
        if (this.experiments[experimentName]) {
            this.experiments[experimentName].active = true;
            this.experiments[experimentName].startDate = startDate;
            this.experiments[experimentName].endDate = endDate;
            this.saveExperiments();
        }
    }

    endExperiment(experimentName) {
        if (this.experiments[experimentName]) {
            this.experiments[experimentName].active = false;
            this.saveExperiments();
        }
    }

    saveFlags() {
        localStorage.setItem('feature_flags', JSON.stringify(this.flags));
    }

    saveExperiments() {
        localStorage.setItem('experiments', JSON.stringify(this.experiments));
    }

    // Get all flags for admin dashboard
    getAllFlags() {
        return this.flags;
    }

    // Get all experiments for admin dashboard
    getAllExperiments() {
        return this.experiments;
    }

    // Reset to defaults
    reset() {
        this.flags = this.getDefaultFlags();
        this.experiments = this.getDefaultExperiments();
        this.saveFlags();
        this.saveExperiments();
    }
}

const featureFlags = new FeatureFlagsManager();
