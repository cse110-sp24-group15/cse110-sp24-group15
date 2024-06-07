// Function to render the projects list
function renderProjects() {
    const projectsList = document.querySelector('.projects');
    projectsList.innerHTML = '';

    const projectData = JSON.parse(localStorage.getItem('project_data'));
    let projects = projectData['project_data'];
    for (const projectId in projects) {
        if (projects[String(projectId)] !== null) {
            let project = projects[String(projectId)];
            if (project.active) {
                const projectElement = createProjectElement(project, projectId);
                projectsList.appendChild(projectElement);
            }
        }
    }
};

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
        const projectDataCopy = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('project_data'))));
        projectDataCopy.current_project = projectId;
        projectDataCopy.current_date = new Date().toLocaleDateString();
        localStorage.setItem('project_data', JSON.stringify(projectDataCopy));
        window.location.href = escape("../projectHomePage/project_home_page.html");
    });

    return projectElement;
}

// Function to archive a project
function archiveProject(projectId) {
    let projectDataCopy = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('project_data'))));
    projectDataCopy['project_data'][String(projectId)]['active'] = false;
    localStorage.setItem('project_data', JSON.stringify(projectDataCopy));
    renderProjects();
}

// Function to delete a project
function deleteProject(projectId) {
    let projectDataCopy = JSON.parse(JSON.stringify(JSON.parse(localStorage.getItem('project_data'))));
    let projectData = projectDataCopy.project_data;
    projectId = String(projectId);

    // Create a new object excluding the key to delete
    let newProjectData = Object.keys(projectData).reduce((newData, key) => {
        if (key !== projectId) {
            newData[String(key)] = projectData[String(key)];
        }
        return newData;
    }, {});

    projectDataCopy.project_data = newProjectData;
    localStorage.setItem('project_data', JSON.stringify(projectDataCopy));
    renderProjects();
}


// Render the projects on page load
renderProjects();