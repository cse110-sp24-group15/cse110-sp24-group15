const puppeteer = require('puppeteer');
const path = require('path'); // Import the path module

(async () => {
    // Launch the browser
    const browser = await puppeteer.launch({ 
        args: [
            '--disable-web-security',
          ],
          headless: false,
    });
    const page = await browser.newPage();

    // Listen for console messages and log them
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    // Listen for errors
    page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

    // Define the path to your home page HTML file
    const homePagePath = path.resolve(__dirname, 'project/homePage/home_page.html');
    const homePageUrl = `file://${homePagePath}`;

    // Go to the home page
    console.log('Navigating to the home page...');
    await page.goto(homePageUrl);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    await page.waitForSelector('.add-project-btn'); // Wait for the "Add New Project" button to be loaded
    console.log('Home page loaded successfully.');

    // Click the "Add New Project" button
    console.log('Clicking the "Add New Project" button...');
    await page.click('.add-project-btn');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second

    // Wait for the navigation to the add project page
    await page.waitForSelector('#project-name'); // Wait for the project name input to be loaded
    console.log('Navigated to the add project page.');

    // Fill in the project details
    console.log('Filling in the project details...');
    await page.type('#project-name', 'Test Project1');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    await page.select('#project-tag', 'development');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    await page.type('#project-contributor', 'Test Contributor1');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    await page.type('#project-description', 'This is a test project description1');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second

    // Submit the form
    console.log('Submitting the form...');
    await page.click('.submit-btn');

    await page.type('#project-name', 'Test Project2');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    await page.select('#project-tag', 'development');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    await page.type('#project-contributor', 'Test Contributor2');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    await page.type('#project-description', 'This is a test project description2');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second

    await page.click('.submit-btn');


    await page.type('#project-name', 'Test Project3');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    await page.select('#project-tag', 'development');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    await page.type('#project-contributor', 'Test Contributor3');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    await page.type('#project-description', 'This is a test project description3');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second

    await page.click('.submit-btn');

    await page.type('#project-name', 'Test Project4');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    await page.select('#project-tag', 'development');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    await page.type('#project-contributor', 'Test Contributor4');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    await page.type('#project-description', 'This is a test project description4');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second

    await page.click('.submit-btn');

    await page.click('.nav-button')

    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 3 seconds to observe the final state

    await page.click('.projects li:nth-child(1) .archive-btn');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    await page.click('.projects li:nth-child(1) .archive-btn');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second

    await page.type('.search', 'Test Project3');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second to allow search to filter projects

    await page.waitForSelector('.archive-page-btn');

    await page.click(".archive-page-btn")

    await new Promise(resolve => setTimeout(resolve, 1000)); 

    await page.type('.search', 'Test Project1');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second to allow search to filter projects

    await page.click('.nav-button')

    await new Promise(resolve => setTimeout(resolve, 1000));

    await page.click('.projects li:nth-child(1)');

    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second

    // Wait for the project home page to load
    await page.waitForSelector('.project-text');
    console.log('Project home page loaded successfully.');

    // Edit the Todo list
    console.log('Editing the Todo list...');
    await page.click('.todo-edit-btn');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    await page.type('.project-todo-list', 'hello');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    await page.click('.todo-edit-btn');
    console.log('Todo list edited successfully.');

    // Edit the Branch link
    console.log('Editing the Branch link...');
    await page.click('.branch-edit-btn');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    await page.type('.project-branch-link', 'world');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second
    await page.click('.branch-edit-btn');
    console.log('Branch link edited successfully.');

    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second


    await page.click('.nav-button')

    await new Promise(resolve => setTimeout(resolve, 1000));
    

    await page.click('.projects li:nth-child(1)');

 
    // Close the browser
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 3 seconds to observe the final state
    await browser.close();
    console.log('Browser closed.');
})();
