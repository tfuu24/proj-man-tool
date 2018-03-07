window.onload = initApp;

var projects = [];
var issues = [];
var users = [];
var sprints = [];


function initApp() {
    console.log('app loaded..');

    createMockedUsers(2);
    console.log('list of users is : ', users);

    console.log('creating project...');
    var project1 = createProject();
    console.log('created project: ', project1);
    projects.push(project1);
    console.log('list of projects is : ', projects);

    createMockedSprints(4);
    console.log('list of sprints is : ', sprints);

    addSprintToProject(projects[0], sprints[0].id);
    console.log('project after adding sprint: ', projects);

    addSprintToProject(projects[0], sprints[3].id);
    console.log('project after adding sprint: ', projects);

    console.log('creating issue...');
    createIssue(issueTypes.BUG, "bug 1", sprints[0].id, users[0].id, users[1].id, "mega important bug", [], []);
    console.log('list of issues is: ', issues);

    console.log('creating issue...');
    createIssue(issueTypes.FEATURES, "features 1", sprints[0].id, users[0].id, users[1].id, "mega important feature", [], []);
    console.log('list of issues is: ', issues);

    console.log('creating issue...');
    createIssue(issueTypes.TASKS, "tasks 1", sprints[0].id, users[0].id, users[1].id, "mega important task", [], []);
    console.log('list of issues is: ', issues);

    console.log('creating issue...');
    createIssue(issueTypes.TASKS, "tasks 2", sprints[0].id, users[0].id, users[1].id, "task", [], []);
    console.log('list of issues is: ', issues);

    addSprintToIssue(issues[0], sprints[1].id);
    console.log('list of issues is : ', issues);

    console.log('adding subtask...');
    addSubTask(issues[0], 3);
    console.log('list of issues is : ', issues);

    console.log('adding subtask...');
    addSubTask(issues[0], 4);
    console.log('list of issues is : ', issues);

    console.log('changing status of task...');
    changeStatus(issues[0], statuses.READY_FOR_TESTING);
    console.log('issues after changing status :' , issues);

    console.log('changing status of task...');
    changeStatus(issues[1], statuses.RESOLVED);
    console.log('issues after changing status :' , issues);

    console.log('changing status of task...');
    changeStatus(issues[0], statuses.IN_PROGRESS);
    console.log('issues after changing status :' , issues);

    console.log('changing status of task...');
    changeStatus(issues[3], statuses.READY_FOR_TESTING, 1);
    console.log('issues after changing status :' , issues);

    console.log('changing status of task...');
    changeStatus(issues[2], statuses.READY_FOR_TESTING, 1);
    console.log('issues after changing status :' , issues);
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
    for (var i = 0; i < userNo; i++) {
        console.log('creating user...');
        var userId = i + 1;
        var createdUser = createUser(`User` + userId);
        console.log('created user: ', createdUser);
        users.push(createdUser);
    }
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
    for (var i = 0; i < sprintsNo; i++) {
        console.log('creating sprint...');
        var sprintId = i + 1;
        var createdSprint = createSprint('Sprint ' + sprintId);
        console.log('created sprint: ', createdSprint);
        sprints.push(createdSprint);
    }
}

function addSprintToProject(project, sprintId) {
    project.sprints = [...project.sprints, sprintId];
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

    issues.push({
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
    });
}

function addSubTask(issue, taskId) {
    if (issue.id === taskId) {
        throw "cannot assign a child task to itself";
    }

    if (issue.type === issueTypes.TASKS) {
        throw "cannot add a subtask to a " + issueTypes.TASKS + " type of task";
    }

    var subtask = getIssue(taskId);
    if (subtask.type !== issueTypes.TASKS) {
        throw "cannot add a subtask of type " + subtask.type + " to a " + issue.type;
    }

    issue.tasks = [...issue.tasks, taskId];
    issue.updatedAt = new Date();
}

function addSprintToIssue(issue, sprintId) {
    issue.sprint = sprintId;
}

function changeStatus(issue, status, parentId) {
    issue.status = status;

    if (status === statuses.READY_FOR_TESTING && parentId) {
        // find parent of issue
        var parentIssue = getIssue(parentId);

        // verify all children of parent issue
        var isParentReadyForTesting = true;
        parentIssue.tasks.forEach(function (taskId) {
            var childIssue = getIssue(taskId);
            if (childIssue.status !== statuses.READY_FOR_TESTING) {
                isParentReadyForTesting = false;
            }
        });

        if (isParentReadyForTesting) {
            parentIssue.status = statuses.READY_FOR_TESTING;
        }
    }
}

function getIssue(issueId) {
    var foundIssueList = issues.filter(function (issue) {
        return issue.id === issueId
    });

    if (foundIssueList.length === 0) {
        console.log('could not find issue with id ', issueId);
        return;
    }

    console.log('found issue with id => ' + issueId + " => ", foundIssueList[0]);
    return foundIssueList[0];
}