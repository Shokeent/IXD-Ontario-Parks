// User Authentication & Profile Management System

class UserAuthManager {
    constructor() {
        this.currentUser = this.loadUser();
        this.isAuthenticated = !!this.currentUser;
    }

    // Register new user
    async registerUser(email, password, profile = {}) {
        if (!this.validateEmail(email)) {
            return { success: false, error: 'Invalid email format' };
        }

        if (password.length < 8) {
            return { success: false, error: 'Password must be at least 8 characters' };
        }

        const users = this.getAllUsers();
        if (users.find(u => u.email === email)) {
            return { success: false, error: 'Email already registered' };
        }

        const hashedPassword = this.hashPassword(password);
        const user = {
            id: 'user_' + Date.now(),
            email,
            password: hashedPassword,
            firstName: profile.firstName || '',
            lastName: profile.lastName || '',
            phone: profile.phone || '',
            address: profile.address || '',
            city: profile.city || '',
            province: profile.province || '',
            postalCode: profile.postalCode || '',
            preferences: {
                newsletter: profile.newsletter !== false,
                notifications: profile.notifications !== false,
                darkMode: false
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));

        return { success: true, userId: user.id };
    }

    // Login user
    async loginUser(email, password) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return { success: false, error: 'User not found' };
        }

        if (!this.verifyPassword(password, user.password)) {
            return { success: false, error: 'Invalid password' };
        }

        const token = this.generateSessionToken(user.id);
        localStorage.setItem('auth_token', token);
        localStorage.setItem('current_user', JSON.stringify(user));

        this.currentUser = user;
        this.isAuthenticated = true;

        return { success: true, user, token };
    }

    // Logout user
    logoutUser() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        this.currentUser = null;
        this.isAuthenticated = false;
        return { success: true };
    }

    // Get current user profile
    getCurrentUser() {
        return this.currentUser;
    }

    // Update user profile
    async updateProfile(updates) {
        if (!this.isAuthenticated) {
            return { success: false, error: 'Not authenticated' };
        }

        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);

        if (userIndex === -1) {
            return { success: false, error: 'User not found' };
        }

        const allowedFields = ['firstName', 'lastName', 'phone', 'address', 'city', 'province', 'postalCode'];
        allowedFields.forEach(field => {
            if (updates[field] !== undefined) {
                users[userIndex][field] = updates[field];
            }
        });

        users[userIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('users', JSON.stringify(users));

        this.currentUser = users[userIndex];
        localStorage.setItem('current_user', JSON.stringify(this.currentUser));

        return { success: true, user: this.currentUser };
    }

    // Update preferences
    updatePreferences(preferences) {
        if (!this.isAuthenticated) {
            return { success: false, error: 'Not authenticated' };
        }

        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);

        if (userIndex !== -1) {
            users[userIndex].preferences = {
                ...users[userIndex].preferences,
                ...preferences
            };
            localStorage.setItem('users', JSON.stringify(users));

            this.currentUser = users[userIndex];
            localStorage.setItem('current_user', JSON.stringify(this.currentUser));
        }

        return { success: true, preferences: this.currentUser.preferences };
    }

    // Get user booking history
    getUserBookings() {
        if (!this.isAuthenticated) {
            return [];
        }

        const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        return allBookings.filter(b => b.userId === this.currentUser.id);
    }

    // Add booking to user profile
    addBooking(bookingData) {
        if (!this.isAuthenticated) {
            return { success: false, error: 'Not authenticated' };
        }

        const booking = {
            ...bookingData,
            userId: this.currentUser.id,
            createdAt: new Date().toISOString()
        };

        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        bookings.push(booking);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        return { success: true, booking };
    }

    // Get user saved preferences (favorite parks)
    getSavedParks() {
        if (!this.isAuthenticated) {
            return [];
        }

        const saved = localStorage.getItem(`saved_parks_${this.currentUser.id}`);
        return saved ? JSON.parse(saved) : [];
    }

    // Save park to favorites
    saveParks(parkIds) {
        if (!this.isAuthenticated) {
            return { success: false, error: 'Not authenticated' };
        }

        const saved = Array.isArray(parkIds) ? parkIds : [parkIds];
        localStorage.setItem(`saved_parks_${this.currentUser.id}`, JSON.stringify(saved));

        return { success: true, saved };
    }

    // Change password
    async changePassword(oldPassword, newPassword) {
        if (!this.isAuthenticated) {
            return { success: false, error: 'Not authenticated' };
        }

        if (!this.verifyPassword(oldPassword, this.currentUser.password)) {
            return { success: false, error: 'Current password is incorrect' };
        }

        if (newPassword.length < 8) {
            return { success: false, error: 'New password must be at least 8 characters' };
        }

        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);

        if (userIndex !== -1) {
            users[userIndex].password = this.hashPassword(newPassword);
            localStorage.setItem('users', JSON.stringify(users));

            this.currentUser = users[userIndex];
            localStorage.setItem('current_user', JSON.stringify(this.currentUser));
        }

        return { success: true };
    }

    // Password reset request
    async requestPasswordReset(email) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            return { success: false, error: 'Email not found' };
        }

        const resetToken = this.generateResetToken();
        localStorage.setItem(`reset_token_${user.id}`, resetToken);

        return { success: true, resetToken };
    }

    // Reset password with token
    async resetPassword(userId, resetToken, newPassword) {
        const savedToken = localStorage.getItem(`reset_token_${userId}`);

        if (savedToken !== resetToken) {
            return { success: false, error: 'Invalid or expired reset token' };
        }

        if (newPassword.length < 8) {
            return { success: false, error: 'Password must be at least 8 characters' };
        }

        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id === userId);

        if (userIndex !== -1) {
            users[userIndex].password = this.hashPassword(newPassword);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.removeItem(`reset_token_${userId}`);

            return { success: true };
        }

        return { success: false, error: 'User not found' };
    }

    // Helper methods
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    hashPassword(password) {
        // Simple hash for demo - use bcrypt in production
        return btoa(password + 'salt_ontario_parks_2026');
    }

    verifyPassword(password, hash) {
        return this.hashPassword(password) === hash;
    }

    generateSessionToken(userId) {
        return 'token_' + userId + '_' + Math.random().toString(36).substring(2, 15);
    }

    generateResetToken() {
        return 'reset_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    }

    loadUser() {
        const stored = localStorage.getItem('current_user');
        return stored ? JSON.parse(stored) : null;
    }

    getAllUsers() {
        const stored = localStorage.getItem('users');
        return stored ? JSON.parse(stored) : [];
    }

    // Demo: Create test accounts
    createDemoAccounts() {
        const demoUsers = [
            {
                id: 'user_demo_1',
                email: 'john@example.com',
                password: this.hashPassword('password123'),
                firstName: 'John',
                lastName: 'Smith',
                phone: '416-555-0123',
                address: '123 Main St',
                city: 'Toronto',
                province: 'ON',
                postalCode: 'M5H 2N2',
                preferences: { newsletter: true, notifications: true, darkMode: false },
                createdAt: new Date().toISOString()
            },
            {
                id: 'user_demo_2',
                email: 'sarah@example.com',
                password: this.hashPassword('password123'),
                firstName: 'Sarah',
                lastName: 'Johnson',
                phone: '905-555-0456',
                address: '456 Oak Ave',
                city: 'Mississauga',
                province: 'ON',
                postalCode: 'L5H 3A1',
                preferences: { newsletter: false, notifications: true, darkMode: false },
                createdAt: new Date().toISOString()
            }
        ];

        const existing = this.getAllUsers();
        const merged = [...existing, ...demoUsers.filter(d => !existing.find(e => e.email === d.email))];
        localStorage.setItem('users', JSON.stringify(merged));

        return demoUsers;
    }
}

const authManager = new UserAuthManager();
