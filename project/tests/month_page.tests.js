const { JSDOM } = require('jsdom');
const path = require('path');

// Import the HTML content from the module
const html = require('../monthlyPage/month_page_html');

// Initialize JSDOM with the HTML content
let dom;
let window;
let document;

beforeAll(() => {
    dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
    window = dom.window;
    document = window.document;
    // Load and execute the external JavaScript file within the JSDOM environment
    require(path.resolve(__dirname, '../monthlyPage/month_page.js'));
});

describe('Calendar Widget', () => {
    let prevButton, nextButton, currentDate, initialDate;

    beforeEach(() => {
        // Set up the DOM elements
        prevButton = document.getElementById('prev');
        nextButton = document.getElementById('next');
        currentDate = new Date();
        initialDate = document.querySelector('.calendar h3').textContent;
    });

    test('should load the current date correctly', () => {
        const loadedDate = document.querySelector('.calendar h3').textContent;
        const expectedDate = currentDate.toDateString();

        console.log('Loaded Date:', loadedDate);
        console.log('Expected Date:', expectedDate);

        expect(loadedDate).toBe(expectedDate);
    });

    test('should navigate back and forth through the calendar', () => {
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