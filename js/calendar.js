// Real-time Availability Calendar
// Interactive booking calendar with live availability updates

class AvailabilityCalendar {
    constructor() {
        this.bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        this.availability = new Map();
        this.initializeCalendar();
    }

    // Initialize calendar data
    initializeCalendar() {
        const today = new Date();
        const sixMonthsFromNow = new Date(today.getTime() + 180 * 24 * 60 * 60 * 1000);

        for (let d = new Date(today); d <= sixMonthsFromNow; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            this.availability.set(dateStr, {
                available: true,
                bookedSites: 0,
                totalSites: 50,
                occupancyRate: 0
            });
        }
    }

    // Update availability based on bookings
    updateAvailability(parkId) {
        const parkBookings = this.bookings.filter(b => b.parkId === parkId);

        parkBookings.forEach(booking => {
            if (booking.status === 'confirmed') {
                const startDate = new Date(booking.checkIn);
                const endDate = new Date(booking.checkOut);

                for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
                    const dateStr = d.toISOString().split('T')[0];
                    const dayData = this.availability.get(dateStr);

                    if (dayData) {
                        dayData.bookedSites = (dayData.bookedSites || 0) + 1;
                        dayData.occupancyRate = (dayData.bookedSites / dayData.totalSites) * 100;
                        dayData.available = dayData.bookedSites < dayData.totalSites;
                    }
                }
            }
        });
    }

    // Get calendar for month
    getMonthCalendar(year, month) {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();

        const calendar = [];
        let week = [];

        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay.getDay(); i++) {
            week.push(null);
        }

        // Add days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = date.toISOString().split('T')[0];
            const dayData = this.availability.get(dateStr);

            week.push({
                day,
                dateStr,
                available: dayData?.available ?? true,
                occupancyRate: dayData?.occupancyRate ?? 0,
                bookedSites: dayData?.bookedSites ?? 0,
                totalSites: dayData?.totalSites ?? 50
            });

            if (week.length === 7) {
                calendar.push(week);
                week = [];
            }
        }

        // Fill remaining cells
        if (week.length > 0) {
            while (week.length < 7) {
                week.push(null);
            }
            calendar.push(week);
        }

        return calendar;
    }

    // Check if date range is available
    isDateRangeAvailable(parkId, startDate, endDate) {
        this.updateAvailability(parkId);

        const start = new Date(startDate);
        const end = new Date(endDate);

        for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            const dayData = this.availability.get(dateStr);

            if (!dayData || !dayData.available) {
                return { available: false, firstUnavailableDate: dateStr };
            }
        }

        return { available: true };
    }

    // Get next available dates
    getNextAvailableDates(parkId, limit = 5) {
        this.updateAvailability(parkId);

        const available = [];
        const sortedDates = Array.from(this.availability.entries())
            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB));

        for (const [dateStr, data] of sortedDates) {
            if (data.available && available.length < limit) {
                available.push({
                    date: dateStr,
                    occupancyRate: data.occupancyRate,
                    availableSites: data.totalSites - data.bookedSites
                });
            }
        }

        return available;
    }

    // Get occupancy forecast
    getOccupancyForecast(parkId, daysAhead = 30) {
        this.updateAvailability(parkId);

        const forecast = [];
        const today = new Date();

        for (let i = 0; i < daysAhead; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];
            const dayData = this.availability.get(dateStr);

            if (dayData) {
                forecast.push({
                    date: dateStr,
                    occupancyRate: dayData.occupancyRate,
                    bookedSites: dayData.bookedSites,
                    availableSites: dayData.totalSites - dayData.bookedSites,
                    status: dayData.occupancyRate > 80 ? 'high' : dayData.occupancyRate > 50 ? 'medium' : 'low'
                });
            }
        }

        return forecast;
    }

    // Get busiest weeks
    getBusiestWeeks(parkId, weeksAhead = 12) {
        this.updateAvailability(parkId);

        const weeks = [];
        const today = new Date();

        for (let week = 0; week < weeksAhead; week++) {
            const weekStart = new Date(today);
            weekStart.setDate(weekStart.getDate() + week * 7);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 7);

            let totalOccupancy = 0;
            let dayCount = 0;

            for (let d = new Date(weekStart); d < weekEnd; d.setDate(d.getDate() + 1)) {
                const dateStr = d.toISOString().split('T')[0];
                const dayData = this.availability.get(dateStr);

                if (dayData) {
                    totalOccupancy += dayData.occupancyRate;
                    dayCount++;
                }
            }

            const avgOccupancy = dayCount > 0 ? totalOccupancy / dayCount : 0;

            weeks.push({
                weekStart: weekStart.toISOString().split('T')[0],
                weekEnd: weekEnd.toISOString().split('T')[0],
                averageOccupancy: avgOccupancy.toFixed(1),
                isBusy: avgOccupancy > 70
            });
        }

        return weeks;
    }

    // Render calendar HTML
    renderCalendar(year, month, containerId = 'calendar') {
        const calendar = this.getMonthCalendar(year, month);
        const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        let html = `<div class="calendar"><h3>${monthName}</h3><table>`;
        html += '<tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>';

        calendar.forEach(week => {
            html += '<tr>';
            week.forEach(day => {
                if (day) {
                    const occupied = ((day.bookedSites / day.totalSites) * 100).toFixed(0);
                    const statusClass = day.available ? 'available' : 'unavailable';
                    html += `
                        <td class="${statusClass}" data-date="${day.dateStr}">
                            <div class="day">${day.day}</div>
                            <div class="occupancy">${occupied}%</div>
                        </td>
                    `;
                } else {
                    html += '<td class="empty"></td>';
                }
            });
            html += '</tr>';
        });

        html += '</table></div>';

        if (document.getElementById(containerId)) {
            document.getElementById(containerId).innerHTML = html;
        }

        return html;
    }
}

const availabilityCalendar = new AvailabilityCalendar();
