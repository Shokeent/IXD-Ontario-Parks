// Group Booking & Referral System
// Collaborative bookings and user referrals with rewards

class GroupBookingReferralManager {
    constructor() {
        this.groupBookings = JSON.parse(localStorage.getItem('group-bookings') || '[]');
        this.referrals = JSON.parse(localStorage.getItem('referrals') || '[]');
        this.referralCodes = JSON.parse(localStorage.getItem('referral-codes') || '{}');
        this.rewards = JSON.parse(localStorage.getItem('referral-rewards') || '[]');
        this.initializeUserReferralCode();
    }

    // Initialize user referral code
    initializeUserReferralCode() {
        const userId = localStorage.getItem('user_id');

        if (!userId || !this.referralCodes[userId]) {
            const newUserId = 'user_' + Date.now();
            localStorage.setItem('user_id', newUserId);
            this.generateReferralCode(newUserId);
        }
    }

    // Generate referral code
    generateReferralCode(userId) {
        const code = Math.random().toString(36).substring(2, 8).toUpperCase();
        this.referralCodes[userId] = {
            code,
            createdAt: new Date().toISOString(),
            usedCount: 0,
            rewards: 0
        };

        localStorage.setItem('referral-codes', JSON.stringify(this.referralCodes));
        return code;
    }

    // Get user's referral code
    getUserReferralCode(userId = null) {
        const id = userId || localStorage.getItem('user_id');
        return this.referralCodes[id] || null;
    }

    // Create group booking
    createGroupBooking(bookingData) {
        const {
            name,
            parkId,
            checkIn,
            checkOut,
            groupSize,
            sites = [],
            description = ''
        } = bookingData;

        const groupBooking = {
            id: 'group_' + Date.now(),
            name,
            parkId,
            checkIn,
            checkOut,
            groupSize,
            currentMembers: 1,
            sites,
            description,
            members: [{
                userId: localStorage.getItem('user_id'),
                role: 'organizer',
                joinedAt: new Date().toISOString()
            }],
            invites: [],
            splitMode: 'equal',
            expenses: [],
            status: 'open',
            createdAt: new Date().toISOString(),
            totalCost: 0
        };

        this.groupBookings.push(groupBooking);
        this.saveGroupBookings();

        if (window.gaManager) {
            window.gaManager.trackEvent('group_booking_created', {
                group_name: name,
                group_size: groupSize
            });
        }

        return groupBooking;
    }

    // Invite to group booking
    inviteToGroupBooking(groupId, emails) {
        const group = this.groupBookings.find(g => g.id === groupId);

        if (!group) {
            return { success: false, error: 'Group not found' };
        }

        const invites = emails.map(email => ({
            email,
            status: 'pending',
            sentAt: new Date().toISOString(),
            code: this.generateInviteCode()
        }));

        group.invites.push(...invites);
        this.saveGroupBookings();

        if (window.gaManager) {
            window.gaManager.trackEvent('group_invites_sent', {
                group_id: groupId,
                invite_count: emails.length
            });
        }

        return { success: true, invites };
    }

    // Accept group invite
    acceptGroupInvite(inviteCode, userId) {
        for (const group of this.groupBookings) {
            const inviteIndex = group.invites.findIndex(i => i.code === inviteCode);

            if (inviteIndex !== -1) {
                const invite = group.invites[inviteIndex];

                if (group.currentMembers < group.groupSize) {
                    group.members.push({
                        userId,
                        role: 'member',
                        joinedAt: new Date().toISOString()
                    });

                    group.currentMembers++;
                    invite.status = 'accepted';
                    this.saveGroupBookings();

                    return { success: true, group };
                } else {
                    return { success: false, error: 'Group is full' };
                }
            }
        }

        return { success: false, error: 'Invite not found' };
    }

    // Split group expenses
    splitExpenses(groupId, amount, description) {
        const group = this.groupBookings.find(g => g.id === groupId);

        if (!group) {
            return { success: false, error: 'Group not found' };
        }

        const splitAmount = amount / group.members.length;

        const expense = {
            id: 'exp_' + Date.now(),
            amount,
            splitAmount,
            description,
            addedAt: new Date().toISOString(),
            splits: group.members.map(member => ({
                userId: member.userId,
                amount: splitAmount,
                paid: false
            }))
        };

        group.expenses.push(expense);
        group.totalCost += amount;
        this.saveGroupBookings();

        return { success: true, expense };
    }

    // Refer friend
    referFriend(friendEmail) {
        const userId = localStorage.getItem('user_id');
        const referralCode = this.getUserReferralCode(userId);

        if (!referralCode) {
            return { success: false, error: 'No referral code found' };
        }

        const referral = {
            id: 'ref_' + Date.now(),
            referrerUserId: userId,
            referralCode: referralCode.code,
            friendEmail,
            status: 'pending',
            reward: 0,
            createdAt: new Date().toISOString()
        };

        this.referrals.push(referral);
        this.saveReferrals();

        if (window.gaManager) {
            window.gaManager.trackEvent('friend_referred', {
                referral_code: referralCode.code
            });
        }

        return { success: true, referral };
    }

    // Apply referral code
    applyReferralCode(code) {
        // Find the referrer
        let referrerId = null;

        for (const [userId, referralData] of Object.entries(this.referralCodes)) {
            if (referralData.code === code) {
                referrerId = userId;
                break;
            }
        }

        if (!referrerId) {
            return { success: false, error: 'Invalid referral code' };
        }

        // Award discount to current user
        const discountAmount = 10; // $10 discount
        this.rewards.push({
            id: 'reward_' + Date.now(),
            userId: localStorage.getItem('user_id'),
            referralCode: code,
            type: 'discount',
            amount: discountAmount,
            createdAt: new Date().toISOString()
        });

        // Award points to referrer
        if (this.referralCodes[referrerId]) {
            this.referralCodes[referrerId].usedCount++;
            this.referralCodes[referrerId].rewards += 5; // 5 bonus points

            // Award bonus if 5 people use code
            if (this.referralCodes[referrerId].usedCount % 5 === 0) {
                this.rewards.push({
                    id: 'reward_' + Date.now(),
                    userId: referrerId,
                    referralCode: code,
                    type: 'bonus_points',
                    amount: 50,
                    createdAt: new Date().toISOString()
                });
            }
        }

        localStorage.setItem('referral-codes', JSON.stringify(this.referralCodes));
        this.saveRewards();

        if (window.gaManager) {
            window.gaManager.trackEvent('referral_code_applied', {
                referral_code: code,
                discount: discountAmount
            });
        }

        return { success: true, discount: discountAmount };
    }

    // Get referral stats
    getReferralStats(userId = null) {
        const id = userId || localStorage.getItem('user_id');
        const referralCode = this.referralCodes[id];

        if (!referralCode) {
            return null;
        }

        return {
            code: referralCode.code,
            usedCount: referralCode.usedCount,
            totalRewards: referralCode.rewards,
            shareUrl: `${window.location.origin}?ref=${referralCode.code}`
        };
    }

    // Get group booking stats
    getGroupBookingStats(groupId) {
        const group = this.groupBookings.find(g => g.id === groupId);

        if (!group) {
            return null;
        }

        const costPerPerson = group.totalCost / group.members.length;
        const totalExpenses = group.expenses.length;

        return {
            groupId,
            members: group.members.length,
            totalCost: group.totalCost,
            costPerPerson: Math.round(costPerPerson),
            expenses: totalExpenses,
            occupancy: `${group.currentMembers}/${group.groupSize}`
        };
    }

    // Generate invite code
    generateInviteCode() {
        return Math.random().toString(36).substring(2, 10);
    }

    // Render group bookings
    renderGroupBookings(containerId = 'group-bookings') {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (this.groupBookings.length === 0) {
            container.innerHTML = '<p class="no-results">No group bookings yet</p>';
            return;
        }

        let html = '<div class="group-bookings-list">';

        this.groupBookings.forEach(group => {
            const stats = this.getGroupBookingStats(group.id);

            html += `
                <div class="group-card">
                    <div class="group-header">
                        <h3>${group.name}</h3>
                        <span class="group-size">${group.currentMembers}/${group.groupSize} people</span>
                    </div>
                    <div class="group-details">
                        <p>📍 ${group.parkId}</p>
                        <p>📅 ${new Date(group.checkIn).toLocaleDateString()}</p>
                        <p>💰 $${stats.costPerPerson}/person</p>
                    </div>
                    <div class="group-actions">
                        <button class="btn-primary" onclick="viewGroupBooking('${group.id}')">View</button>
                        ${group.members[0].userId === localStorage.getItem('user_id') ? `
                            <button class="btn-secondary" onclick="shareGroupBooking('${group.id}')">Share</button>
                        ` : ''}
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    // Render referral widget
    renderReferralWidget(containerId = 'referral-widget') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const stats = this.getReferralStats();

        if (!stats) {
            container.innerHTML = '<p>No referral code found</p>';
            return;
        }

        let html = `
            <div class="referral-widget">
                <h3>Share & Earn</h3>
                <div class="referral-code">
                    <input type="text" value="${stats.code}" readonly>
                    <button onclick="navigator.clipboard.writeText('${stats.code}'); alert('Copied!')">Copy</button>
                </div>
                <div class="referral-stats">
                    <div class="stat">
                        <span class="label">Friends Referred</span>
                        <span class="value">${stats.usedCount}</span>
                    </div>
                    <div class="stat">
                        <span class="label">Total Rewards</span>
                        <span class="value">${stats.totalRewards} points</span>
                    </div>
                </div>
                <p class="share-text">Share your code to get 5 bonus points per referral!</p>
                <button class="btn-primary" onclick="shareReferralCode('${stats.code}')">Share with Friends</button>
            </div>
        `;

        container.innerHTML = html;
    }

    // Save group bookings
    saveGroupBookings() {
        localStorage.setItem('group-bookings', JSON.stringify(this.groupBookings));
    }

    // Save referrals
    saveReferrals() {
        localStorage.setItem('referrals', JSON.stringify(this.referrals));
    }

    // Save rewards
    saveRewards() {
        localStorage.setItem('referral-rewards', JSON.stringify(this.rewards));
    }

    // Get user rewards
    getUserRewards(userId = null) {
        const id = userId || localStorage.getItem('user_id');
        return this.rewards.filter(r => r.userId === id);
    }

    // Get total reward value
    getTotalRewardValue(userId = null) {
        const rewards = this.getUserRewards(userId);
        return rewards.reduce((sum, r) => sum + r.amount, 0);
    }
}

const groupBookingReferralManager = new GroupBookingReferralManager();
