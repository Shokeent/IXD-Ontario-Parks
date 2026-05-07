// Email Service Integration (SendGrid/Mailgun)
// Configure your email service API key

class EmailServiceManager {
    constructor(apiKey = null, provider = 'sendgrid') {
        this.apiKey = apiKey || localStorage.getItem('email_api_key');
        this.provider = provider || localStorage.getItem('email_provider') || 'sendgrid';
        this.fromEmail = localStorage.getItem('from_email') || 'noreply@ontarioparks.com';
        this.isConfigured = !!this.apiKey;
    }

    // Send booking confirmation email
    async sendBookingConfirmation(email, bookingDetails) {
        if (!this.isConfigured) {
            console.warn('Email service not configured');
            return { success: false, error: 'Email service not configured' };
        }

        const emailContent = this.generateBookingConfirmationEmail(bookingDetails);

        return this.sendEmail({
            to: email,
            subject: `Booking Confirmation - ${bookingDetails.parkName}`,
            html: emailContent.html,
            text: emailContent.text
        });
    }

    // Send reservation summary
    async sendReservationSummary(email, reservationDetails) {
        if (!this.isConfigured) {
            console.warn('Email service not configured');
            return { success: false, error: 'Email service not configured' };
        }

        const emailContent = this.generateReservationEmail(reservationDetails);

        return this.sendEmail({
            to: email,
            subject: 'Your Ontario Parks Reservation Summary',
            html: emailContent.html,
            text: emailContent.text
        });
    }

    // Send newsletter subscription confirmation
    async sendNewsletterConfirmation(email) {
        if (!this.isConfigured) {
            return { success: false, error: 'Email service not configured' };
        }

        const emailContent = this.generateNewsletterConfirmationEmail();

        return this.sendEmail({
            to: email,
            subject: 'Welcome to Ontario Parks Newsletter',
            html: emailContent.html,
            text: emailContent.text
        });
    }

    // Generic email send method
    async sendEmail(emailData) {
        try {
            if (this.provider === 'sendgrid') {
                return await this.sendViaSendGrid(emailData);
            } else if (this.provider === 'mailgun') {
                return await this.sendViaMailgun(emailData);
            }
        } catch (error) {
            console.error('Email send error:', error);
            return { success: false, error: error.message };
        }
    }

    // SendGrid implementation
    async sendViaSendGrid(emailData) {
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                personalizations: [{
                    to: [{ email: emailData.to }],
                    subject: emailData.subject
                }],
                from: { email: this.fromEmail },
                content: [
                    { type: 'text/html', value: emailData.html },
                    { type: 'text/plain', value: emailData.text }
                ],
                reply_to: { email: 'support@ontarioparks.com' }
            })
        });

        if (response.ok) {
            return { success: true };
        } else {
            return { success: false, error: 'SendGrid API error' };
        }
    }

    // Mailgun implementation
    async sendViaMailgun(emailData) {
        const formData = new FormData();
        formData.append('from', this.fromEmail);
        formData.append('to', emailData.to);
        formData.append('subject', emailData.subject);
        formData.append('html', emailData.html);
        formData.append('text', emailData.text);

        const response = await fetch('https://api.mailgun.net/v3/ontarioparks.com/messages', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa('api:' + this.apiKey)
            },
            body: formData
        });

        if (response.ok) {
            return { success: true };
        } else {
            return { success: false, error: 'Mailgun API error' };
        }
    }

    // Generate booking confirmation email
    generateBookingConfirmationEmail(details) {
        const html = `
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto;">
                        <div style="background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1>Booking Confirmation</h1>
                        </div>
                        <div style="border: 1px solid #ddd; padding: 20px; border-radius: 0 0 8px 8px;">
                            <p>Thank you for your reservation!</p>
                            <h3>${details.parkName}</h3>
                            <p><strong>Campsite:</strong> ${details.campsiteName}</p>
                            <p><strong>Check-in:</strong> ${details.checkIn}</p>
                            <p><strong>Check-out:</strong> ${details.checkOut}</p>
                            <p><strong>Total Cost:</strong> $${details.totalCost} CAD</p>
                            <hr>
                            <p><small>Confirmation ID: ${details.confirmationId}</small></p>
                            <p><small>This is an automated message. Please do not reply to this email.</small></p>
                        </div>
                    </div>
                </body>
            </html>
        `;

        const text = `
            Booking Confirmation
            ${details.parkName}
            Campsite: ${details.campsiteName}
            Check-in: ${details.checkIn}
            Check-out: ${details.checkOut}
            Total Cost: $${details.totalCost} CAD
            Confirmation ID: ${details.confirmationId}
        `;

        return { html, text };
    }

    // Generate reservation email
    generateReservationEmail(details) {
        const html = `
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto;">
                        <h2>Your Reservation Summary</h2>
                        <p>Hello ${details.name},</p>
                        <p>Your reservation at ${details.parkName} has been confirmed!</p>
                        <h3>Reservation Details</h3>
                        <ul>
                            <li>Park: ${details.parkName}</li>
                            <li>Location: ${details.location}</li>
                            <li>Check-in: ${details.checkIn}</li>
                            <li>Check-out: ${details.checkOut}</li>
                            <li>Nights: ${details.nights}</li>
                        </ul>
                        <h3>What to Bring</h3>
                        <p>Visit our <a href="https://ontarioparks.com/gear-list.html">Gear Guide</a> for a complete packing list.</p>
                    </div>
                </body>
            </html>
        `;

        const text = `Your Reservation Summary\nHello ${details.name},\nYour reservation at ${details.parkName} has been confirmed!`;

        return { html, text };
    }

    // Generate newsletter confirmation email
    generateNewsletterConfirmationEmail() {
        const html = `
            <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <div style="max-width: 600px; margin: 0 auto;">
                        <h2>Welcome to Ontario Parks Newsletter!</h2>
                        <p>Thank you for subscribing to our newsletter.</p>
                        <p>You'll now receive monthly tips, seasonal park highlights, and exclusive first-timer guides.</p>
                        <p>Get ready to explore Ontario's natural beauty!</p>
                    </div>
                </body>
            </html>
        `;

        return { html, text: 'Welcome to Ontario Parks Newsletter!' };
    }
}

// Initialize email service globally
const emailManager = new EmailServiceManager();
