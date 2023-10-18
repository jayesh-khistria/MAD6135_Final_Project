let userInformation = JSON.parse(sessionStorage.getItem('user'));

function checkAccess() {
    let data = JSON.parse(sessionStorage.getItem('user'));
    if (data?.isAdmin != 0 || data == null) {
        window.location.href = localStorage.getItem('url') + 'login.html';
    } else {
        document.getElementById('username').innerHTML = userInformation.username;
        getParentTaskList(userInformation.username);
        getChildTaskList(userInformation.username);
    }
}

function getParentTaskList(username) {
    let data = JSON.parse(localStorage.getItem('taskList'));
    let temp = data.map(x => {
        if (x.assignTo == username) {
            return x;
        }
    });

    let parent = document.getElementById('parentTask');
    temp.forEach(element => {
        if (element != undefined) {
            let row = parent.insertRow(1);
            row.insertCell(0).innerHTML = element.taskId;
            if (element.status == 'new') {
                row.insertCell(1).innerHTML = '<span class="rounded-pill px-3 p-0 btn btn-primary">' + element.status + '</span>';
            } else if (element.status == 'active') {
                row.insertCell(1).innerHTML = '<span class="rounded-pill px-3 p-0 btn btn-warning">' + element.status + '</span>';
            } else if (element.status == 'completed') {
                row.insertCell(1).innerHTML = '<span class="rounded-pill px-3 p-0 btn btn-success">' + element.status + '</span>';
            } else {
                row.insertCell(1).innerHTML = '<span class="rounded-pill px-3 p-0 btn btn-danger">' + element.status + '</span>';
            }
            // row.insertCell(1).innerHTML = '<span class="rounded-pill px-3 p-0 btn btn-primary">' + element.status + '</span>';
            row.insertCell(2).innerHTML = element.taskName;
            row.insertCell(3).innerHTML = element.taskDescription;
            row.insertCell(4).innerHTML = element.taskAmount + '$';
            row.insertCell(5).innerHTML = parseFloat(element.workingHour).toFixed(2);
            row.insertCell(6).innerHTML = element.startDate;
            row.insertCell(7).innerHTML = element.endDate;

            const parentTaskList = document.getElementById("parentTaskDropDown");
            parentTaskList.options[parentTaskList.options.length] = new Option(element.taskName, element.taskId);
        }
    });
}

function getChildTaskList(username) {
    let data = JSON.parse(localStorage.getItem('childTaskList'));
    let temp = data.map(x => {
        if (x.createdBy == username) {
            return x;
        }
    });

    let child = document.getElementById('childTask');


    temp.forEach(element => {
        if (element != undefined) {
            let checkBox = document.createElement('input');
            checkBox.setAttribute('type', 'checkbox');
            checkBox.setAttribute('value', 'false');
            if (parseInt(element.isCompleted)) {
                checkBox.checked = true;
            }
            // checkBox.checked = parseInt(element.isCompleted) ? 'true': 'false';
            let row = child.insertRow(1);
            row.insertCell(0).innerHTML = element.childTaskId;
            row.insertCell(1).innerHTML = element.parentTaskId;
            row.insertCell(2).innerHTML = element.subTaskName;
            row.insertCell(3).innerHTML = element.subTaskDescription;
            row.insertCell(4).innerHTML = element.subTaskAmount + '$';
            row.insertCell(5).innerHTML = parseFloat(element.subTaskWorkingHour).toFixed(2);
            if (element.isCompleted) {
                // row.insertCell(5).innerHTML= '<input type="checkbox" id="check" value="'+element.isCompleted+'" checked="'+element.isCompleted+'" >'
                row.insertCell(6).innerHTML = '<button type="button" class="btn btn-success" disabled>Completed</button>'
            } else {
                // row.insertCell(5).innerHTML= '<input type="checkbox" id="check" value="'+element.isCompleted+'">'
                row.insertCell(6).innerHTML = '<button type="button" class="btn btn-warning" onclick="changeStatus(' + element.childTaskId + ',' + element.parentTaskId + ')" >Make It Complete</button>'

            }
        }
    });
}


function createSubTask() {
    let childTaskList = JSON.parse(localStorage.getItem('childTaskList'));
    let parentTaskList = JSON.parse(localStorage.getItem('taskList'));

    const date = new Date();
    let object = {
        'childTaskId': childTaskList.length + 1,
        'parentTaskId': document.getElementById('parentTaskDropDown').value,
        'subTaskName': document.getElementById('subTaskName').value,
        'subTaskDescription': document.getElementById('subTaskDescription').value,
        'subTaskAmount': document.getElementById('subTaskAmount').value,
        'subTaskWorkingHour': '-',
        'createdBy': userInformation.username,
        'isCompleted': 0,
        'startWorkingDate': Date.now(),
    }

    if (object.subTaskName == null || object.subTaskName == undefined || object.subTaskName == '') {
        let subTaskname = document.getElementById('errorSubTaskname')
        subTaskname.innerHTML = 'Please enter sub taskname'
        subTaskname.classList.add('errorMessage');
        return;
    }
    if (object.subTaskDescription == null || object.subTaskDescription == undefined || object.subTaskDescription == '') {
        let subTaskDescription = document.getElementById('errorSubTaskDescription')
        subTaskDescription.innerHTML = 'Please enter sub task description'
        subTaskDescription.classList.add('errorMessage');
        return;
    }
    if (object.subTaskAmount != null || object.subTaskAmount != undefined || object.subTaskAmount != '') {
        let oldData = childTaskList.map(x => {
            if (parseInt(x.parentTaskId) == parseInt(object.parentTaskId)) {
                return x.subTaskAmount;
            }
        });
        let totalSum = 0;
        oldData.forEach(element => {
            if (element != undefined) {
                totalSum += parseInt(element);
            }
        });

        let actualAmount = 0;
        parentTaskList.map(x => {
            if (x.taskId == object.parentTaskId) {
                actualAmount = parseInt(x.taskAmount);
            }
        });
        totalSum += parseInt(object.subTaskAmount);

        if (parseInt(object.subTaskAmount) < 1) {
            let subTaskAmount = document.getElementById('errorSubTaskAmount')
            subTaskAmount.innerHTML = 'Please fill the task Amount greater than equal to 1';
            subTaskAmount.classList.add('errorMessage');
            return;
            // alert("Please fill the task Amount greater than equal to 1 !");
            // return;
        } else if (totalSum > actualAmount) {
            if ((actualAmount - totalSum) < 0) {
                let subTaskAmount = document.getElementById('errorSubTaskAmount')
                subTaskAmount.innerHTML = 'You need to add task amount less than or equal to :' + (actualAmount - (totalSum - parseInt(object.subTaskAmount)));
                subTaskAmount.classList.add('errorMessage');
                return;
                // alert("You need to add task amount less than or equal to : " + (actualAmount - (totalSum - parseInt(object.subTaskAmount))));
                // return;
            }
        }
    }

    let child = document.getElementById('childTask');
    child.innerHTML = ''
    let row = child.insertRow(0);
    row.insertCell(0).innerHTML = 'childTaskId';
    row.insertCell(1).innerHTML = 'parentTaskId';
    row.insertCell(2).innerHTML = 'subTaskName';
    row.insertCell(3).innerHTML = 'subTaskDescription';
    row.insertCell(4).innerHTML = 'subTaskAmount';
    row.insertCell(5).innerHTML = 'subTaskWorkingHour';
    row.insertCell(6).innerHTML = 'status';

    childTaskList.push(object);
    localStorage.setItem('childTaskList', JSON.stringify(childTaskList));
    let childData = JSON.parse(localStorage.getItem('childTaskList'));
    childData = childData[childData.length - 1];
    let parentData = JSON.parse(localStorage.getItem('taskList'));
    parentData = parentData.map(x => {
        if (x.taskId == parseInt(childData.parentTaskId)) {
            x.status = 'active';
            if (x.startDate == '-') {
                const date = new Date();
                let day = date.getDate();
                let month = date.getMonth() + 1;
                let year = date.getFullYear();
                x.startDate = `${year}-${month}-${day}`;
            }
            return x;
        } else {
            return x;
        }
    });

    localStorage.setItem('taskList', JSON.stringify(parentData));
    getParentTaskList(userInformation.username);
    getChildTaskList(userInformation.username);
    location.reload();
}


function changeStatus(childId, parentId) {
    let childData = JSON.parse(localStorage.getItem('childTaskList'));

    childData.forEach(element => {
        if (element.childTaskId == childId) {
            element.isCompleted = 1;
            let getHoursDiffBetweenDates = Date.now() - element.startWorkingDate;
            element.subTaskWorkingHour = parseFloat(getHoursDiffBetweenDates / 360000).toFixed(2);
        }
    });

    localStorage.setItem('childTaskList', JSON.stringify(childData));

    childData = JSON.parse(localStorage.getItem('childTaskList'));
    let parentData = JSON.parse(localStorage.getItem('taskList'));

    let hour = 0;
    let parentCompleted = childData.map(x => {
        if (x.parentTaskId == parentId) {
            if (x.childTaskId == x.childTaskId && x.isCompleted == 1) {
                hour = hour + parseFloat(x.subTaskWorkingHour);
                hour.toFixed(2);
                return 1;
            } else {
                return 0;
            }
        }
    });

    if (!parentCompleted.includes(0)) {
        parentData.forEach(element => {
            if (element.taskId == parentId) {
                element.status = 'completed';
                element.workingHour = hour;
                const date = new Date();
                let day = date.getDate();
                let month = date.getMonth() + 1;
                let year = date.getFullYear();
                element.endDate = `${year}-${month}-${day}`;
            }
        });
    } else {
        // alert("Need complete all subtask which are related which same parent task");
    }



    localStorage.setItem('taskList', JSON.stringify(parentData));
    location.reload();
}