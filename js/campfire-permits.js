// Campfire Permit & Fire Safety System
// Permit requests, fire bans, fire safety tracking

class CampfirePermitManager {
    constructor() {
        this.permits = JSON.parse(localStorage.getItem('campfire-permits') || '[]');
        this.fireBans = this.loadFireBans();
        this.safetyGuide = this.loadSafetyGuide();
    }

    loadFireBans() {
        return {
            'algonquin-park': { active: false, level: null, updatedAt: new Date().toISOString() },
            'killarney-park': { active: false, level: null, updatedAt: new Date().toISOString() },
            'pinery-park': { active: false, level: null, updatedAt: new Date().toISOString() },
            'bon-echo-park': { active: true, level: 'total', reason: 'Extreme fire hazard conditions', updatedAt: new Date().toISOString() },
            'sandbanks-park': { active: false, level: null, updatedAt: new Date().toISOString() },
            'point-pelee-park': { active: false, level: null, updatedAt: new Date().toISOString() },
            'kawartha-park': { active: true, level: 'campfire', reason: 'High fire hazard — no open fires, camp stoves allowed', updatedAt: new Date().toISOString() },
            'muskoka-park': { active: false, level: null, updatedAt: new Date().toISOString() },
            'temagami-park': { active: false, level: null, updatedAt: new Date().toISOString() }
        };
    }

    loadSafetyGuide() {
        return {
            beforeLighting: [
                'Check if fire bans are in effect',
                'Use designated fire pits only — never dig your own',
                'Clear a 3-metre radius of debris around fire pit',
                'Keep a bucket of water and shovel nearby at all times',
                'Never light a fire on windy days or in drought conditions'
            ],
            duringFire: [
                'Never leave a fire unattended — even for a moment',
                'Keep fire small and manageable',
                'Never burn garbage, treated wood, or aerosol cans',
                'Keep children and pets a safe distance away',
                'Do not light fires during high wind warnings'
            ],
            extinguishing: [
                'Pour water generously over all embers',
                'Stir ashes with a stick to expose hot spots',
                'Pour more water — repeat until completely cold',
                'Touch the ashes with the back of your hand to confirm cold',
                'If you cannot confirm it\'s cold, do not leave the site'
            ],
            penalties: [
                'Violating a fire ban: up to $25,000 fine',
                'Causing a forest fire through negligence: up to $250,000 fine',
                'Criminal negligence causing fire damage: up to 5 years imprisonment'
            ]
        };
    }

    // Check fire ban status
    checkFireBan(parkId) {
        const ban = this.fireBans[parkId];
        if (!ban) return { status: 'unknown', message: 'Fire ban status unavailable for this park' };

        if (ban.active) {
            return {
                active: true,
                level: ban.level,
                reason: ban.reason,
                message: ban.level === 'total'
                    ? '🔴 TOTAL FIRE BAN — No open fires, no camp stoves'
                    : '🟠 CAMPFIRE BAN — No open fires, camp stoves permitted',
                updatedAt: ban.updatedAt
            };
        }

        return {
            active: false,
            level: null,
            message: '🟢 No fire ban in effect — follow safe fire practices',
            updatedAt: ban.updatedAt
        };
    }

    // Request permit
    requestPermit(permitData) {
        const { parkId, userId, campsiteNumber, startDate, endDate, numNights } = permitData;

        const ban = this.checkFireBan(parkId);
        if (ban.active && ban.level === 'total') {
            return { success: false, error: 'Cannot issue permit — total fire ban in effect' };
        }

        const existingActive = this.permits.find(p =>
            p.userId === userId && p.parkId === parkId &&
            p.status === 'active' && new Date(p.endDate) >= new Date()
        );

        if (existingActive) {
            return { success: false, error: 'You already have an active permit for this park' };
        }

        const permit = {
            id: 'permit_' + Date.now(),
            parkId,
            userId,
            campsiteNumber,
            startDate,
            endDate,
            numNights,
            issuedAt: new Date().toISOString(),
            status: 'active',
            permitNumber: this.generatePermitNumber(),
            restrictions: ban.active ? ['No open fires — camp stoves only'] : []
        };

        this.permits.push(permit);
        this.savePermits();

        if (window.gaManager) {
            window.gaManager.trackEvent('campfire_permit_issued', {
                park_id: parkId,
                num_nights: numNights
            });
        }

        return { success: true, permit };
    }

    // Generate permit number
    generatePermitNumber() {
        const prefix = 'CFP';
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 900000 + 100000);
        return `${prefix}-${year}-${random}`;
    }

    // Get user permits
    getUserPermits(userId) {
        return this.permits
            .filter(p => p.userId === userId)
            .sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt));
    }

    // Get active permit
    getActivePermit(userId, parkId) {
        return this.permits.find(p =>
            p.userId === userId &&
            p.parkId === parkId &&
            p.status === 'active' &&
            new Date(p.endDate) >= new Date()
        );
    }

    // Get fire hazard level
    getFireHazardLevel(parkId) {
        const levels = { low: 1, moderate: 2, high: 3, extreme: 4 };
        const mockLevel = ['low', 'moderate', 'high'][Math.floor(Math.random() * 3)];
        return {
            level: mockLevel,
            score: levels[mockLevel],
            description: {
                low: 'Fires may be started under normal conditions',
                moderate: 'Fires spread readily — use extra caution',
                high: 'Fires spread rapidly — avoid lighting fires in open areas',
                extreme: 'Any fire is extremely dangerous — restrictions likely'
            }[mockLevel]
        };
    }

    // Render permit card
    renderPermitCard(permit, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const isValid = new Date(permit.endDate) >= new Date();

        container.innerHTML = `
            <div class="permit-card ${isValid ? 'valid' : 'expired'}">
                <div class="permit-header">
                    <h3>Campfire Permit</h3>
                    <span class="permit-status">${isValid ? '✓ Valid' : '✗ Expired'}</span>
                </div>
                <div class="permit-number">${permit.permitNumber}</div>
                <div class="permit-details">
                    <div><strong>Park:</strong> ${permit.parkId.replace('-', ' ')}</div>
                    <div><strong>Campsite:</strong> ${permit.campsiteNumber}</div>
                    <div><strong>Valid:</strong> ${new Date(permit.startDate).toLocaleDateString()} – ${new Date(permit.endDate).toLocaleDateString()}</div>
                </div>
                ${permit.restrictions.length > 0 ? `
                    <div class="permit-restrictions">
                        <strong>Restrictions:</strong>
                        <ul>${permit.restrictions.map(r => `<li>${r}</li>`).join('')}</ul>
                    </div>
                ` : ''}
                <p class="permit-note">Present this permit to park staff if requested.</p>
            </div>
        `;
    }

    // Render fire safety guide
    renderFireSafetyGuide(containerId = 'fire-safety-guide') {
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = '<div class="fire-safety-guide">';

        const sections = [
            { title: 'Before Lighting', icon: '🔥', items: this.safetyGuide.beforeLighting },
            { title: 'During Your Fire', icon: '👀', items: this.safetyGuide.duringFire },
            { title: 'Extinguishing', icon: '💧', items: this.safetyGuide.extinguishing },
            { title: 'Penalties', icon: '⚖️', items: this.safetyGuide.penalties, warning: true }
        ];

        sections.forEach(section => {
            html += `
                <div class="safety-section ${section.warning ? 'warning' : ''}">
                    <h3>${section.icon} ${section.title}</h3>
                    <ul>${section.items.map(item => `<li>${item}</li>`).join('')}</ul>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    savePermits() {
        localStorage.setItem('campfire-permits', JSON.stringify(this.permits));
    }
}

const campfirePermitManager = new CampfirePermitManager();
