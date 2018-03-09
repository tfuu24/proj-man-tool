window.onload = initSprints;

// entry point when the DOM loads
function initSprints() {
    var sprintId = parseInt(getParameterByName("sprintId"));
    populateSelect("createdBy");
    populateSelect("assignee");
}

// populate select fields with all users available on the storage
function populateSelect(selectName) {
    // fetch all users from the storage
    var users = window.pmApi.getUsers();
    var selectGroup = document.getElementById("issue-" + selectName);

    // create an option field for each user
    users.forEach(user => {
        var option = document.createElement("option");
        option.innerHTML = user.name;
        selectGroup.appendChild(option);
    });
}

// create table to populate it with the issues
function createTable(issue) {
    // this tag contains all issues for this sprint
    var sprint = document.getElementById("sprint");
    var issueId = document.createElement("div");
    issueId.classList.add("issue-id");

    // title of the issue is the issue id (tag)
    issueId.innerHTML = "ISSUE TAG " + issue.id;
    sprint.appendChild(issueId);

    // table containing mapping of the attributes of the issue and all its values
    var table = document.createElement("table");
    var tableHeader = document.createElement("tr");
    var attributeName = document.createElement("th");
    attributeName.innerHTML = "Property Name";
    table.appendChild(tableHeader);
    tableHeader.appendChild(attributeName);
    var attributeValue = document.createElement("th");
    attributeValue.innerHTML = "Attribute value";
    tableHeader.appendChild(attributeValue);
    sprint.appendChild(table);

    // the actual mapping of the attributes with their values
    Object.keys(issue).forEach(issueKey => {
        var tableRow = document.createElement('tr');
        var propertyName = document.createElement('td');
        propertyName.innerHTML = issueKey;
        var propertyValue = document.createElement('td');
        propertyValue.innerHTML = issue[issueKey];
        tableRow.appendChild(propertyName);
        tableRow.appendChild(propertyValue);
        table.appendChild(tableRow);
    })
}

// creates a table for each issue on local storage
function displayIssues(issues) {
    issues.forEach(issue => {
        createTable(issue);
    });
}

// creates a tag with the description of the sprint
function displayCurrentSprint(currentSprint) {
    var sprint = document.getElementById("sprint");
    sprint.innerHTML = currentSprint.name;
}

// parses the URL and gets the query paramater specified
// source: stackoverflow
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}