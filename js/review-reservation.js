// Review Reservation Details Pages JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Determine which page we're on and initialize accordingly
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'review-reservation-customer.html':
            initCustomerDetailsPage();
            break;
        case 'review-reservation-cart.html':
            initShoppingCartPage();
            break;
        case 'review-reservation-final.html':
            initFinalReviewPage();
            break;
    }
});

// Customer Details Page Functions
function initCustomerDetailsPage() {
    const form = document.getElementById('customerForm');
    const continueBtn = document.getElementById('continueBtn');
    
    // Load existing data if available
    loadCustomerData();
    
    // Form validation
    const inputs = form.querySelectorAll('input[required], select[required]');
    inputs.forEach(input => {
        input.addEventListener('input', validateCustomerForm);
        input.addEventListener('blur', validateCustomerForm);
    });
    
    // Password confirmation validation
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    
    confirmPassword.addEventListener('input', function() {
        if (this.value !== password.value) {
            this.setCustomAttribute('data-error', 'Passwords do not match');
            this.style.borderColor = '#ef4444';
        } else {
            this.removeAttribute('data-error');
            this.style.borderColor = '#d1d5db';
        }
        validateCustomerForm();
    });
    
    // Form submission
    continueBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (validateCustomerForm()) {
            saveCustomerData();
            window.location.href = 'review-reservation-cart.html';
        }
    });
}

function validateCustomerForm() {
    const form = document.getElementById('customerForm');
    const continueBtn = document.getElementById('continueBtn');
    const inputs = form.querySelectorAll('input[required], select[required]');
    
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(input.value)) {
                isValid = false;
                input.style.borderColor = '#ef4444';
            } else {
                input.style.borderColor = '#d1d5db';
            }
        }
        
        // Phone validation
        if (input.type === 'tel' && input.value) {
            const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
            if (!phonePattern.test(input.value)) {
                isValid = false;
                input.style.borderColor = '#ef4444';
            } else {
                input.style.borderColor = '#d1d5db';
            }
        }
    });
    
    // Password confirmation check
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    if (password.value !== confirmPassword.value) {
        isValid = false;
    }
    
    continueBtn.disabled = !isValid;
    return isValid;
}

function saveCustomerData() {
    const form = document.getElementById('customerForm');
    const formData = new FormData(form);
    const customerData = {};
    
    for (let [key, value] of formData.entries()) {
        customerData[key] = value;
    }
    
    localStorage.setItem('customerData', JSON.stringify(customerData));
}

function loadCustomerData() {
    const savedData = localStorage.getItem('customerData');
    if (savedData) {
        const customerData = JSON.parse(savedData);
        const form = document.getElementById('customerForm');
        
        Object.keys(customerData).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = customerData[key];
            }
        });
        
        validateCustomerForm();
    }
}

// Shopping Cart Page Functions
function initShoppingCartPage() {
    const modifyBtn = document.querySelector('.modify-booking-btn');
    const proceedBtn = document.getElementById('proceedBtn');
    
    // Load reservation data
    loadReservationData();
    
    // Modify booking functionality
    modifyBtn.addEventListener('click', function() {
        // Navigate back to booking page
        window.location.href = 'booking-campsite.html';
    });
    
    // Proceed to alerts functionality
    proceedBtn.addEventListener('click', function() {
        window.location.href = 'review-reservation-final.html';
    });
    
    // Update pricing dynamically if needed
    updatePricing();
}

function loadReservationData() {
    // This would typically load from localStorage or server
    // For now, we'll use the data already in the HTML
    const reservationData = {
        parkName: "Algonquin Provincial Park",
        campsiteName: "Kiosk",
        checkIn: "3:00 PM",
        checkOut: "1:00 PM",
        guests: 4,
        nights: 1,
        vehicles: 1,
        site: "K14",
        dates: "Fri, Jul 12 - Sat, Jul 13",
        campsitePrice: 37.50,
        setupFee: 9.73,
        subtotal: 47.23,
        hst: 6.14,
        total: 53.37
    };
    
    localStorage.setItem('reservationData', JSON.stringify(reservationData));
}

function updatePricing() {
    const reservationData = JSON.parse(localStorage.getItem('reservationData') || '{}');
    
    // Update pricing elements if they exist
    const campsitePrice = document.querySelector('.campsite-price');
    const setupFee = document.querySelector('.setup-fee');
    const subtotal = document.querySelector('.subtotal-amount');
    const hst = document.querySelector('.hst-amount');
    const total = document.querySelector('.total-amount');
    
    if (campsitePrice) campsitePrice.textContent = `$${reservationData.campsitePrice?.toFixed(2) || '37.50'}`;
    if (setupFee) setupFee.textContent = `$${reservationData.setupFee?.toFixed(2) || '9.73'}`;
    if (subtotal) subtotal.textContent = `$${reservationData.subtotal?.toFixed(2) || '47.23'}`;
    if (hst) hst.textContent = `$${reservationData.hst?.toFixed(2) || '6.14'}`;
    if (total) total.textContent = `$${reservationData.total?.toFixed(2) || '53.37'}`;
}

// Final Review Page Functions
function initFinalReviewPage() {
    const modifyBtn = document.querySelector('.modify-booking-btn');
    const confirmBtn = document.getElementById('confirmBtn');
    const acknowledgmentCheckbox = document.getElementById('acknowledgment');
    
    // Load and display reservation summary
    loadReservationSummary();
    
    // Modify booking functionality
    modifyBtn.addEventListener('click', function() {
        window.location.href = 'booking-campsite.html';
    });
    
    // Acknowledgment checkbox functionality
    acknowledgmentCheckbox.addEventListener('change', function() {
        confirmBtn.disabled = !this.checked;
    });
    
    // Confirm reservation functionality
    confirmBtn.addEventListener('click', function() {
        if (acknowledgmentCheckbox.checked) {
            processReservation();
        }
    });
    
    // Initialize with disabled confirm button
    confirmBtn.disabled = true;
}

function loadReservationSummary() {
    const reservationData = JSON.parse(localStorage.getItem('reservationData') || '{}');
    const customerData = JSON.parse(localStorage.getItem('customerData') || '{}');
    
    // Update reservation details in the summary
    const parkName = document.querySelector('.park-name');
    const campsiteName = document.querySelector('.campsite-name');
    const checkInTime = document.querySelector('.check-in-time');
    const checkOutTime = document.querySelector('.check-out-time');
    const guestCount = document.querySelector('.guest-count');
    const nightCount = document.querySelector('.night-count');
    const vehicleCount = document.querySelector('.vehicle-count');
    const siteNumber = document.querySelector('.site-number');
    const dateRange = document.querySelector('.date-range');
    
    if (parkName) parkName.textContent = reservationData.parkName || 'Algonquin Provincial Park';
    if (campsiteName) campsiteName.textContent = reservationData.campsiteName || 'Kiosk';
    if (checkInTime) checkInTime.textContent = reservationData.checkIn || '3:00 PM';
    if (checkOutTime) checkOutTime.textContent = reservationData.checkOut || '1:00 PM';
    if (guestCount) guestCount.textContent = reservationData.guests || '4';
    if (nightCount) nightCount.textContent = reservationData.nights || '1';
    if (vehicleCount) vehicleCount.textContent = reservationData.vehicles || '1';
    if (siteNumber) siteNumber.textContent = reservationData.site || 'K14';
    if (dateRange) dateRange.textContent = reservationData.dates || 'Fri, Jul 12 - Sat, Jul 13';
}

function processReservation() {
    // Show loading state
    const confirmBtn = document.getElementById('confirmBtn');
    const originalText = confirmBtn.textContent;
    confirmBtn.textContent = 'Processing...';
    confirmBtn.disabled = true;
    
    // Simulate processing delay
    setTimeout(() => {
        // Generate confirmation number
        const confirmationNumber = generateConfirmationNumber();
        
        // Save final reservation data
        const finalReservation = {
            ...JSON.parse(localStorage.getItem('reservationData') || '{}'),
            ...JSON.parse(localStorage.getItem('customerData') || '{}'),
            confirmationNumber: confirmationNumber,
            bookingDate: new Date().toISOString(),
            status: 'confirmed'
        };
        
        localStorage.setItem('finalReservation', JSON.stringify(finalReservation));
        
        // Show success message
        showConfirmationModal(confirmationNumber);
        
        // Reset button
        confirmBtn.textContent = originalText;
        confirmBtn.disabled = false;
    }, 2000);
}

function generateConfirmationNumber() {
    const prefix = 'ON';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
}

function showConfirmationModal(confirmationNumber) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'confirmation-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <div class="success-icon">✓</div>
                <h2>Reservation Confirmed!</h2>
                <p>Your booking has been successfully confirmed.</p>
                <div class="confirmation-details">
                    <strong>Confirmation Number: ${confirmationNumber}</strong>
                </div>
                <p class="confirmation-note">
                    A confirmation email has been sent to your registered email address.
                    Please save this confirmation number for your records.
                </p>
                <div class="modal-actions">
                    <button onclick="goToHomepage()" class="primary-btn">Return to Homepage</button>
                    <button onclick="printConfirmation()" class="secondary-btn">Print Confirmation</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add modal styles
    const style = document.createElement('style');
    style.textContent = `
        .confirmation-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
        }
        
        .modal-overlay {
            background: rgba(0, 0, 0, 0.5);
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        
        .modal-content {
            background: white;
            border-radius: 12px;
            padding: 40px;
            max-width: 500px;
            width: 100%;
            text-align: center;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .success-icon {
            width: 60px;
            height: 60px;
            background: #10b981;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 30px;
            font-weight: bold;
            margin: 0 auto 20px;
        }
        
        .modal-content h2 {
            color: #1f2937;
            margin: 0 0 16px;
            font-size: 28px;
        }
        
        .modal-content p {
            color: #6b7280;
            margin-bottom: 20px;
            line-height: 1.6;
        }
        
        .confirmation-details {
            background: #f3f4f6;
            padding: 16px;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        .confirmation-details strong {
            color: #1f2937;
            font-size: 18px;
        }
        
        .confirmation-note {
            font-size: 14px;
            color: #6b7280;
        }
        
        .modal-actions {
            display: flex;
            gap: 12px;
            justify-content: center;
            margin-top: 24px;
        }
        
        .primary-btn {
            background: #5b21b6;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px 24px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .primary-btn:hover {
            background: #4c1d95;
        }
        
        .secondary-btn {
            background: transparent;
            color: #374151;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            padding: 12px 24px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .secondary-btn:hover {
            background: #f3f4f6;
        }
    `;
    
    document.head.appendChild(style);
}

// Utility Functions
function goToHomepage() {
    window.location.href = 'index.html';
}

function printConfirmation() {
    const finalReservation = JSON.parse(localStorage.getItem('finalReservation') || '{}');
    
    // Create printable content
    const printContent = `
        <div style="padding: 40px; font-family: Arial, sans-serif;">
            <h1 style="color: #2c5530; text-align: center;">Ontario Parks Reservation Confirmation</h1>
            <hr style="margin: 20px 0;">
            
            <h2>Confirmation Number: ${finalReservation.confirmationNumber}</h2>
            
            <h3>Reservation Details:</h3>
            <p><strong>Park:</strong> ${finalReservation.parkName}</p>
            <p><strong>Campground:</strong> ${finalReservation.campsiteName}</p>
            <p><strong>Site:</strong> ${finalReservation.site}</p>
            <p><strong>Dates:</strong> ${finalReservation.dates}</p>
            <p><strong>Check-in:</strong> ${finalReservation.checkIn}</p>
            <p><strong>Check-out:</strong> ${finalReservation.checkOut}</p>
            <p><strong>Guests:</strong> ${finalReservation.guests}</p>
            <p><strong>Vehicles:</strong> ${finalReservation.vehicles}</p>
            
            <h3>Customer Information:</h3>
            <p><strong>Name:</strong> ${finalReservation.firstName} ${finalReservation.lastName}</p>
            <p><strong>Email:</strong> ${finalReservation.email}</p>
            <p><strong>Phone:</strong> ${finalReservation.phone}</p>
            
            <h3>Total Cost: $${finalReservation.total}</h3>
            
            <p style="margin-top: 40px; font-size: 12px; color: #666;">
                Please present this confirmation at check-in. 
                For questions or changes, contact Ontario Parks customer service.
            </p>
        </div>
    `;
    
    // Open print dialog
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// Phone number formatting
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 6) {
        value = value.substring(0, 3) + '-' + value.substring(3, 6) + '-' + value.substring(6, 10);
    } else if (value.length >= 3) {
        value = value.substring(0, 3) + '-' + value.substring(3);
    }
    input.value = value;
}

// Add phone formatting to phone inputs
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    });
});
