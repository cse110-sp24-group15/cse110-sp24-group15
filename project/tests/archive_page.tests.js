// Import the functions from your main script
const { populateProjectList, moveToPreviousPage, moveToNextPage, handleSearch } = require('../archivePage/archive_page');

// Mock localStorage
let localStorageMock = (() => {
  let store = {};
  return {
    getItem: function(key) {
      return store[key];
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    }
  };
})();
global.localStorage = localStorageMock;

describe('Populate Project List', () => {
  it('should populate the project list correctly', () => {
    // Mock project data
    const projectData = {
      project_1: { projectName: 'Project 1', active: true },
      project_2: { projectName: 'Project 2', active: true }
      // Add more sample project data as needed
    };

    // Mock localStorage
    const mockGetItem = jest.fn().mockReturnValueOnce(JSON.stringify(projectData));
    global.localStorage = {
      getItem: mockGetItem
    };

    // Call the function
    populateProjectList(1);

    // Expectations
    const projectListItems = document.querySelectorAll('.ProjectList li');
    expect(projectListItems.length).toBe(Object.keys(projectData).length);
  });
});

describe('Move to Previous Page', () => {
  it('should move to the previous page correctly', () => {
    // Mock sessionStorage
    const mockGetItem = jest.fn().mockReturnValueOnce('2');
    global.sessionStorage = {
      getItem: mockGetItem
    };

    // Call the function
    moveToPreviousPage();

    // Expectations
    expect(sessionStorage.getItem('currentPage')).toBe('1');
  });
});

describe('Move to Next Page', () => {
  it('should move to the next page correctly', () => {
    // Mock sessionStorage
    const mockGetItem = jest.fn().mockReturnValueOnce('1');
    global.sessionStorage = {
      getItem: mockGetItem
    };

    // Call the function
    moveToNextPage();

    // Expectations
    expect(sessionStorage.getItem('currentPage')).toBe('2');
  });
});

describe('Search Functionality', () => {
  it('should search for projects correctly', () => {
    // Mock project data
    const projectData = {
      project_1: { projectName: 'Project 1', active: true },
      project_2: { projectName: 'Project 2', active: true }
      // Add more sample project data as needed
    };

    // Mock localStorage
    const mockGetItem = jest.fn().mockReturnValueOnce(JSON.stringify(projectData));
    global.localStorage = {
      getItem: mockGetItem
    };

    // Call the function
    handleSearch('Project 1');

    // Expectations
    const projectListItems = document.querySelectorAll('.ProjectList li');
    expect(projectListItems.length).toBe(1);
    expect(projectListItems[0].textContent).toContain('Project 1');
  });
});