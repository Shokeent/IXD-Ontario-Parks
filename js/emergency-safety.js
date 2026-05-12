// Emergency & Safety Manager
// Emergency contacts, safety protocols, SOS features

class EmergencySafetyManager {
    constructor() {
        this.emergencyContacts = this.loadEmergencyContacts();
        this.safetyAlerts = JSON.parse(localStorage.getItem('safety-alerts') || '[]');
        this.checkIns = JSON.parse(localStorage.getItem('safety-checkins') || '[]');
        this.tripPlan = JSON.parse(localStorage.getItem('trip-safety-plan') || 'null');
    }

    loadEmergencyContacts() {
        return {
            emergency: {
                number: '911',
                description: 'Emergency Services (Police, Fire, Ambulance)'
            },
            ontarioParksEmergency: {
                number: '1-800-667-1940',
                description: 'Ontario Parks Emergency Line (24/7)'
            },
            ontarioPoisonControl: {
                number: '1-800-268-9017',
                description: 'Ontario Poison Control Centre'
            },
            searchAndRescue: {
                number: '911',
                description: 'Search and Rescue — call 911 and request SAR'
            },
            parkRanger: {
                number: 'varies by park',
                description: 'Contact park office for local ranger number'
            }
        };
    }

    // Create trip safety plan
    createTripSafetyPlan(planData) {
        const {
            parkId,
            startDate,
            endDate,
            groupSize,
            trailIds = [],
            emergencyContact,
            vehicle
        } = planData;

        this.tripPlan = {
            id: 'safety_' + Date.now(),
            parkId,
            startDate,
            endDate,
            groupSize,
            trailIds,
            emergencyContact,
            vehicle,
            checkInSchedule: this.generateCheckInSchedule(startDate, endDate),
            createdAt: new Date().toISOString(),
            status: 'active'
        };

        localStorage.setItem('trip-safety-plan', JSON.stringify(this.tripPlan));

        return this.tripPlan;
    }

    // Generate check-in schedule
    generateCheckInSchedule(startDate, endDate) {
        const schedule = [];
        const start = new Date(startDate);
        const end = new Date(endDate);

        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
            schedule.push({
                date: d.toISOString().split('T')[0],
                time: '18:00',
                completed: false,
                notes: ''
            });
        }

        return schedule;
    }

    // Log check-in
    logCheckIn(notes = '', location = null) {
        const checkIn = {
            id: 'checkin_' + Date.now(),
            timestamp: new Date().toISOString(),
            notes,
            location,
            status: 'safe'
        };

        this.checkIns.push(checkIn);
        localStorage.setItem('safety-checkins', JSON.stringify(this.checkIns));

        if (this.tripPlan) {
            const today = new Date().toISOString().split('T')[0];
            const scheduled = this.tripPlan.checkInSchedule.find(c => c.date === today);
            if (scheduled) {
                scheduled.completed = true;
                scheduled.notes = notes;
                localStorage.setItem('trip-safety-plan', JSON.stringify(this.tripPlan));
            }
        }

        if (window.notificationManager) {
            window.notificationManager.createNotification({
                type: 'safety',
                title: 'Check-in Logged',
                message: `Safety check-in recorded at ${new Date().toLocaleTimeString()}`,
                priority: 'normal'
            });
        }

        return checkIn;
    }

    // Get safety checklist
    getSafetyChecklist(activityType = 'hiking') {
        const checklists = {
            hiking: [
                { item: 'Inform someone of your route and expected return', critical: true },
                { item: 'Carry 2L water per person per day', critical: true },
                { item: 'Pack first aid kit', critical: true },
                { item: 'Download offline maps', critical: true },
                { item: 'Fully charged phone', critical: true },
                { item: 'Check weather forecast', critical: true },
                { item: 'Pack high-energy snacks', critical: false },
                { item: 'Wear appropriate footwear', critical: false },
                { item: 'Carry emergency whistle', critical: false },
                { item: 'Sun protection (hat, sunscreen)', critical: false },
                { item: 'Rain gear', critical: false },
                { item: 'Warm layer even in summer', critical: false }
            ],
            camping: [
                { item: 'Register at park office', critical: true },
                { item: 'Store food in bear-proof containers', critical: true },
                { item: 'Know location of nearest ranger station', critical: true },
                { item: 'Pack first aid kit', critical: true },
                { item: 'Leave trip plan with emergency contact', critical: true },
                { item: 'Carry fire starter (waterproof matches/lighter)', critical: false },
                { item: 'Pack headlamp with spare batteries', critical: false },
                { item: 'Water purification', critical: false },
                { item: 'Navigation tools (map + compass)', critical: false },
                { item: 'Emergency shelter (bivy/emergency blanket)', critical: false }
            ],
            canoeing: [
                { item: 'Wear PFD at all times on water', critical: true },
                { item: 'Check weather and wind forecast', critical: true },
                { item: 'File float plan with park office', critical: true },
                { item: 'Carry dry bags for gear', critical: true },
                { item: 'Know self-rescue techniques', critical: true },
                { item: 'Pack bailer and pump', critical: false },
                { item: 'Carry whistle and signal mirror', critical: false },
                { item: 'Stay within skill level', critical: true },
                { item: 'Pack extra paddle', critical: false }
            ]
        };

        return checklists[activityType] || checklists.hiking;
    }

    // Get wildlife safety tips
    getWildlifeSafetyTips(animal) {
        const tips = {
            bear: [
                'Make noise while hiking to avoid surprising bears',
                'Store all food in bear-proof containers or hang from a tree',
                'Never approach or feed bears',
                'If encountered, speak calmly, back away slowly, never run',
                'Carry bear spray and know how to use it'
            ],
            moose: [
                'Keep 100m distance at all times',
                'Never get between a mother and calf',
                'Back away slowly if a moose charges — find cover behind trees',
                'Be extra cautious during rut season (September-October)'
            ],
            snake: [
                'Watch where you step, especially on rocky terrain',
                'Wear ankle-high boots',
                'Never handle snakes even if they appear dead',
                'If bitten, keep still and call 911 immediately'
            ],
            wasp: [
                'Wear light-coloured clothing',
                'Avoid wearing perfume or strong scents',
                'Keep food covered',
                'If stung multiple times, seek medical attention immediately'
            ]
        };

        return tips[animal] || [];
    }

    // Get lost in park protocol
    getLostProtocol() {
        return {
            title: 'If You Are Lost',
            steps: [
                { step: 1, action: 'STOP — Stay calm and don\'t panic', critical: true },
                { step: 2, action: 'THINK — Retrace your steps mentally', critical: true },
                { step: 3, action: 'OBSERVE — Look for landmarks, listen for water or roads', critical: true },
                { step: 4, action: 'PLAN — Stay put if you told others your plans', critical: true },
                { step: 5, action: 'Signal — Use whistle (3 blasts = emergency), mirror, or bright gear', critical: false },
                { step: 6, action: 'Call 911 if you have signal — stay on the line', critical: false },
                { step: 7, action: 'Stay warm and dry — find or make shelter if night approaches', critical: false }
            ],
            remember: 'Stay in one place — rescuers find you faster if you don\'t keep moving'
        };
    }

    // Get weather safety thresholds
    getWeatherSafetyThresholds() {
        return {
            lightning: {
                warning: 'Seek shelter immediately when thunder is heard',
                rule: '30-30 rule: if thunder within 30s of lightning, stay sheltered 30 min after last thunder'
            },
            heatIndex: {
                caution: 27,
                warning: 32,
                danger: 39,
                actions: {
                    caution: 'Drink extra water, take breaks in shade',
                    warning: 'Limit strenuous activity, watch for heat exhaustion symptoms',
                    danger: 'Avoid outdoor activity; risk of heat stroke'
                }
            },
            windChill: {
                caution: -10,
                warning: -25,
                danger: -40,
                actions: {
                    caution: 'Dress in warm layers, cover extremities',
                    warning: 'Exposed skin can freeze in 10-30 minutes',
                    danger: 'Stay indoors if possible; frostbite risk within minutes'
                }
            }
        };
    }

    // Share location
    shareLocation(emergencyContactPhone) {
        if (!navigator.geolocation) {
            return { success: false, error: 'Geolocation not supported' };
        }

        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const mapsUrl = `https://maps.google.com?q=${latitude},${longitude}`;

            const message = `SAFETY CHECK-IN: I am at ${mapsUrl} — Date: ${new Date().toLocaleString()}`;

            if (navigator.share) {
                navigator.share({ title: 'My Location', text: message, url: mapsUrl });
            } else {
                navigator.clipboard.writeText(message);
                alert('Location copied to clipboard. Share with your emergency contact.');
            }
        });

        return { success: true };
    }

    // Get first aid quick reference
    getFirstAidQuickRef() {
        return [
            {
                situation: 'Cardiac Arrest',
                steps: ['Call 911', 'Start CPR: 30 chest compressions + 2 breaths', 'Use AED if available', 'Continue until help arrives']
            },
            {
                situation: 'Severe Bleeding',
                steps: ['Apply firm direct pressure with clean cloth', 'Elevate limb if possible', 'Do not remove cloth — add more if soaked', 'Call 911 if bleeding doesn\'t stop in 10 min']
            },
            {
                situation: 'Suspected Fracture',
                steps: ['Immobilize with splint (straight stick + bandage)', 'Do not try to straighten', 'Apply ice to reduce swelling', 'Seek medical attention']
            },
            {
                situation: 'Hypothermia',
                steps: ['Move to warm, dry shelter immediately', 'Remove wet clothing', 'Warm core first: trunk, armpits, groin', 'Give warm (not hot) drinks if conscious', 'Call 911 for severe cases']
            },
            {
                situation: 'Anaphylaxis',
                steps: ['Use epinephrine auto-injector (EpiPen) immediately', 'Call 911', 'Lay flat with legs elevated', 'Be ready to give a second dose after 5-10 min']
            }
        ];
    }

    // Render safety dashboard
    renderSafetyDashboard(containerId = 'safety-dashboard') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const lostProtocol = this.getLostProtocol();

        let html = `
            <div class="safety-dashboard">
                <div class="emergency-numbers">
                    <h2>Emergency Contacts</h2>
                    ${Object.entries(this.emergencyContacts).map(([key, contact]) => `
                        <div class="emergency-contact">
                            <a href="tel:${contact.number}" class="phone-number">${contact.number}</a>
                            <span class="contact-desc">${contact.description}</span>
                        </div>
                    `).join('')}
                </div>

                <div class="lost-protocol">
                    <h2>${lostProtocol.title}</h2>
                    <ol>
                        ${lostProtocol.steps.map(s => `
                            <li class="${s.critical ? 'critical' : ''}">${s.action}</li>
                        `).join('')}
                    </ol>
                    <p class="remember-note">${lostProtocol.remember}</p>
                </div>

                <div class="checkin-panel">
                    <h2>Safety Check-in</h2>
                    <button class="btn-primary" onclick="emergencySafetyManager.logCheckIn()">
                        Log Check-in (I am safe)
                    </button>
                    <button class="btn-secondary" onclick="emergencySafetyManager.shareLocation()">
                        Share My Location
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }
}

const emergencySafetyManager = new EmergencySafetyManager();
