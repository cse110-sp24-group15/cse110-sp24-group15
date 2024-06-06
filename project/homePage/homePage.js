// Dummy project data
const dummyProjectData = {
    project_data: {
        project_1: {
            projectName: "Project 1",
            projectTag: "Tag 1",
            projectContributors: "Contributor 1, Contributor 2",
            projectDescription: "Description for Project 1",
            active: true,
            logs: {},
            BranchLink: "https://example.com/project1",
            TodoList: {}
        },
        project_2: {
            projectName: "Project 2",
            projectTag: "Tag 2",
            projectContributors: "Contributor 3, Contributor 4",
            projectDescription: "Description for Project 2",
            active: true,
            logs: {},
            BranchLink: "https://example.com/project2",
            TodoList: {}
        }
    }
};

// Initialize the projects data in localStorage
if (!localStorage.getItem('projectData')) {
    localStorage.setItem('projectData', JSON.stringify(dummyProjectData));
}

// Function to render the projects list
function renderProjects() {
    const projectsList = document.querySelector('.projects');
    projectsList.innerHTML = '';

    const projectData = JSON.parse(localStorage.getItem('projectData')).project_data;
    for (const projectId in projectData) {
        const project = projectData[projectId];
        if (project.active) {
            const projectElement = createProjectElement(project, projectId);
            projectsList.appendChild(projectElement);
        }
    }
}

// Function to create a project element
function createProjectElement(project, projectId) {
    const projectElement = document.createElement('li');

    const projectTitle = document.createElement('h3');
    projectTitle.textContent = project.projectName;
    projectElement.appendChild(projectTitle);

    const projectTag = document.createElement('p');
    projectTag.textContent = `Tag: ${project.projectTag}`;
    projectElement.appendChild(projectTag);

    const projectContributors = document.createElement('p');
    projectContributors.textContent = `Contributors: ${project.projectContributors}`;
    projectElement.appendChild(projectContributors);

    const projectDescription = document.createElement('p');
    projectDescription.textContent = `Description: ${project.projectDescription}`;
    projectElement.appendChild(projectDescription);

    const projectActions = document.createElement('div');
    projectActions.classList.add('project-actions');

    const archiveButton = document.createElement('button');
    archiveButton.textContent = 'Archive';
    archiveButton.classList.add('archive-btn');
    archiveButton.addEventListener('click', (event) => {
        event.stopPropagation();
        archiveProject(projectId);
    });
    projectActions.appendChild(archiveButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', (event) => {
        event.stopPropagation();
        deleteProject(projectId);
    });
    projectActions.appendChild(deleteButton);

    projectElement.appendChild(projectActions);
    projectElement.addEventListener('click', () => {
        const projectData = JSON.parse(localStorage.getItem('projectData'));
        projectData.current_project = projectId;
        projectData.current_date = new Date().toLocaleDateString();
        localStorage.setItem('projectData', JSON.stringify(projectData));
        window.location.href = "../projectHomePage/project_home_page.html";
    });

    return projectElement;
}

// Function to archive a project
function archiveProject(projectId) {
    console.log(projectId);
    const projectData = JSON.parse(localStorage.getItem('projectData'));
    projectData.project_data[projectId].active = false;
    localStorage.setItem('projectData', JSON.stringify(projectData));
    renderProjects();
}

// Function to delete a project
function deleteProject(projectId) {
    console.log(projectId);
    const projectData = JSON.parse(localStorage.getItem('projectData'));
    delete projectData.project_data[projectId];
    localStorage.setItem('projectData', JSON.stringify(projectData));
    renderProjects();
}
// Render the projects on page load
renderProjects();
