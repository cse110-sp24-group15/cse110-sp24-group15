// Import the functions
const {updateCalendar, switchWeekly, switchMonthly, redirectToAddLogPage, redirectToDayPage, calendarScript, init, formatDateToMMDDYYYY} = require('../dayPage/day_page');

// Mock the alert function
global.alert = jest.fn();

// Mock the global window object
global.window = {
  location: {
    href: ''
  }
};

// Mock the localStorage
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};

// Mock the document.getElementById
global.document = {
  getElementById: jest.fn((id) => {
    const elements = {
      "log-title": { value: 'Sample Title' },
      "log-time": { value: '12:00' },
      "log-contributor": { value: 'John Doe' },
      "log-description": { value: 'Sample Description' },
    };
    return elements[id];
  })
};


describe('Click week button', () => {
  test('Window redirects to week page when switchWeekly is called', () => {
    switchWeekly();

    // Ensure window.location.href is set to the day page URL
    expect(window.location.href).toBe('/../weekPage/week_page.html');
  });
});

describe('Click month button', () => {
  test('Window redirects to month page when switchMonthly is called', () => {
    switchMonthly();

    // Ensure window.location.href is set to the day page URL
    expect(window.location.href).toBe('/../project/dummyMonthPage/month.html');
  });
});

// describe('Click add log button', () => {
//   test('Window redirects to add log page when redirectToAddLogPage is called', () => {
//     redirectToAddLogPage();

//     // Ensure window.location.href is set to the add log page URL
//     expect(window.location.href).toBe('/../project/addPage/addPage.html');
//   });
// });

