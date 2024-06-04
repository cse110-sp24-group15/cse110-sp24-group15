const puppeteer = require('puppeteer');

describe('Archive Page Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false // Set to true for headless mode
    });
    page = await browser.newPage();
    await page.goto('http://127.0.0.1:5500/project/archivePage/archive_page.html');
  });

  afterAll(async () => {
    await browser.close();
  });

  test('should initialize localStorage with mock project data', async () => {

    // Wait for the project list container to be rendered
    await page.waitForSelector('.project-list');

    // Create mock project data
    const mockProjects = [];
    for (let i = 1; i <= 10; i++) {
      const projectName = `Project ${i}`;
      const active = [3, 6, 9].includes(i); // Set active to true for projects 3, 6, and 9
      const projectData = {
        projectName,
        active,
        // Add other arbitrary data values as needed
      };
      mockProjects.push(projectData);
    }

    // Set up localStorage with mock project data
    await page.evaluate((mockProjects) => {
      const testData = {
        current_project: 'project_1', // Set current project to project_1
        current_date: '06/03/2024', // Set current date
        project_data: mockProjects.reduce((acc, project, index) => {
          acc[`project_${index + 1}`] = project;
          return acc;
        }, {})
      };
      localStorage.setItem('project_data', JSON.stringify(testData));
    }, mockProjects);

    // Reload the page to trigger the loadProjects function
    await page.reload();

    // Retrieve mock project data from localStorage
    const localStorageData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('project_data'));
    });

    // Verify that localStorage contains the correct number of projects
    expect(Object.keys(localStorageData.project_data).length).toBe(10);

    // Verify that active status is set correctly for projects 3, 6, and 9
    expect(localStorageData.project_data.project_3.active).toBe(true);
    expect(localStorageData.project_data.project_6.active).toBe(true);
    expect(localStorageData.project_data.project_9.active).toBe(true);
  });

  test('should load projects onto the page', async () => {
    // Get the number of projects displayed on the first page using $$eval
    const numProjects = await page.$$eval('.project-list .project', projects => projects.length);
  
    // Verify that the correct number of projects is displayed
    expect(numProjects).toBe(5); // Assuming the first page displays 5 projects
  });

  test('should navigate to the next page and update session storage and project display', async () => {
    // Click on the next page button
    await page.click('.page-next-btn');
    await page.click('.page-next-btn');

    // Wait for a brief moment for the page to update
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get the current page number from sessionStorage
    const currentPageNumber = await page.evaluate(() => sessionStorage.getItem('current_page'));

    // Verify that the current page number matches the expected value
    expect(parseInt(currentPageNumber)).toBe(2);

    // Get the number of projects displayed on the page
    const numProjects = await page.$$eval('.project-list .project', projects => projects.length);

    // Get the total number of archived projects from sessionStorage
    const totalProjects = await page.evaluate(() => JSON.parse(sessionStorage.getItem('archived_projects')).length);

    // Calculate the expected number of projects displayed on the current page
    const expectedNumProjects = totalProjects % 5 === 0 ? 5 : totalProjects % 5;

    // Verify that the number of projects displayed matches the expected value
    expect(numProjects).toBe(expectedNumProjects);
  });

  test('should navigate to the previous page and update session storage and project display', async () => {
    // Click on the page back button twice
    await page.click('.page-back-btn');
    await page.click('.page-back-btn');

    // Wait for a brief moment for the page to update
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get the current page number from sessionStorage
    const currentPageNumber = await page.evaluate(() => sessionStorage.getItem('current_page'));

    // Verify that the current page number matches the expected value
    expect(parseInt(currentPageNumber)).toBe(1);

    // Get the number of projects displayed on the page
    const numProjects = await page.$$eval('.project-list .project', projects => projects.length);

    // Get the total number of archived projects from sessionStorage
    const totalProjects = await page.evaluate(() => JSON.parse(sessionStorage.getItem('archived_projects')).length);

    // Calculate the expected number of projects displayed on the current page
    const projectsPerPage = 5;
    const expectedNumProjects = totalProjects < projectsPerPage ? totalProjects : projectsPerPage;

    // Verify that the number of projects displayed matches the expected value
    expect(numProjects).toBe(expectedNumProjects);
  });

  test('should navigate to the correct page when searching for Project 10 and update session storage', async () => {
    // Type "Project 10" into the search bar
    await page.type('#search-bar', 'Project 10');

    // Press Enter to trigger the search
    await page.keyboard.press('Enter');

    // Wait for a brief moment for the page to update
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get the text input value from the search bar
    const searchBarValue = await page.$eval('#search-bar', input => input.value);

    // Verify that the text input matches the searched project name
    const projectNamesOnPage = await page.$$eval('.project-list .project span', projects =>
        projects.map(project => project.textContent)
    );
    expect(projectNamesOnPage).toContain(searchBarValue);

    // Get the current page number from sessionStorage
    const currentPageNumber = await page.evaluate(() => sessionStorage.getItem('current_page'));

    // Find the expected page number for "Project 10"
    const totalProjects = await page.evaluate(() => JSON.parse(sessionStorage.getItem('archived_projects')).length);
    const projectsPerPage = 5;
    const projectIndex = await page.evaluate(() => {
        const projects = JSON.parse(sessionStorage.getItem('archived_projects'));
        return projects.findIndex(([key, project]) => project.projectName === 'Project 10');
    });
    const expectedPageNumber = Math.floor(projectIndex / projectsPerPage) + 1;

    // Verify that the current page number matches the expected value
    expect(parseInt(currentPageNumber)).toBe(expectedPageNumber);

    // Clear the search bar
    await page.evaluate(() => {
      document.getElementById('search-bar').value = '';
    });
  });

  test('should navigate to the correct page when searching for Project 4 and update session storage', async () => {
    // Type "Project 4" into the search bar
    await page.type('#search-bar', 'Project 4');

    // Press Enter to trigger the search
    await page.keyboard.press('Enter');

    // Wait for a brief moment for the page to update
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get the text input value from the search bar
    const searchBarValue = await page.$eval('#search-bar', input => input.value);

    // Verify that the text input matches the searched project name
    const projectNamesOnPage = await page.$$eval('.project-list .project span', projects =>
        projects.map(project => project.textContent)
    );
    expect(projectNamesOnPage).toContain(searchBarValue);

    // Get the current page number from sessionStorage
    const currentPageNumber = await page.evaluate(() => sessionStorage.getItem('current_page'));

    // Find the expected page number for "Project 4"
    const totalProjects = await page.evaluate(() => JSON.parse(sessionStorage.getItem('archived_projects')).length);
    const projectsPerPage = 5;
    const projectIndex = await page.evaluate(() => {
        const projects = JSON.parse(sessionStorage.getItem('archived_projects'));
        return projects.findIndex(([key, project]) => project.projectName === 'Project 4');
    });
    const expectedPageNumber = Math.floor(projectIndex / projectsPerPage) + 1;

    // Verify that the current page number matches the expected value
    expect(parseInt(currentPageNumber)).toBe(expectedPageNumber);
    
    // Clear the search bar
    await page.evaluate(() => {
      document.getElementById('search-bar').value = '';
    });
  });

  test('should delete Project 1 and verify it is no longer displayed, in session storage, and local storage', async () => {
    // Assume that you are starting on the correct page where Project 1 is displayed

    // Click on the delete button of Project 1
    await page.evaluate(() => {
        const projects = document.querySelectorAll('.project');
        const project = Array.from(projects).find(proj => proj.textContent.includes('Project 1'));
        if (project) {
            const deleteButton = project.querySelector('.delete-btn');
            deleteButton.click();
        }
    });

    // Wait for a brief moment for the page to update
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify that Project 1 is no longer displayed on the page
    const projectNamesOnPage = await page.$$eval('.project-list .project span', projects =>
        projects.map(project => project.textContent)
    );
    expect(projectNamesOnPage).not.toContain('Project 1');

    // Verify that Project 1 is no longer in session storage
    const archivedProjectsSession = await page.evaluate(() =>
        JSON.parse(sessionStorage.getItem('archived_projects')).map(([key, project]) => project.projectName)
    );
    expect(archivedProjectsSession).not.toContain('Project 1');

    // Verify that Project 1 is no longer in local storage
    const archivedProjectsLocal = await page.evaluate(() => {
        const projData = JSON.parse(localStorage.getItem('project_data'));
        return Object.entries(projData.project_data).filter(([key, project]) => !project.active).map(([key, project]) => project.projectName);
    });
    expect(archivedProjectsLocal).not.toContain('Project 1');
  });

  test('should set current_project in local storage to Project 2 when it is clicked', async () => {
    // Assume that Project 2 is on the current page

    // Click on Project 2
    await page.evaluate(() => {
        const projects = document.querySelectorAll('.project');
        const project = Array.from(projects).find(proj => proj.textContent.includes('Project 2'));
        if (project) {
            project.click();
        }
    });

    // Wait for a brief moment for the click event to process and local storage to update
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify that current_project in local storage is set to Project 2
    const currentProject = await page.evaluate(() => {
        const projData = JSON.parse(localStorage.getItem('project_data'));
        return projData.current_project;
    });

    expect(currentProject).toBe('project_2');  // Assuming the key for Project 2 is 'project_2'
  });
});