window.onload = initApp;

var projects = [];
var issues = [];
var users = [];
var sprints = [];

// initial entry point when the DOM loads
function initApp() {
    console.log('app loaded..');
    displayProjects();
    document.getElementById("new-project").onclick = onClickNewProject;
}

// onclick event handler for when creating a new project
function onClickNewProject(e) {
    window.pmApi.createProject();
    console.log("project created...");
    displayProjects();
}

// used to render all projects on the page
function displayProjects() {
    var projects = window.pmApi.getProjects();
    document.getElementById("projects").innerHTML = "";
    projects.forEach(project => {
        createProjectElement(project);
    });
}

// used for issues filtered by their status
function issuesStatusOverview(newProject) {
    // iterate through all statuses possible
    Object.keys(window.pmApi.statuses).forEach(function (statusKey) {
        // filter each issue by its status
        var filteredIssues = issues.filter(function (issue) {
            return issue.status === window.pmApi.statuses[statusKey]
        });

        var issuesDescription = document.createElement("div");
        issuesDescription.innerHTML = statusKey;

        var horizontalLine = document.createElement("hr");
        horizontalLine.classList.add("issue-description");
        issuesDescription.appendChild(horizontalLine);

        newProject.appendChild(issuesDescription);

        // rendered all the filtered issues by status
        filteredIssues.forEach(function (filteredIssue, index) {
            var singleIssue = document.createElement("div");
            singleIssue.innerHTML = filteredIssue.description;
            issuesDescription.appendChild(singleIssue);
            singleIssue.classList.add('align-list-elements');
            if (index === filteredIssues.length - 1) {
                issuesDescription.classList.add("issue-last-element");
            }
        });

        console.log("issues with status: ", statusKey, issues.filter(issue => issue.status === window.pmApi.statuses[statusKey]))
    })
}

// display issues filtered by type
function issuesTypeOverview(newProject, issueType) {
    var issueTypeDescription = document.createElement("div");
    issueTypeDescription.innerHTML = issueType;
    newProject.appendChild(issueTypeDescription);
    var filteredIssues = issues.filter(function (issue) {
        return issue.type === window.pmApi.issueTypes[issueType]
    });
    var horizontalLine = document.createElement("hr");
    horizontalLine.classList.add("issue-description");
    issueTypeDescription.appendChild(horizontalLine);

    // render all filtered issues by type
    filteredIssues.forEach(function (filteredIssue, index) {
        var singleIssue = document.createElement("div");
        singleIssue.innerHTML = filteredIssue.description;
        issueTypeDescription.appendChild(singleIssue);
        if (index === filteredIssues.length - 1) {
            singleIssue.classList.add("issue-last-element");
        }
    });
}

// create a title for each type of filtered issues
function createTitle(project, titleName) {
    var typeOverviewTitle = document.createElement("h5");
    typeOverviewTitle.innerHTML = titleName;
    project.appendChild(typeOverviewTitle);
}

// injects project tags into the DOM
function createProjectElement(project) {
    // header for each project
    var newProject = document.createElement("div");
    var newProjectTitle = document.createElement("div");
    newProjectTitle.innerHTML = "Project id: " + project.id;
    newProject.id = "project-" + project.id;
    newProjectTitle.classList.add("project-description");
    newProject.appendChild(newProjectTitle);

    // display sprint creation form
    var sprintNameInput = document.createElement("input");
    newProject.appendChild(sprintNameInput);
    sprintNameInput.id = "sprintNameInput-" + project.id;
    sprintNameInput.placeholder = "sprint name...";
    sprintNameInput.classList.add("form-control");
    var addNewSprint = document.createElement("button");
    addNewSprint.innerHTML = "Create new sprint";
    addNewSprint.classList.add("btn-secondary");
    newProject.appendChild(addNewSprint);
    var sprintsSection = document.createElement("div");
    sprintsSection.id = "sprints-" + project.id;
    newProject.appendChild(sprintsSection);

    // display the sprints section (when initially loading the page or refreshing)
    displaySprint(project.id, sprintsSection);
    addNewSprint.onclick = function (e) {
        var sprintNameText = document.getElementById("sprintNameInput-" + project.id).value;

        // create the sprint, then recreate the sprint section part so that
        // it rerenders when clicking the add sprint button
        window.pmApi.createSprint(sprintNameText, project.id);
        displaySprint(project.id, sprintsSection);
    };

    document.getElementById("projects").appendChild(newProject);

    createTitle(newProject, "ISSUES BY STATUS");
    issuesStatusOverview(newProject);
    createTitle(newProject, "ISSUES BY TYPE");
    issuesTypeOverview(newProject, window.pmApi.issueTypes.BUG);
    issuesTypeOverview(newProject, window.pmApi.issueTypes.FEATURES);
    issuesTypeOverview(newProject, window.pmApi.issueTypes.TASKS);
}

// used to display the sprint section
function displaySprint(projectId, sprintsSection) {
    sprintsSection.innerHTML = "";
    var filteredSprints = window.pmApi.getSprints(projectId);

    // after fetching the sprints belonging to this project, render them
    filteredSprints.forEach(function (sprint) {
        var newSprint = document.createElement("div");
        var newSprintDescription = document.createElement("a");
        newSprintDescription.href = "./sprints.html?sprintId=" + sprint.id;
        newSprint.classList.add("align-list-elements");
        newSprintDescription.innerHTML = sprint.name;
        newSprint.appendChild(newSprintDescription);
        sprintsSection.appendChild(newSprint);
    });
}