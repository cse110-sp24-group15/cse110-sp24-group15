describe('homePage.js', () => {
  let page;

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto('http://127.0.0.1:5500/project/homePage/homePage.html');
  });

  afterAll(async () => {
    await page.close();
  });

  describe('renderProjects()', () => {
    it('should render the dummy projects on page load', async () => {
      const projectsList = await page.$('.projects');
      const projectCount = await page.evaluate((projectsList) => projectsList.children.length, projectsList);
      expect(projectCount).toBe(2);
    });

    it('should not render archived projects', async () => {
      // Archive a project
      await page.evaluate(() => {
        const projectData = JSON.parse(localStorage.getItem('projectData'));
        projectData.project_data.project_1.active = false;
        localStorage.setItem('projectData', JSON.stringify(projectData));
      });

      // Reload the page to trigger renderProjects()
      await page.reload();

      const projectsList = await page.$('.projects');
      const projectCount = await page.evaluate((projectsList) => projectsList.children.length, projectsList);
      expect(projectCount).toBe(1);
    });
  });

  describe('createProjectElement()', () => {
    it('should create a project element with correct structure', async () => {
      const projectElement = await page.evaluate(() => {
        const project = JSON.parse(localStorage.getItem('projectData')).project_data.project_1;
        const projectId = 'project_1';
        return createProjectElement(project, projectId);
      });

      const title = await page.evaluateHandle(() => document.querySelector('h3'), projectElement);
      expect(await page.evaluate((el) => el.textContent, title)).toBe('Project 2');

      const tag = await page.evaluateHandle(() => document.querySelector('p:nth-child(2)'), projectElement);
      expect(await page.evaluate((el) => el.textContent, tag)).toBe('Tag: Tag 2');

      const contributors = await page.evaluateHandle(() => document.querySelector('p:nth-child(3)'), projectElement);
      expect(await page.evaluate((el) => el.textContent, contributors)).toBe('Contributors: Contributor 3, Contributor 4');

      const description = await page.evaluateHandle(() => document.querySelector('p:nth-child(4)'), projectElement);
      expect(await page.evaluate((el) => el.textContent, description)).toBe('Description: Description for Project 2');

      const actions = await page.evaluateHandle(() => document.querySelector('.project-actions'), projectElement);
      expect(await page.evaluate((el) => el.children.length, actions)).toBe(2);
    });
  });

  describe('archiveProject()', () => {
    it('should archive a project', async () => {
      const projectId = 'project_1';
      await page.evaluate((projectId) => archiveProject(projectId), projectId);

      const projectData = await page.evaluate(() => JSON.parse(localStorage.getItem('projectData')));
      expect(projectData.project_data[projectId].active).toBe(false);
    });
  });

  describe('deleteProject()', () => {
    it('should delete a project', async () => {
      const projectId = 'project_1';
      await page.evaluate((projectId) => deleteProject(projectId), projectId);

      const projectData = await page.evaluate(() => JSON.parse(localStorage.getItem('projectData')));
      expect(projectData.project_data[projectId]).toBeUndefined();
    });
  });

  describe('createProject()', () => {
    it('should redirect to the add project page when clicking the "Add New Project" button', async () => {
      const addProjectButton = await page.$('.add-project-btn');
      await addProjectButton.click();
      await page.waitForNavigation();
      expect(page.url()).toBe('http://127.0.0.1:5500/project/addProjectPage/add_project_page.html');
    });
  });
});