const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Define constants for the base directory and HTML file path
const BASE_DIR = path.resolve(__dirname, '../monthlyPage');
const HTML_FILE = path.join(BASE_DIR, 'month_page.html');

// Ensure the file path is within the expected directory
const normalizedPath = path.normalize(HTML_FILE);
if (!normalizedPath.startsWith(BASE_DIR)) {
    throw new Error('Invalid file path');
}

// Load the HTML file into a JSDOM instance
const html = fs.readFileSync(normalizedPath, 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
const { window } = dom;
const { document } = window;

// Mock the implementation of calendar initialization and navigation
function initializeCalendar() {
    const header = document.querySelector('.calendar h3');
    const dates = document.querySelector('.dates');
    const navs = document.querySelectorAll('#prev, #next');

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    let date = new Date();
    let month = date.getMonth();
    let year = date.getFullYear();

    function renderCalendar() {
        const start = new Date(year, month, 1).getDay();
        const endDate = new Date(year, month + 1, 0).getDate();
        const end = new Date(year, month, endDate).getDay();
        const endDatePrev = new Date(year, month, 0).getDate();

        dates.innerHTML = "";  // Clear previous dates

        // Add dates of previous month
        for (let i = start; i > 0; i--) {
            const li = document.createElement('li');
            li.className = 'inactive';
            li.textContent = endDatePrev - i + 1;
            dates.appendChild(li);
        }

        // Add dates of current month
        for (let i = 1; i <= endDate; i++) {
            const li = document.createElement('li');
            if (i === date.getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
                li.className = 'today';
            }
            li.textContent = i;
            dates.appendChild(li);
        }

        // Add dates of next month
        for (let i = end; i < 6; i++) {
            const li = document.createElement('li');
            li.className = 'inactive';
            li.textContent = i - end + 1;
            dates.appendChild(li);
        }

        header.textContent = `${months[month]} ${year}`;
    }

    navs.forEach((nav) => {
        nav.addEventListener("click", (e) => {
            const btnId = e.target.id;

            if (btnId === "prev" && month === 0) {
                year--;
                month = 11;
            } else if (btnId === "next" && month === 11) {
                year++;
                month = 0;
            } else {
                month = btnId === "next" ? month + 1 : month - 1;
            }

            date = new Date(year, month, new Date().getDate());
            year = date.getFullYear();
            month = date.getMonth();

            renderCalendar();
        });
    });

    renderCalendar();
}

// Call the initialization function as it would be on the actual page load
initializeCalendar();

describe('Calendar Widget', () => {
    let prevButton, nextButton, currentDate;

    beforeAll(() => {
        // Set up the DOM elements
        prevButton = document.getElementById('prev');
        nextButton = document.getElementById('next');
        currentDate = new Date();
    });

    test('should load the current date correctly', () => {
        const loadedDate = document.querySelector('.calendar h3').textContent;
        const expectedDate = currentDate.toDateString();

        expect(loadedDate).toBe(expectedDate);
    });

    test('should navigate back and forth through the calendar', () => {
        const initialDate = document.querySelector('.calendar h3').textContent;

        // Simulate clicking the next button
        nextButton.click();
        const nextDate = document.querySelector('.calendar h3').textContent;

        expect(nextDate).not.toBe(initialDate);

        // Simulate clicking the prev button
        prevButton.click();
        const prevDate = document.querySelector('.calendar h3').textContent;

        expect(prevDate).toBe(initialDate);
    });
});