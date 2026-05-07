// Backend API Routes - Express.js Reference Implementation
// Copy this to your backend project and adapt for your database

/*
Installation:
npm init -y
npm install express cors dotenv bcryptjs jsonwebtoken stripe nodemailer

Run:
node server.js
*/

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// Auth Middleware
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// ============= USER ENDPOINTS =============

// Register User
app.post('/api/users/register', async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        // Check if user exists (would query database)
        // const existingUser = await User.findOne({ email });
        // if (existingUser) return res.status(400).json({ error: 'Email already registered' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user (would save to database)
        // const user = await User.create({
        //     email,
        //     password: hashedPassword,
        //     firstName,
        //     lastName
        // });

        const user = {
            id: Math.random().toString(36).substr(2, 9),
            email,
            firstName,
            lastName,
            createdAt: new Date()
        };

        res.status(201).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login User
app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        // Find user (would query database)
        // const user = await User.findOne({ email });
        // if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        // Compare password
        // const isValid = await bcrypt.compare(password, user.password);
        // if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

        const user = { id: 'user-123', email };

        // Generate JWT token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '24h' }
        );

        res.json({ success: true, token, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get User Profile
app.get('/api/users/profile', authMiddleware, async (req, res) => {
    try {
        // const user = await User.findById(req.userId);
        const user = { id: req.userId, email: 'user@example.com', firstName: 'John' };

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update User Profile
app.put('/api/users/profile', authMiddleware, async (req, res) => {
    try {
        const { firstName, lastName, phone, address, city } = req.body;

        // Update user (would save to database)
        // const user = await User.findByIdAndUpdate(req.userId, {
        //     firstName, lastName, phone, address, city
        // }, { new: true });

        const user = { id: req.userId, firstName, lastName, phone, address, city };

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============= PARKS ENDPOINTS =============

// Get All Parks
app.get('/api/parks', async (req, res) => {
    try {
        const { difficulty, location } = req.query;

        // Filter parks (would query database)
        // let query = {};
        // if (difficulty) query.difficulty = difficulty;
        // if (location) query.location = new RegExp(location, 'i');
        // const parks = await Park.find(query);

        const parks = [
            {
                id: 'algonquin-park',
                name: 'Algonquin Provincial Park',
                location: 'Huntsville, ON',
                difficulty: 'Easy',
                pricePerNight: 45.99,
                rating: 4.8
            },
            {
                id: 'killarney-park',
                name: 'Killarney Provincial Park',
                location: 'Killarney, ON',
                difficulty: 'Moderate',
                pricePerNight: 39.99,
                rating: 4.6
            }
        ];

        res.json({ success: true, parks });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Park Details
app.get('/api/parks/:parkId', async (req, res) => {
    try {
        const { parkId } = req.params;

        // Get park details (would query database)
        // const park = await Park.findById(parkId);

        const park = {
            id: parkId,
            name: 'Algonquin Provincial Park',
            description: '...',
            amenities: ['Hiking', 'Swimming', 'Fishing'],
            facilities: ['Campground', 'Restaurant', 'Marina'],
            totalSites: 1250
        };

        if (!park) {
            return res.status(404).json({ error: 'Park not found' });
        }

        res.json({ success: true, park });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Check Availability
app.get('/api/parks/:parkId/availability', async (req, res) => {
    try {
        const { parkId } = req.params;
        const { start, end } = req.query;

        // Check availability (would query database)
        // const booked = await Booking.countDocuments({
        //     parkId,
        //     checkIn: { $lt: end },
        //     checkOut: { $gt: start }
        // });

        const totalSites = 1250;
        const bookedSites = Math.floor(Math.random() * 100);
        const availableSites = totalSites - bookedSites;

        res.json({
            success: true,
            available: availableSites > 0,
            availableSites,
            totalSites
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============= BOOKING ENDPOINTS =============

// Create Booking
app.post('/api/bookings', authMiddleware, async (req, res) => {
    try {
        const { parkId, campsiteName, checkIn, checkOut, totalCost, guestName, email } = req.body;

        if (!parkId || !checkIn || !checkOut) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create booking (would save to database)
        // const booking = await Booking.create({
        //     userId: req.userId,
        //     parkId,
        //     campsiteName,
        //     checkIn,
        //     checkOut,
        //     totalCost,
        //     status: 'pending'
        // });

        const confirmationId = 'BOOK-' + Date.now();
        const booking = {
            confirmationId,
            userId: req.userId,
            parkId,
            campsiteName,
            checkIn,
            checkOut,
            totalCost,
            status: 'pending',
            createdAt: new Date()
        };

        res.status(201).json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Booking
app.get('/api/bookings/:bookingId', authMiddleware, async (req, res) => {
    try {
        const { bookingId } = req.params;

        // Get booking (would query database)
        // const booking = await Booking.findById(bookingId);

        const booking = { confirmationId: bookingId, status: 'confirmed' };

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Booking
app.put('/api/bookings/:bookingId', authMiddleware, async (req, res) => {
    try {
        const { bookingId } = req.params;

        // Update booking (would save to database)
        // const booking = await Booking.findByIdAndUpdate(bookingId, req.body, { new: true });

        const booking = { confirmationId: bookingId, ...req.body };

        res.json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Cancel Booking
app.delete('/api/bookings/:bookingId', authMiddleware, async (req, res) => {
    try {
        const { bookingId } = req.params;

        // Cancel booking (would update in database)
        // const booking = await Booking.findByIdAndUpdate(bookingId, { status: 'cancelled' });

        res.json({ success: true, message: 'Booking cancelled' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============= PAYMENT ENDPOINTS =============

// Create Payment Intent
app.post('/api/payments/create-intent', authMiddleware, async (req, res) => {
    try {
        const { amount, currency = 'cad', metadata } = req.body;

        if (!amount) {
            return res.status(400).json({ error: 'Amount required' });
        }

        // Create Stripe payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: currency.toLowerCase(),
            metadata: metadata || {}
        });

        res.json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Confirm Payment
app.post('/api/payments/:paymentIntentId/confirm', authMiddleware, async (req, res) => {
    try {
        const { paymentIntentId } = req.params;

        // Retrieve payment intent
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status === 'succeeded') {
            // Update booking status (would save to database)
            // await Booking.findByIdAndUpdate(bookingId, { status: 'confirmed' });

            res.json({
                success: true,
                status: 'succeeded',
                message: 'Payment confirmed'
            });
        } else {
            res.status(400).json({
                success: false,
                error: 'Payment not completed'
            });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============= EMAIL ENDPOINTS =============

// Send Booking Confirmation
app.post('/api/emails/booking-confirmation', authMiddleware, async (req, res) => {
    try {
        const { email, bookingData } = req.body;

        // Send email (configure with SendGrid/Mailgun)
        // await sendEmail({
        //     to: email,
        //     subject: 'Booking Confirmation',
        //     template: 'booking-confirmation',
        //     data: bookingData
        // });

        res.json({ success: true, message: 'Email sent' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============= HEALTH CHECK =============

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// ============= ERROR HANDLING =============

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ============= START SERVER =============

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
