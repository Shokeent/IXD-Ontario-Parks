// Review & Rating System
// User reviews, ratings, moderation, and analytics

class ReviewManager {
    constructor() {
        this.reviews = this.loadReviews();
        this.ratings = this.loadRatings();
        this.moderation = new ModerationEngine();
    }

    // Submit review
    async submitReview(parkId, userId, reviewData) {
        const { rating, title, content, visitDate, images = [] } = reviewData;

        // Validate input
        if (!rating || !title || !content) {
            return { success: false, error: 'Missing required fields' };
        }

        if (rating < 1 || rating > 5) {
            return { success: false, error: 'Rating must be 1-5' };
        }

        // Check for spam/inappropriate content
        const moderationResult = await this.moderation.check(content + ' ' + title);
        if (!moderationResult.approved) {
            return {
                success: false,
                error: 'Review flagged: ' + moderationResult.reason,
                flagged: true
            };
        }

        const review = {
            id: 'review_' + Date.now(),
            parkId,
            userId,
            rating,
            title,
            content,
            visitDate: visitDate || new Date().toISOString(),
            images,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            helpful: 0,
            unhelpful: 0,
            verified: false,
            status: 'published'
        };

        this.reviews.push(review);
        this.saveReviews();
        this.updateParkRating(parkId);

        return { success: true, review };
    }

    // Get park reviews
    getParkReviews(parkId, options = {}) {
        const { sortBy = 'recent', limit = 10, offset = 0 } = options;

        let reviews = this.reviews.filter(r => r.parkId === parkId && r.status === 'published');

        // Sort reviews
        switch (sortBy) {
            case 'helpful':
                reviews.sort((a, b) => (b.helpful - b.unhelpful) - (a.helpful - a.unhelpful));
                break;
            case 'highest':
                reviews.sort((a, b) => b.rating - a.rating);
                break;
            case 'lowest':
                reviews.sort((a, b) => a.rating - b.rating);
                break;
            case 'recent':
            default:
                reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        const total = reviews.length;
        const paginated = reviews.slice(offset, offset + limit);

        return { reviews: paginated, total, offset, limit };
    }

    // Rate review helpfulness
    markHelpful(reviewId, helpful = true) {
        const review = this.reviews.find(r => r.id === reviewId);

        if (!review) {
            return { success: false, error: 'Review not found' };
        }

        if (helpful) {
            review.helpful++;
        } else {
            review.unhelpful++;
        }

        this.saveReviews();
        return { success: true, review };
    }

    // Get park rating analytics
    getParkRatingStats(parkId) {
        const parkReviews = this.reviews.filter(r => r.parkId === parkId && r.status === 'published');

        if (parkReviews.length === 0) {
            return {
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
            };
        }

        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let totalRating = 0;

        parkReviews.forEach(review => {
            totalRating += review.rating;
            ratingDistribution[review.rating]++;
        });

        const averageRating = (totalRating / parkReviews.length).toFixed(1);

        return {
            averageRating: parseFloat(averageRating),
            totalReviews: parkReviews.length,
            ratingDistribution,
            percentages: {
                1: ((ratingDistribution[1] / parkReviews.length) * 100).toFixed(1),
                2: ((ratingDistribution[2] / parkReviews.length) * 100).toFixed(1),
                3: ((ratingDistribution[3] / parkReviews.length) * 100).toFixed(1),
                4: ((ratingDistribution[4] / parkReviews.length) * 100).toFixed(1),
                5: ((ratingDistribution[5] / parkReviews.length) * 100).toFixed(1)
            }
        };
    }

    // Update park rating
    updateParkRating(parkId) {
        const stats = this.getParkRatingStats(parkId);
        const parkRating = {
            parkId,
            averageRating: stats.averageRating,
            totalReviews: stats.totalReviews,
            updatedAt: new Date().toISOString()
        };

        const existingRating = this.ratings.find(r => r.parkId === parkId);
        if (existingRating) {
            Object.assign(existingRating, parkRating);
        } else {
            this.ratings.push(parkRating);
        }

        this.saveRatings();
        return parkRating;
    }

    // Get top reviewed parks
    getTopReviewedParks(limit = 10) {
        return this.ratings
            .sort((a, b) => b.averageRating - a.averageRating)
            .slice(0, limit)
            .map(r => ({
                parkId: r.parkId,
                averageRating: r.averageRating,
                totalReviews: r.totalReviews
            }));
    }

    // Report review (spam, inappropriate)
    reportReview(reviewId, reason) {
        const review = this.reviews.find(r => r.id === reviewId);

        if (!review) {
            return { success: false, error: 'Review not found' };
        }

        review.reported = {
            reason,
            reportedAt: new Date().toISOString(),
            status: 'pending'
        };

        this.saveReviews();
        return { success: true };
    }

    // Get user reviews
    getUserReviews(userId) {
        return this.reviews.filter(r => r.userId === userId).sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );
    }

    // Save/load from localStorage
    saveReviews() {
        localStorage.setItem('park_reviews', JSON.stringify(this.reviews));
    }

    loadReviews() {
        const stored = localStorage.getItem('park_reviews');
        return stored ? JSON.parse(stored) : [];
    }

    saveRatings() {
        localStorage.setItem('park_ratings', JSON.stringify(this.ratings));
    }

    loadRatings() {
        const stored = localStorage.getItem('park_ratings');
        return stored ? JSON.parse(stored) : [];
    }
}

// Content Moderation Engine
class ModerationEngine {
    constructor() {
        this.bannedWords = ['spam', 'abuse', 'hate', 'fake'];
        this.minLength = 10;
        this.maxLength = 5000;
    }

    async check(content) {
        // Length check
        if (content.length < this.minLength) {
            return { approved: false, reason: 'Review too short' };
        }

        if (content.length > this.maxLength) {
            return { approved: false, reason: 'Review too long' };
        }

        // Banned words check
        const lowerContent = content.toLowerCase();
        for (const word of this.bannedWords) {
            if (lowerContent.includes(word)) {
                return { approved: false, reason: 'Inappropriate content detected' };
            }
        }

        // All caps check
        const capsRatio = (content.match(/[A-Z]/g) || []).length / content.length;
        if (capsRatio > 0.5) {
            return { approved: false, reason: 'Excessive capitalization' };
        }

        return { approved: true };
    }
}

const reviewManager = new ReviewManager();
