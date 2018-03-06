window.onload = initApp;

function initApp() {
    console.log('app loaded..');

    var users = createMockedUsers(2);

    console.log('creating project...');
    var project1 = createProject();
    console.log('created project: ', project1);

    var sprints = createMockedSprints(4);

    project1 = addSprintToProject(project1, sprints[0].id);
    console.log('project after adding sprint: ', project1);

    project1 = addSprintToProject(project1, sprints[2].id);
    console.log('project after adding sprint: ', project1);

    console.log('creating issue...');
    var bug = createIssue(issueTypes.BUG, "bug 1", sprints[0].id, users[0].id, users[1].id, "mega important bug", [], []);
    console.log('created issue: ', bug);

    console.log('creating issue...');
    var task = createIssue(issueTypes.TASKS, "task 1", sprints[0].id, users[0].id, users[1].id, "some task", [], []);
    console.log('created issue: ', task);

    bug = addSubTask(bug, task.id);
    console.log('after adding subtask ', bug);

    bug = addSprintToIssue(bug, sprints[1].id);
    console.log('issue 1 after assigning a sprint ', bug);

    console.log('changing status of bug...');
    bug = changeStatus(bug, statuses.IN_PROGRESS);
    console.log('bug after changing status ', bug);

    getIssue([bug, task], 1);
}

// USER API
var userIdSequence = 0;

function createUser(userName) {
    userIdSequence += 1;
    return {
        id: userIdSequence,
        name: userName
    }
}

function createMockedUsers(userNo) {
    var usersList = [];
    for (var i = 0; i < userNo; i++) {
        console.log('creating user...');
        var userId = i + 1;
        var createdUser = createUser(`User` + userId);
        console.log('created user: ', createdUser);
        usersList.push(createdUser);
    }

    return usersList;
}


// PROJECT API
var projectIdSequence = 0;

function createProject() {
    return {
        id: projectIdSequence,
        sprints: []
    }
}

// SPRINT API
var sprintIdSequence = 0;

function createSprint(sprintName) {
    sprintIdSequence += 1;
    return {
        id: sprintIdSequence,
        name: sprintName
    }
}

function createMockedSprints(sprintsNo) {
    var sprintsList = [];
    for (var i = 0; i < sprintsNo; i++) {
        console.log('creating sprint...');
        var sprintId = i + 1;
        var createdSprint = createSprint('Sprint ' + sprintId);
        console.log('created sprint: ', createdSprint);
        sprintsList.push(createdSprint);
    }

    return sprintsList;
}

function addSprintToProject(project, sprintId) {
    return {
        ...project,
        sprints: [...project.sprints, sprintId]
    }
}

// STATUS API

var statuses = {
    NEW: 1,
    IN_PROGRESS: 2,
    FEEDBACK: 3,
    REWORK: 4,
    RESOLVED: 5,
    READY_FOR_TESTING: 6
};

// ISSUES API

var issueIdSequence = 0;
var issueTypes = {
    BUG: "BUG",
    FEATURES: "FEATURES",
    TASKS: "TASKS"
};

function createIssue(type,
                     name,
                     sprintId,
                     createdBy,
                     assigneeId,
                     description,
                     tasks,
                     comments = []) {
    issueIdSequence += 1;

    return {
        id: issueIdSequence,
        type: issueTypes[type],
        sprint: sprintId,
        createdBy,
        assignee: assigneeId,
        description,
        status: statuses.NEW,
        tasks,
        comments,
        updatedAt: new Date(),
        createdAt: new Date()
    }
}

function addSubTask(issue, taskId) {
    if (issue.type === issueTypes.TASKS) {
        throw "cannot add a subtask to a " + issueTypes.TASKS + " type of task"
    }

    return {
        ...issue,
        tasks: [...issue.tasks, taskId],
        updatedAt: new Date()
    }
}

function addSprintToIssue(issue, sprintId) {
    return {
        ...issue,
        sprint: sprintId
    }
}

function changeStatus(issue, status) {
    return {
        ...issue,
        status
    }
}


function getIssue(issues, issueId) {
    var foundIssue = issues.filter(function (issue) {
        return issue.id === issueId
    });

    console.log('found parent issue of ' + issueId + " => ", foundIssue);
    return {

    }
}