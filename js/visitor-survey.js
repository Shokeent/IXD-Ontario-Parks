// Visitor Survey & Feedback System
// Post-visit surveys, NPS scoring, satisfaction tracking

class VisitorSurveyManager {
    constructor() {
        this.surveys = JSON.parse(localStorage.getItem('visitor-surveys') || '[]');
        this.responses = JSON.parse(localStorage.getItem('survey-responses') || '[]');
    }

    // Get survey for park
    getSurvey(parkId, type = 'post-visit') {
        const surveys = {
            'post-visit': {
                id: 'post-visit-survey',
                title: 'How was your visit?',
                type: 'post-visit',
                questions: [
                    {
                        id: 'q1',
                        type: 'nps',
                        question: 'How likely are you to recommend this park to a friend?',
                        scale: { min: 0, max: 10, labels: { 0: 'Not at all likely', 10: 'Extremely likely' } }
                    },
                    {
                        id: 'q2',
                        type: 'rating',
                        question: 'How would you rate the overall cleanliness of the park?',
                        scale: { min: 1, max: 5 }
                    },
                    {
                        id: 'q3',
                        type: 'rating',
                        question: 'How would you rate the friendliness of park staff?',
                        scale: { min: 1, max: 5 }
                    },
                    {
                        id: 'q4',
                        type: 'rating',
                        question: 'How satisfied were you with the facilities and amenities?',
                        scale: { min: 1, max: 5 }
                    },
                    {
                        id: 'q5',
                        type: 'multiple-choice',
                        question: 'What activities did you do? (select all that apply)',
                        options: ['Hiking', 'Camping', 'Swimming', 'Canoeing/Kayaking', 'Wildlife viewing', 'Photography', 'Picnicking', 'Fishing']
                    },
                    {
                        id: 'q6',
                        type: 'multiple-choice',
                        question: 'Who did you visit with?',
                        options: ['Solo', 'Partner/spouse', 'Friends', 'Family with kids', 'Large group']
                    },
                    {
                        id: 'q7',
                        type: 'open-text',
                        question: 'What was the highlight of your visit?',
                        maxLength: 500
                    },
                    {
                        id: 'q8',
                        type: 'open-text',
                        question: 'What could we improve?',
                        maxLength: 500
                    }
                ]
            },
            'quick': {
                id: 'quick-survey',
                title: 'Quick Feedback',
                type: 'quick',
                questions: [
                    {
                        id: 'q1',
                        type: 'nps',
                        question: 'How likely are you to recommend this park?',
                        scale: { min: 0, max: 10 }
                    },
                    {
                        id: 'q2',
                        type: 'open-text',
                        question: 'Any quick feedback?',
                        maxLength: 200
                    }
                ]
            },
            'accessibility': {
                id: 'accessibility-survey',
                title: 'Accessibility Feedback',
                type: 'accessibility',
                questions: [
                    {
                        id: 'q1',
                        type: 'rating',
                        question: 'How accessible was the park for your needs?',
                        scale: { min: 1, max: 5 }
                    },
                    {
                        id: 'q2',
                        type: 'multiple-choice',
                        question: 'Which accessibility features did you use?',
                        options: ['Wheelchair paths', 'Accessible restrooms', 'Accessible parking', 'Beach wheelchair', 'Audio guides', 'Braille signage']
                    },
                    {
                        id: 'q3',
                        type: 'open-text',
                        question: 'What accessibility improvements would you suggest?',
                        maxLength: 500
                    }
                ]
            }
        };

        return surveys[type] || surveys['post-visit'];
    }

    // Submit survey response
    submitResponse(parkId, surveyType, answers) {
        const userId = localStorage.getItem('user_id');
        const survey = this.getSurvey(parkId, surveyType);

        // Check if already submitted recently
        const recentResponse = this.responses.find(r =>
            r.parkId === parkId && r.userId === userId &&
            new Date(r.submittedAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        );

        if (recentResponse) {
            return { success: false, error: 'You already submitted feedback for this park this month.' };
        }

        const npsAnswer = answers['q1'];
        const npsCategory = npsAnswer >= 9 ? 'promoter' : npsAnswer >= 7 ? 'passive' : 'detractor';

        const response = {
            id: 'resp_' + Date.now(),
            parkId,
            userId,
            surveyType,
            answers,
            npsScore: npsAnswer || null,
            npsCategory,
            submittedAt: new Date().toISOString(),
            visitDate: new Date().toISOString()
        };

        this.responses.push(response);
        this.saveResponses();

        // Award loyalty points
        if (window.loyaltyRewardsManager) {
            window.loyaltyRewardsManager.earnPoints(20, 'Submitted visitor survey');
        }

        if (window.gaManager) {
            window.gaManager.trackEvent('survey_submitted', {
                park_id: parkId,
                survey_type: surveyType,
                nps_score: npsAnswer,
                nps_category: npsCategory
            });
        }

        return { success: true, response };
    }

    // Get NPS score for park
    getParkNPS(parkId) {
        const parkResponses = this.responses.filter(r => r.parkId === parkId && r.npsScore !== null);

        if (parkResponses.length === 0) return null;

        const promoters = parkResponses.filter(r => r.npsCategory === 'promoter').length;
        const detractors = parkResponses.filter(r => r.npsCategory === 'detractor').length;
        const total = parkResponses.length;

        const nps = Math.round(((promoters - detractors) / total) * 100);

        return {
            score: nps,
            label: nps >= 50 ? 'Excellent' : nps >= 20 ? 'Good' : nps >= 0 ? 'Needs improvement' : 'Poor',
            totalResponses: total,
            promoters: Math.round((promoters / total) * 100),
            passives: Math.round(((total - promoters - detractors) / total) * 100),
            detractors: Math.round((detractors / total) * 100)
        };
    }

    // Get satisfaction stats
    getSatisfactionStats(parkId) {
        const parkResponses = this.responses.filter(r => r.parkId === parkId);
        if (parkResponses.length === 0) return null;

        const avgRatings = {};
        const ratingQuestions = ['q2', 'q3', 'q4'];

        ratingQuestions.forEach(qId => {
            const values = parkResponses.map(r => r.answers[qId]).filter(v => v != null);
            if (values.length > 0) {
                avgRatings[qId] = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
            }
        });

        return {
            totalResponses: parkResponses.length,
            nps: this.getParkNPS(parkId),
            avgRatings,
            commonActivities: this.getCommonActivities(parkResponses),
            visitorTypes: this.getVisitorTypes(parkResponses)
        };
    }

    // Get common activities from responses
    getCommonActivities(responses) {
        const counts = {};
        responses.forEach(r => {
            const activities = r.answers['q5'] || [];
            activities.forEach(a => { counts[a] = (counts[a] || 0) + 1; });
        });
        return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([a, c]) => ({ activity: a, count: c }));
    }

    // Get visitor types
    getVisitorTypes(responses) {
        const counts = {};
        responses.forEach(r => {
            const type = r.answers['q6'];
            if (type) counts[type] = (counts[type] || 0) + 1;
        });
        return counts;
    }

    // Render survey form
    renderSurveyForm(parkId, surveyType = 'post-visit', containerId = 'survey-form') {
        const container = document.getElementById(containerId);
        if (!container) return;

        const survey = this.getSurvey(parkId, surveyType);

        let html = `
            <div class="survey-form">
                <h2>${survey.title}</h2>
                <form id="visitor-survey" onsubmit="visitorSurveyManager.handleSubmit(event, '${parkId}', '${surveyType}')">
        `;

        survey.questions.forEach(q => {
            html += `<div class="survey-question" id="question-${q.id}">
                <label class="question-label">${q.question}</label>`;

            if (q.type === 'nps') {
                html += `<div class="nps-scale">
                    ${Array.from({ length: 11 }, (_, i) => `
                        <label class="nps-option">
                            <input type="radio" name="${q.id}" value="${i}" required>
                            <span>${i}</span>
                        </label>
                    `).join('')}
                    <div class="nps-labels"><span>Not likely</span><span>Extremely likely</span></div>
                </div>`;
            } else if (q.type === 'rating') {
                html += `<div class="star-rating">
                    ${[1,2,3,4,5].map(i => `
                        <label>
                            <input type="radio" name="${q.id}" value="${i}" required>
                            <span class="star">★</span>
                        </label>
                    `).join('')}
                </div>`;
            } else if (q.type === 'multiple-choice') {
                html += `<div class="checkbox-group">
                    ${q.options.map(opt => `
                        <label class="checkbox-option">
                            <input type="checkbox" name="${q.id}" value="${opt}">
                            <span>${opt}</span>
                        </label>
                    `).join('')}
                </div>`;
            } else if (q.type === 'open-text') {
                html += `<textarea name="${q.id}" maxlength="${q.maxLength}"
                    placeholder="Your answer..." rows="3" class="survey-textarea"></textarea>`;
            }

            html += '</div>';
        });

        html += `
                    <button type="submit" class="btn-primary btn-full">Submit Feedback</button>
                </form>
            </div>
        `;

        container.innerHTML = html;
    }

    // Handle form submit
    handleSubmit(event, parkId, surveyType) {
        event.preventDefault();
        const form = event.target;
        const answers = {};

        form.querySelectorAll('[name]').forEach(el => {
            if (el.type === 'checkbox') {
                if (el.checked) {
                    answers[el.name] = answers[el.name] || [];
                    answers[el.name].push(el.value);
                }
            } else if ((el.type === 'radio' && el.checked) || el.type !== 'radio') {
                answers[el.name] = el.type === 'radio' ? parseInt(el.value) : el.value;
            }
        });

        const result = this.submitResponse(parkId, surveyType, answers);

        if (result.success) {
            form.closest('.survey-form').innerHTML = `
                <div class="survey-thankyou">
                    <h2>Thank you! 🎉</h2>
                    <p>Your feedback helps improve Ontario Parks for everyone.</p>
                    <p>+20 loyalty points added to your account.</p>
                </div>
            `;
        } else {
            alert(result.error);
        }
    }

    saveResponses() {
        localStorage.setItem('survey-responses', JSON.stringify(this.responses));
    }
}

const visitorSurveyManager = new VisitorSurveyManager();
