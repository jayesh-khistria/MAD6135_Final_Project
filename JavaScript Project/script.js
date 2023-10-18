// -1 means master admin
// 1 means admin
// 0 means client/members
let users = [
    { 'username': 'master@gmail.com', 'password': '0000', 'isAdmin': -1 },
    { 'username': 'admin@gmail.com', 'password': '0000', 'isAdmin': 1 },
    { 'username': 'demo@gmail.com', 'password': '1111', 'isAdmin': 1 },
    { 'username': 'client@gmail.com', 'password': '0000', 'isAdmin': 0 },
    { 'username': 'user@gmail.com', 'password': '1111', 'isAdmin': 0 },
    { 'username': 'user1@gmail.com', 'password': '1111', 'isAdmin': 0 },
    { 'username': 'user2@gmail.com', 'password': '1111', 'isAdmin': 0 },
    { 'username': 'user3@gmail.com', 'password': '1111', 'isAdmin': 0 },
    { 'username': 'user4@gmail.com', 'password': '1111', 'isAdmin': 0 },
    { 'username': 'user5@gmail.com', 'password': '1111', 'isAdmin': 0 },
    { 'username': 'user6@gmail.com', 'password': '1111', 'isAdmin': 0 },
];

let taskList = [
    // { 'taskId': 1, 'status': 'new', 'taskName': 'GUI Change', 'taskDescription': 'CSS change and validation', 'taskAmount': 100, 'createdBy': 'admin@gmail.com', 'assignTo': 'user@gmail.com', 'workingHour':'-', 'startDate': '-', 'endDate': '-' },
    // { 'taskId': 2, 'status': 'new', 'taskName': 'Model Chnages', 'taskDescription': 'API validation', 'taskAmount': 30, 'createdBy': 'demo@gmail.com', 'assignTo': 'client@gmail.com', 'workingHour':'-', 'startDate': '-', 'endDate': '-' },
    // { 'taskId': 3, 'status': 'new', 'taskName': 'API Chnages', 'taskDescription': 'API validation', 'taskAmount': 30, 'createdBy': 'admin@gmail.com', 'assignTo': 'client@gmail.com', 'workingHour':'-', 'startDate': '-', 'endDate': '-' },
    // { 'taskId': 4, 'status': 'new', 'taskName': 'Graphics Chnages', 'taskDescription': 'API validation', 'taskAmount': 30, 'createdBy': 'demo@gmail.com', 'assignTo': 'user3@gmail.com','workingHour':'-','startDate': '-', 'endDate': '-' },
]

let childTaskList = [
    // {'childTaskId':1, 'parentTaskId':1,'subTaskName':'button Changes','subTaskDescription':'button loader', 'subTaskAmount':10,'subTaskWorkingHour':'10','createdBy':'user@gmail.com', 'isCompleted':0},
    // {'childTaskId':2, 'parentTaskId':2,'subTaskName':'API Model','subTaskDescription':'api model loader', 'subTaskAmount':30,'subTaskWorkingHour':'10','createdBy':'client@gmail.com','isCompleted':1},
]

let URL = "http://127.0.0.1:5500/";
localStorage.setItem('url', URL);
let tempUsers =  JSON.parse(localStorage.getItem('users'));
if(tempUsers == undefined || tempUsers == null){
    localStorage.setItem('users', JSON.stringify(users));
}else{
    localStorage.setItem('users', JSON.stringify(tempUsers));
}

function onLoad() {
    sessionStorage.removeItem('user');
    let parent = JSON.parse(sessionStorage.getItem('tempParentTask'));
    let child = JSON.parse(sessionStorage.getItem('tempChildTask'));
    // let allUser = JSON.parse(sessionStorage.getItem('tempUsers'));

    if ((parent != undefined || parent != null) && (child != undefined || child != null)) {
        localStorage.setItem('taskList', JSON.stringify(parent));
        localStorage.setItem('childTaskList', JSON.stringify(child));
        // localStorage.setItem('users', JSON.stringify(allUser));

    } else {
        let taskListData = JSON.parse(localStorage.getItem('taskList'));
        if (taskListData != null && taskListData.length > taskList.length) {
        } else {
            localStorage.setItem('taskList', JSON.stringify(taskList));
            localStorage.setItem('childTaskList', JSON.stringify(childTaskList));
            // localStorage.setItem('users', JSON.stringify(users));
        }
    }
}

function login(a, b) {
    let loginData = JSON.parse(localStorage.getItem('users'));
    let data = [];

    if(loginData == null || loginData == undefined){
        data = users.map(element => {
            if (element.username == a.value && element.password == b.value) {
                sessionStorage.setItem('user', JSON.stringify(element));
                return true;
            } else {
                return false;
            }
        });
    }else{
        data = loginData.map(element => {
            if (element.username == a.value && element.password == b.value) {
                sessionStorage.setItem('user', JSON.stringify(element));
                return true;
            } else {
                return false;
            }
        });
    }

    if (!data.includes(true)) {
        alert("Invalid Username Or Password");
        window.location.href = URL + "login.html";
    } else {
        let user = JSON.parse(sessionStorage.getItem('user'))
        if (user.isAdmin == -1) {
            window.location.href = URL + "masterDashboard.html";
        } else if (user.isAdmin) {
            window.location.href = URL + "adminDashboard.html";
        } else {
            window.location.href = URL + "clientDashboard.html";
        }
    }
}

function logout() {
    sessionStorage.removeItem('user');
    let parent = JSON.parse(localStorage.getItem('taskList'));
    sessionStorage.setItem('tempParentTask', JSON.stringify(parent));
    let child = JSON.parse(localStorage.getItem('childTaskList'));
    sessionStorage.setItem('tempChildTask', JSON.stringify(child));
    let user = JSON.parse(localStorage.getItem('users'));
    sessionStorage.setItem('tempUsers', JSON.stringify(user));


    window.location.href = URL + "login.html";
}

