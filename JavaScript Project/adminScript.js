let userInformation = JSON.parse(sessionStorage.getItem('user'));


function checkAccess() {
    let data = JSON.parse(sessionStorage.getItem('user'));
    if (data?.isAdmin != 1 || data == null) {
        window.location.href = localStorage.getItem('url') + 'login.html';
    } else {
        document.getElementById('username').innerHTML = userInformation.username;
        getTaskList(userInformation.username);
    }
}

function getTaskList(username) {
    let data = JSON.parse(localStorage.getItem('taskList'));
    let temp = data.map(x => {
        if (x.createdBy == username) {
            return x;
        }
    });

    let parent = document.getElementById('addItem');
    temp.forEach(element => {
        if (element != undefined) {
            let row = parent.insertRow(1);
            row.insertCell(0).innerHTML = element.taskId;
            // row.insertCell(1).innerHTML = element.status;
            if (element.status == 'new') {
                row.insertCell(1).innerHTML = '<span class="rounded-pill px-3 p-0 btn btn-primary">' + element.status + '</span>';
            } else if (element.status == 'active') {
                row.insertCell(1).innerHTML = '<span class="rounded-pill px-3 p-0 btn btn-warning">' + element.status + '</span>';
            } else if (element.status == 'completed') {
                row.insertCell(1).innerHTML = '<span class="rounded-pill px-3 p-0 btn btn-success">' + element.status + '</span>';
            } else {
                row.insertCell(1).innerHTML = '<span class="rounded-pill px-3 p-0 btn btn-danger">' + element.status + '</span>';
            }
            row.insertCell(2).innerHTML = element.taskName;
            row.insertCell(3).innerHTML = element.taskDescription;
            row.insertCell(4).innerHTML = element.taskAmount + '$';
            row.insertCell(5).innerHTML = element.assignTo;
            row.insertCell(6).innerHTML = parseFloat(element.workingHour).toFixed(2);
            row.insertCell(7).innerHTML = element.startDate;
            row.insertCell(8).innerHTML = element.endDate;
        }
    });
    clientUsers();
}

function clientUsers() {

    let allUsers = JSON.parse(localStorage.getItem('users'));

    let clientUsers = allUsers.map(x => {
        if (!x.isAdmin) {
            return x.username;
        }
    });

    clientUsers.forEach(element => {
        if (element != undefined) {
            const clientList = document.getElementById("assignTo");
            clientList.options[clientList.options.length] = new Option(element, element);
        }
    });
    return clientUsers;
}


function createTask() {
    let taskList = JSON.parse(localStorage.getItem('taskList'));
    let object = {
        'taskId': taskList.length + 1,
        'status': 'new',
        'taskName': document.getElementById('taskName').value,
        'taskDescription': document.getElementById('taskDescription').value,
        'taskAmount': document.getElementById('taskAmount').value,
        'createdBy': userInformation.username,
        'assignTo': document.getElementById('assignTo').value,
        'workingHour': '-',
        'startDate': '-',
        // 'endDate': document.getElementById('endDate').value
        'endDate': '-'
    }

    if (object.taskName == null || object.taskName == undefined || object.taskName == '') {
        let taskname = document.getElementById('errorTaskname')
        taskname.innerHTML = 'Please enter taskname'
        taskname.classList.add('errorMessage');
        return;
    }
    if (object.taskDescription == null || object.taskDescription == undefined || object.taskDescription == '') {

        let description = document.getElementById('errorDescription')
        description.innerHTML = 'Please enter description'
        description.classList.add('errorMessage');
        return;
    }
    if (object.taskAmount != null || object.taskAmount != undefined || object.taskAmount != '') {
        if (parseInt(object.taskAmount) < 1) {
            let taskAmount = document.getElementById('errorAmount')
            taskAmount.innerHTML = 'Please enter task Amount greater than 0'
            taskAmount.classList.add('errorMessage');
            return;
        }
    }
    // if (object.endDate != null || object.endDate != undefined || object.endDate != '') {
    //     let start = document.getElementById('startDate').value;
    //     let end = document.getElementById('endDate').value;
    //     if (end < start) {
    //         let date = document.getElementById('errorDate')
    //         date.innerHTML = 'Task end date should be greater than start date'
    //         date.classList.add('errorMessage');
    //         return;
    //     }
    // }


    let parent = document.getElementById('addItem');
    parent.innerHTML = ''
    let row = parent.insertRow(0);
    row.insertCell(0).innerHTML = 'taskId';
    row.insertCell(1).innerHTML = 'status';
    row.insertCell(2).innerHTML = 'taskName';
    row.insertCell(3).innerHTML = 'taskDescription';
    row.insertCell(4).innerHTML = 'taskAmount';
    row.insertCell(5).innerHTML = 'assignTo';
    row.insertCell(6).innerHTML = 'workingHour';
    row.insertCell(7).innerHTML = 'startDate';
    row.insertCell(8).innerHTML = 'endDate';


    taskList.push(object);
    localStorage.setItem('taskList', JSON.stringify(taskList));
    getTaskList(userInformation.username);

    location.reload();
}

function openModal() {
    // const date = new Date();
    // let day = date.getDate();
    // let month = date.getMonth() + 1;
    // let year = date.getFullYear();
    // document.getElementById('startDate').value = `${year}-${month}-${day}`;
    // document.getElementById('endDate').value = `${year}-${month}-${day + 15}`;
    document.getElementById('taskAmount').value = 10;
}



