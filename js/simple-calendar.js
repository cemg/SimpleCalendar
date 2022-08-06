// Labels for the days of the week
var cal_day_labels = ['Pzr', 'Pzt', 'Sal', 'Çrş', 'Prş', 'Cum', 'Cts'];

// Labels for name of months
var cal_month_labels = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];

// The day counts for each month
var cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// Current date
var cal_current_date = new Date();

// Day counter
var day_number = 0;

// Special day for each month
var special_day = 15;

// Class
function Calendar(month, year, day) {
    this.month = (isNaN(month) || month == null) ? cal_current_date.getMonth() : month - 1;
    this.year = (isNaN(year) || year == null) ? cal_current_date.getFullYear() : year;
    this.day = (isNaN(day) || day == null) ? cal_current_date.getDay() + 1 : day;
    this.html = '';
}

Calendar.prototype.generateHTML = function (shift) {
    shift = (shift || 0) % 7;

    // Get first day of month
    var firstDay = new Date(this.year, this.month, 1);
    var startingDay = firstDay.getDay();

    if (shift > startingDay)
        shift -= 7;

    // Find number of days in month
    var monthLength = cal_days_in_month[this.month];

    // Compensate for leap year
    if (this.month === 1) { // February only!
        if ((this.year % 4 === 0 && this.year % 100 !== 0) || this.year % 400 === 0) {
            monthLength = 29;
        }
    }

    // Header row for month names
    var monthName = cal_month_labels[this.month];
    
    // Html build start
    var html = '<table class="calendar-table">';
    html += '<tr><th colspan="7">' + monthName + "&nbsp;" + this.year + '</th></tr>';
    html += '<tr class="calendar-header">';
    for (var col = 0; col <= 6; col++) {
        html += '<td class="calendar-header-day">';
        html += cal_day_labels[(col + shift + 7) % 7];
        html += '</td>';
    }
    html += '</tr><tr>';

    // Day rows
    var day = 1;
    // This loop is for week rows, max 9 rows
    for (var weekRow = 0; weekRow < 9; weekRow++) {
        // This loop is for days
        for (var j = 0; j <= 6; j++) {

            var date = new Date(this.year, this.month, day, 0, 0, 0, 0);

            // Day cell
            html += '<td class="calendar-day' +
            (day === this.day && cal_current_date.getMonth() === this.month && cal_current_date.year === this.year ? " active" : "") +
            (day === special_day ? " special_day" : "") +
            (date < cal_current_date ? " past" : "") +
            '">';
            if (day <= monthLength && (weekRow > 0 || j + shift >= startingDay)) {
                html += day + "<div class='day_number'>" + (++day_number) + "</div><div class='remain_number'>" + (365 - day_number) + "</div>";
                day++;
            }

            html += '</td>';
        }

        // Stop week rows if we've run out of days
        if (day > monthLength) {
            break;
        } else {
            html += '</tr><tr>';
        }
    }
    html += '</tr></table>';

    this.html = html;
}

Calendar.prototype.getHTML = function () {
    return this.html;
}

Calendar.prototype.getMonthsOfYear = function (year, startMonth, endMonth) {
    year = (isNaN(year) || year == null) ? this.year : year;
    startMonth = (isNaN(startMonth) || startMonth == null) ? 1 : startMonth;
    endMonth = (isNaN(endMonth) || endMonth == null) ? 12 : endMonth;
    for (var m = startMonth; m <= endMonth; m++) {
        var cal = new Calendar(m, year);
        cal.generateHTML(1);
        document.getElementById('calendar_div').innerHTML += cal.getHTML();
    }
}