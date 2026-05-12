// Loyalty & Rewards Program
// Points, tiers, badges, and perks for returning visitors

class LoyaltyRewardsManager {
    constructor() {
        this.account = JSON.parse(localStorage.getItem('loyalty-account') || 'null');
        this.transactions = JSON.parse(localStorage.getItem('loyalty-transactions') || '[]');
        this.badges = this.loadBadgeDefinitions();
        this.tiers = this.loadTierDefinitions();
        this.initializeAccount();
    }

    loadTierDefinitions() {
        return {
            explorer: { name: 'Explorer', minPoints: 0, color: '#8BC34A', perks: ['5% off bookings', 'Early access to events'] },
            adventurer: { name: 'Adventurer', minPoints: 500, color: '#FF9800', perks: ['10% off bookings', 'Free equipment upgrade', 'Priority customer support'] },
            ranger: { name: 'Ranger', minPoints: 1500, color: '#2196F3', perks: ['15% off bookings', 'Free day-use pass monthly', 'Exclusive ranger tours'] },
            legend: { name: 'Legend', minPoints: 5000, color: '#9C27B0', perks: ['20% off all services', 'VIP event access', 'Annual park pass discount', 'Dedicated account manager'] }
        };
    }

    loadBadgeDefinitions() {
        return [
            { id: 'first-booking', name: 'First Adventure', description: 'Completed your first booking', icon: '🏕️', points: 50, condition: bookings => bookings >= 1 },
            { id: 'five-parks', name: 'Park Explorer', description: 'Visited 5 different parks', icon: '🗺️', points: 200, condition: (_, parks) => parks >= 5 },
            { id: 'trail-blazer', name: 'Trail Blazer', description: 'Completed 10 trails', icon: '🥾', points: 150, condition: (_, __, trails) => trails >= 10 },
            { id: 'photographer', name: 'Nature Photographer', description: 'Uploaded 20 photos', icon: '📷', points: 100, condition: (_, __, ___, photos) => photos >= 20 },
            { id: 'community', name: 'Community Voice', description: 'Submitted 5 reviews', icon: '⭐', points: 75, condition: (_, __, ___, ____, reviews) => reviews >= 5 },
            { id: 'four-seasons', name: 'Four Seasons', description: 'Visited in all 4 seasons', icon: '🌿', points: 300, condition: () => false },
            { id: 'early-bird', name: 'Early Bird', description: 'Booked 30+ days in advance', icon: '🌅', points: 25, condition: () => false },
            { id: 'weekend-warrior', name: 'Weekend Warrior', description: 'Booked 5 weekend trips', icon: '⛺', points: 100, condition: () => false },
            { id: 'group-leader', name: 'Group Leader', description: 'Organized a group booking', icon: '👥', points: 75, condition: () => false },
            { id: 'wildlife-spotter', name: 'Wildlife Spotter', description: 'Logged 20 wildlife sightings', icon: '🦌', points: 125, condition: () => false }
        ];
    }

    initializeAccount() {
        if (!this.account) {
            this.account = {
                userId: localStorage.getItem('user_id') || 'guest',
                points: 0,
                lifetimePoints: 0,
                tier: 'explorer',
                earnedBadges: [],
                joinedAt: new Date().toISOString(),
                lastActivity: new Date().toISOString()
            };
            this.saveAccount();
        }
    }

    // Earn points
    earnPoints(amount, reason, metadata = {}) {
        if (amount <= 0) return;

        this.account.points += amount;
        this.account.lifetimePoints += amount;
        this.account.lastActivity = new Date().toISOString();

        const transaction = {
            id: 'txn_' + Date.now(),
            type: 'earn',
            amount,
            reason,
            metadata,
            balance: this.account.points,
            timestamp: new Date().toISOString()
        };

        this.transactions.push(transaction);
        this.updateTier();
        this.checkBadges();
        this.saveAccount();
        this.saveTransactions();

        if (window.notificationManager) {
            window.notificationManager.createNotification({
                type: 'loyalty',
                title: `+${amount} Points Earned!`,
                message: reason,
                priority: 'normal'
            });
        }

        if (window.gaManager) {
            window.gaManager.trackEvent('loyalty_points_earned', { amount, reason });
        }

        return transaction;
    }

    // Redeem points
    redeemPoints(amount, reward) {
        if (amount > this.account.points) {
            return { success: false, error: 'Insufficient points' };
        }

        this.account.points -= amount;

        const transaction = {
            id: 'txn_' + Date.now(),
            type: 'redeem',
            amount: -amount,
            reason: `Redeemed: ${reward}`,
            balance: this.account.points,
            timestamp: new Date().toISOString()
        };

        this.transactions.push(transaction);
        this.saveAccount();
        this.saveTransactions();

        if (window.gaManager) {
            window.gaManager.trackEvent('loyalty_points_redeemed', { amount, reward });
        }

        return { success: true, transaction, remainingPoints: this.account.points };
    }

    // Update tier based on lifetime points
    updateTier() {
        const lifetimePoints = this.account.lifetimePoints;
        let newTier = 'explorer';

        if (lifetimePoints >= 5000) newTier = 'legend';
        else if (lifetimePoints >= 1500) newTier = 'ranger';
        else if (lifetimePoints >= 500) newTier = 'adventurer';

        if (newTier !== this.account.tier) {
            const oldTier = this.account.tier;
            this.account.tier = newTier;

            if (window.notificationManager) {
                window.notificationManager.createNotification({
                    type: 'loyalty',
                    title: '🎉 Tier Upgrade!',
                    message: `Congratulations! You've reached ${this.tiers[newTier].name} status!`,
                    priority: 'high'
                });
            }
        }
    }

    // Check and award badges
    checkBadges(stats = {}) {
        const { bookings = 0, parks = 0, trails = 0, photos = 0, reviews = 0 } = stats;

        this.badges.forEach(badge => {
            if (!this.account.earnedBadges.includes(badge.id)) {
                if (badge.condition(bookings, parks, trails, photos, reviews)) {
                    this.awardBadge(badge.id);
                }
            }
        });
    }

    // Award badge
    awardBadge(badgeId) {
        const badge = this.badges.find(b => b.id === badgeId);
        if (!badge || this.account.earnedBadges.includes(badgeId)) return;

        this.account.earnedBadges.push(badgeId);
        this.earnPoints(badge.points, `Badge earned: ${badge.name}`);

        if (window.notificationManager) {
            window.notificationManager.createNotification({
                type: 'badge',
                title: `${badge.icon} Badge Earned!`,
                message: `You earned the "${badge.name}" badge — +${badge.points} points!`,
                priority: 'high'
            });
        }
    }

    // Get tier info
    getCurrentTier() {
        return { ...this.tiers[this.account.tier], id: this.account.tier };
    }

    // Get points to next tier
    getPointsToNextTier() {
        const tierOrder = ['explorer', 'adventurer', 'ranger', 'legend'];
        const currentIdx = tierOrder.indexOf(this.account.tier);

        if (currentIdx === tierOrder.length - 1) {
            return { nextTier: null, pointsNeeded: 0, message: 'Maximum tier reached!' };
        }

        const nextTierId = tierOrder[currentIdx + 1];
        const nextTier = this.tiers[nextTierId];
        const pointsNeeded = nextTier.minPoints - this.account.lifetimePoints;

        return { nextTier: nextTierId, nextTierName: nextTier.name, pointsNeeded: Math.max(0, pointsNeeded) };
    }

    // Get earning opportunities
    getEarningOpportunities() {
        return [
            { action: 'Complete a booking', points: 100, category: 'booking' },
            { action: 'Write a review', points: 25, category: 'review' },
            { action: 'Upload a photo', points: 10, category: 'photo' },
            { action: 'Log a wildlife sighting', points: 15, category: 'wildlife' },
            { action: 'Register for an event', points: 20, category: 'event' },
            { action: 'Refer a friend', points: 50, category: 'referral' },
            { action: 'Complete profile', points: 30, category: 'profile' },
            { action: 'Share a park', points: 5, category: 'social' }
        ];
    }

    // Get redemption options
    getRedemptionOptions() {
        return [
            { id: 'discount-5', name: '5% Booking Discount', points: 100, value: '5%' },
            { id: 'discount-10', name: '10% Booking Discount', points: 200, value: '10%' },
            { id: 'free-dayuse', name: 'Free Day-Use Pass', points: 300, value: '$18' },
            { id: 'equipment-upgrade', name: 'Equipment Upgrade (1 item)', points: 150, value: '$15' },
            { id: 'event-credit', name: '$20 Event Credit', points: 200, value: '$20' },
            { id: 'annual-pass-discount', name: '$50 off Annual Pass', points: 500, value: '$50' }
        ];
    }

    // Get account summary
    getAccountSummary() {
        const tier = this.getCurrentTier();
        const toNext = this.getPointsToNextTier();

        return {
            points: this.account.points,
            lifetimePoints: this.account.lifetimePoints,
            tier: tier.name,
            tierColor: tier.color,
            perks: tier.perks,
            badgesEarned: this.account.earnedBadges.length,
            totalBadges: this.badges.length,
            pointsToNextTier: toNext.pointsNeeded,
            nextTierName: toNext.nextTierName,
            memberSince: this.account.joinedAt
        };
    }

    // Render loyalty dashboard
    renderLoyaltyDashboard(containerId = 'loyalty-dashboard') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const summary = this.getAccountSummary();
        const toNext = this.getPointsToNextTier();
        const progressPercent = toNext.pointsNeeded > 0
            ? Math.round(((this.account.lifetimePoints - (this.tiers[this.account.tier]?.minPoints || 0)) /
                         (toNext.pointsNeeded)) * 100)
            : 100;

        let html = `
            <div class="loyalty-dashboard">
                <div class="loyalty-header" style="border-color: ${summary.tierColor}">
                    <div class="tier-badge" style="background: ${summary.tierColor}">
                        ${summary.tier}
                    </div>
                    <div class="points-display">
                        <span class="points-value">${summary.points.toLocaleString()}</span>
                        <span class="points-label">Points Available</span>
                    </div>
                </div>

                ${toNext.nextTierName ? `
                    <div class="tier-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progressPercent}%; background: ${summary.tierColor}"></div>
                        </div>
                        <p>${summary.pointsToNextTier.toLocaleString()} points to ${toNext.nextTierName}</p>
                    </div>
                ` : '<p class="max-tier">Maximum tier reached!</p>'}

                <div class="perks-section">
                    <h3>Your Perks</h3>
                    <ul>${summary.perks.map(p => `<li>✓ ${p}</li>`).join('')}</ul>
                </div>

                <div class="badges-section">
                    <h3>Badges (${summary.badgesEarned}/${summary.totalBadges})</h3>
                    <div class="badges-grid">
                        ${this.badges.map(badge => `
                            <div class="badge-item ${this.account.earnedBadges.includes(badge.id) ? 'earned' : 'locked'}">
                                <span class="badge-icon">${badge.icon}</span>
                                <span class="badge-name">${badge.name}</span>
                                <span class="badge-points">+${badge.points} pts</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="redeem-section">
                    <h3>Redeem Points</h3>
                    <div class="redemption-grid">
                        ${this.getRedemptionOptions().map(opt => `
                            <div class="redemption-card ${this.account.points < opt.points ? 'disabled' : ''}">
                                <div class="redemption-name">${opt.name}</div>
                                <div class="redemption-value">${opt.value}</div>
                                <button class="btn-sm btn-primary"
                                        ${this.account.points < opt.points ? 'disabled' : ''}
                                        onclick="loyaltyRewardsManager.redeemPoints(${opt.points}, '${opt.name}')">
                                    ${opt.points} pts
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    saveAccount() {
        localStorage.setItem('loyalty-account', JSON.stringify(this.account));
    }

    saveTransactions() {
        localStorage.setItem('loyalty-transactions', JSON.stringify(this.transactions));
    }
}

const loyaltyRewardsManager = new LoyaltyRewardsManager();
