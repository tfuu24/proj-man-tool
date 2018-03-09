### project overview

This example showcases a vanilla Javascript project management application.

The main features show 4 different types of entities: `users`, `sprints`, `issues` and `projects`. 
The application uses a project management api (`pmApi.js`) to persist and modify the data only client-side.

Enjoy!

The UI consists of 2 pages, one for general
overview and creating projects and sprints, and the other (WIP), on creating issues.

### project-management-api

The main focus of this project was implementing an interface for managing the entities specified above.
It is a singleton object consisting of the following functions:

##### `getIdSequence` and `setIdSequence`

Used to keep track of the generated ids so that we can ensure that are unique

##### `createSprint` `createUser` `createProject` `createIssue`

Creating and storing the entities used in the app onto the local storage

##### `getIssues` `getUsers` `getSprints` `getProjects`

Used for fetching data from the local storage

##### `addSubtask`

Modifies the task attribute that keeps the reference of the child tasks

##### `addSprintToIssue`

Modifies the sprint attribute of an issue

##### `changeStatus`

Changes the status of an issue. _NOTE_ that also changes the parent if specified and the resulting
status is READY_FOR_TESTING

##### `issueTypes` and `statuses`

Are dictionaries used to easily keep track of the value of these constants 

### running the app

To run the app simply run index.html in your browser.

