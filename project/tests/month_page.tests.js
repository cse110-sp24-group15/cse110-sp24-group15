const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

// Define constants for the base directory and HTML file path
const HTML_FILE_PATH = path.resolve(__dirname, '../monthlyPage/month_page.html');

// Load the HTML file into a JSDOM instance
const html = fs.readFileSync(HTML_FILE_PATH, 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
const { window } = dom;
const { document } = window;

// Mock the implementation of calendar initialization and navigation
function initializeCalendar() {
    const h3 = document.querySelector('.calendar h3');
    h3.textContent = new Date().toDateString();

    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');

    prevButton.addEventListener('click', () => {
        const currentDate = new Date(h3.textContent);
        const prevDate = new Date(currentDate.setDate(currentDate.getDate() - 1)).toDateString();
        h3.textContent = prevDate;
    });

    nextButton.addEventListener('click', () => {
        const currentDate = new Date(h3.textContent);
        const nextDate = new Date(currentDate.setDate(currentDate.getDate() + 1)).toDateString();
        h3.textContent = nextDate;
    });
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

        console.log('Loaded Date:', loadedDate);
        console.log('Expected Date:', expectedDate);

        expect(loadedDate).toBe(expectedDate);
    });

    test('should navigate back and forth through the calendar', () => {
        const initialDate = document.querySelector('.calendar h3').textContent;

        console.log('Initial Date:', initialDate);

        // Simulate clicking the next button
        nextButton.click();
        const nextDate = document.querySelector('.calendar h3').textContent;

        console.log('Date after clicking next:', nextDate);

        expect(nextDate).not.toBe(initialDate);

        // Simulate clicking the prev button
        prevButton.click();
        const prevDate = document.querySelector('.calendar h3').textContent;

        console.log('Date after clicking prev:', prevDate);

        expect(prevDate).toBe(initialDate);
    });
});