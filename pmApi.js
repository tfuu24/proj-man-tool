/*
object containing all the functionality used with the local storage;
 */

window.pmApi = {
    // the id sequence is used to ensure that every time an issue, project, user and sprint
    // is created, it's value is unique, so we keep it in the local storage
    // and increment it every time the creation functions are called
    getIdSequence: function (seqType) {
        var idSequence = window.localStorage.getItem(seqType + "idSequence");
        if (!idSequence) {
            idSequence = "0";
            window.localStorage.setItem(seqType + "idSequence", idSequence);
        }

        return parseInt(idSequence);
    },

    // every time a creation function is called, ensure that the id is incremented
    // so that no 2 same structures have the same id
    setIdSequence: function (seqType, idSeq) {
        var idSequence = window.localStorage.getItem(seqType + "idSequence");
        if (!idSequence) {
            idSequence = "0";
            window.localStorage.setItem(seqType + "idSequence", idSequence);
        } else {
            window.localStorage.setItem(seqType + "idSequence", idSeq);
        }
    },

    createUser: function createUser(userName) {
        // if no user is created thus far, just return an empty list
        // this idea is used everywhere when fetching or creating an entity
        var users = JSON.parse(window.localStorage.getItem("users"));
        if (!users) {
            users = [];
        }

        // get the current id present in local storage for the "user" type of entity
        var userIdSeq = window.pmApi.getIdSequence("user");
        users.push({
            id: userIdSeq,
            name: userName
        });

        // set the next sequence id for the user and store the updated Array in
        // the local storage
        window.pmApi.setIdSequence("user", userIdSeq + 1);
        window.localStorage.setItem("users", JSON.stringify(users));
    },

    // fetch all users
    getUsers: function getUsers() {
        var users = JSON.parse(window.localStorage.getItem("users"));
        if (!users) {
            return [];
        }
        return users;
    },

    // create a sprint in a specified project
    createSprint: function createSprint(sprintName, projectId) {
        var sprints = JSON.parse(window.localStorage.getItem("sprints"));
        if (!sprints) {
            sprints = [];
        }

        var sprintIdSeq = window.pmApi.getIdSequence("sprint");
        sprints.push({
            id: sprintIdSeq,
            name: sprintName
        });

        window.pmApi.addSprintToProject(projectId, sprintIdSeq);
        window.pmApi.setIdSequence("sprint", sprintIdSeq + 1);
        window.localStorage.setItem("sprints", JSON.stringify(sprints));
    },

    // get all sprints in the project
    getSprints: function getSprints(projectId) {
        var projects = window.pmApi.getProjects();
        var filteredProjects = projects.filter(project => project.id === projectId);

        var sprints = JSON.parse(window.localStorage.getItem("sprints"));
        if (!sprints || filteredProjects.length === 0) {
            return [];
        }
        var filteredSprints = [];
        filteredProjects[0].sprints.forEach(sprint => {
            sprints.forEach(unfilteredSprint => {
                if (sprint === unfilteredSprint.id) {
                    filteredSprints.push(unfilteredSprint);
                }
            });
        });
        console.log('filtered sprints by project are: ', filteredSprints);
        return filteredSprints;
    },

    // get all issues present in a sprint
    getIssuesBySprint: function getIssueBySprint(sprintId) {
        // var sprints = JSON.parse(window.localStorage.getItem("sprints"));
        var issues = JSON.parse(window.localStorage.getItem("issues"));
        // var filteredSprint = sprints.filter(sprint => sprint.id === sprintId);
        var filteredIssues = issues.filter(issue => issue.sprint === sprintId);
        console.log('issues filtered by sprint', filteredIssues);
        return filteredIssues;
    },

    createProject: function createProject() {
        var projects = JSON.parse(window.localStorage.getItem("projects"));
        if (!projects) {
            projects = [];
        }

        var projectIdSeq = window.pmApi.getIdSequence("project");
        projects.push({
            id: projectIdSeq,
            sprints: []
        });

        window.pmApi.setIdSequence("project", projectIdSeq + 1);
        window.localStorage.setItem("projects", JSON.stringify(projects));
    },

    getProjects: function getProjects() {
        var projects = JSON.parse(window.localStorage.getItem("projects"));
        if (!projects) {
            projects = [];
        }
        return projects;
    },

    addSprintToProject: function addSprintToProject(projectId, sprintId) {
        var projects = JSON.parse(window.localStorage.getItem("projects"));

        // handles use cases when the function may fail
        if (!projects) {
            throw "no project has been created yet"
        }
        var filteredProject = projects.filter(project => project.id === projectId);
        if (filteredProject.length === 0) {
            throw "project with id " + projectId + " was not fount"
        }
        var currentProject = filteredProject[0];
        // check all childs of this project to see if the sprint was already been added
        currentProject.sprints.forEach(sprint => {
            if (sprintId === sprint) {
                throw "sprint " + sprint + " was already added";
            }
        });

        currentProject.sprints = [...currentProject.sprints, sprintId];
        window.localStorage.setItem("projects", JSON.stringify(projects));
    },

    createIssue: function (type,
                           name,
                           sprintId,
                           createdBy,
                           assigneeId,
                           description,
                           tasks,
                           comments = []) {
        var issues = JSON.parse(window.localStorage.getItem("issues"));
        if (!issues) {
            issues = [];
        }

        var issueIdSeq = window.pmApi.getIdSequence("issue");

        issues.push({
            id: issueIdSeq,
            type: window.pmApi.issueTypes[type],
            sprint: sprintId,
            createdBy,
            assignee: assigneeId,
            description,
            status: window.pmApi.statuses.NEW,
            tasks,
            comments,
            updatedAt: new Date(),
            createdAt: new Date()
        });

        window.pmApi.setIdSequence("issue", issueIdSeq + 1);
        window.localStorage.setItem("issues", JSON.stringify(issues));
    },

    getIssue: function (issueId) {
        var issues = window.localStorage.getItem("issues");
        if (!issues) {
            throw "no issues created yet";
        }
        var filteredIssue = JSON.parse(issues).filter(issue => {
            return issue.id === issueId
        });
        if (filteredIssue.length === 0) {
            throw "could not find issue " + issueId;
        }
        return filteredIssue[0];
    },

    addSubtask: function addSubTask(issueId, taskId) {
        // first, fetch the issue
        var issue = window.pmApi.getIssue(issueId);

        // handle error cases
        if (issue.id === taskId) {
            throw "cannot assign a child task to itself";
        }
        if (issue.type === window.pmApi.issueTypes.TASKS) {
            throw "cannot add a subtask to a " + window.pmApi.issueTypes.TASKS + " type of task";
        }
        // only tasks can be subtasks
        var subtask = window.pmApi.getIssue(taskId);
        if (subtask.type !== window.pmApi.issueTypes.TASKS) {
            throw "cannot add a subtask of type " + subtask.type + " to " + issue.type;
        }
        // check if task is already added as child
        issue.tasks.forEach(task => {
            if (task === taskId) {
                throw "subtask already added";
            }
        });

        issue.tasks = [...issue.tasks, taskId];
        // set the latest date when the task was edited
        issue.updatedAt = new Date();

        var issues = JSON.parse(window.localStorage.getItem("issues"));
        // only update the modified issue in the list of all issues-
        issues = issues.map(singleIssue => {
            if (singleIssue.id === issue.id) {
                return issue;
            }
            return singleIssue;
        });
        // -and write it in the local storage
        window.localStorage.setItem("issues", JSON.stringify(issues));
    },

    addSprintToIssue: function addSprintToIssue(issueId, sprintId) {
        var currentIssue = window.pmApi.getIssue(issueId);
        currentIssue.sprint = sprintId;

        var issues = JSON.parse(window.localStorage.getItem("issues"));
        // only modified the issue with the id specified as parameter
        issues = issues.map(issue => {
            if (issue.id === issueId) {
                return currentIssue;
            }
            return issue;
        });

        window.localStorage.setItem("issues", JSON.stringify(issues));

        // add all children of this task to the sprint
        currentIssue.tasks.forEach(function (taskId) {
            var subTask = window.pmApi.getIssue(taskId);
            window.pmApi.addSprintToIssue(subTask, sprintId);
        });
    },

    // change the status of an issue
    // it is required to specify the parentId if there is one
    // otherwise all children of the tasks have to be checked just to find the parent,
    // the solution proposed is: the parent id can be fetched from the DOM and be
    // specified as a parameter here, for performance reasons
    changeStatus: function changeStatus(issueId, status, parentId) {
        var issue = window.pmApi.getIssue(issueId);

        var parentIssue;
        if (parentId) {
            parentIssue = window.pmApi.getIssue(parentId)
        }
        // change the status of the specified issue first
        issue.status = status;

        if (status === window.pmApi.statuses.READY_FOR_TESTING && parentId) {
            // verify all children of parent issue
            // asume the parent has to be changed to READY_FOR_TESTING
            var isParentReadyForTesting = true;

            // check all children of the parent to see if all of them are ready for testing
            parentIssue.tasks.forEach(function (taskId) {
                var childIssue = window.pmApi.getIssue(taskId);
                if (childIssue.status !== window.pmApi.statuses.READY_FOR_TESTING) {
                    isParentReadyForTesting = false;
                }
            });

            if (isParentReadyForTesting) {
                parentIssue.status = window.pmApi.statuses.READY_FOR_TESTING;
            }
        }

        // write the changes to the local storage
        var issues = JSON.parse(window.localStorage.getItem("issues"));
        issues = issues.map(singleIssue => {
            if (singleIssue.id === issueId) {
                return issue;
            }
            if (parentIssue && singleIssue.id === parentIssue.id) {
                return parentIssue;
            }
            return singleIssue;
        });

        window.localStorage.setItem("issues", JSON.stringify(issues));
    },

    // dictionary used for the issue type
    issueTypes: {
        BUG: "BUG",
        FEATURES: "FEATURES",
        TASKS: "TASKS"
    },

    // dictionary used for the issue status
    statuses: {
        NEW: 1,
        IN_PROGRESS: 2,
        FEEDBACK: 3,
        REWORK: 4,
        RESOLVED: 5,
        READY_FOR_TESTING: 6
    }
};