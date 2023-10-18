let userInformation = JSON.parse(sessionStorage.getItem('user'));


function checkAccess() {
    let data = JSON.parse(sessionStorage.getItem('user'));
    if (data?.isAdmin != -1) {
        window.location.href = localStorage.getItem('url') + 'login.html';
    } else {
        document.getElementById('username').innerHTML = userInformation.username;
        getUserList();
    }
}


function getUserList() {
    let temp = JSON.parse(sessionStorage.getItem('tempUsers'));
    // let temp = document.cookie;
    if (temp != undefined || temp != null) {
        localStorage.setItem('users', JSON.stringify(temp));
    }

    // JSON.parse(localStorage.setItem('users',temp));
    let data = JSON.parse(localStorage.getItem('users'));

    let parent = document.getElementById('users');
    data.forEach(element => {
        if (element != undefined) {
            let row = parent.insertRow(1);
            row.insertCell(0).innerHTML = element.username;
            row.insertCell(1).innerHTML = element.password;
            // row.insertCell(2).innerHTML = element.isAdmin;
            if(element.isAdmin == 1) {
                row.insertCell(2).innerHTML = '<span class="rounded-pill px-3 p-0 btn btn-success">' + 'Admin' + '</span>';
            }else if (element.isAdmin == 0){
                row.insertCell(2).innerHTML = '<span class="rounded-pill px-3 p-0 btn btn-warning">' + 'Member' + '</span>';
            }else{
                row.insertCell(2).innerHTML = '<span class="rounded-pill px-3 p-0 btn btn-danger">' + 'Master' + '</span>';
            }
        }
    });
}

function createUser() {
    let users = JSON.parse(localStorage.getItem('users'));
    let object = {
        'username': document.getElementById('usernameInput').value,
        'password': document.getElementById('password').value,
        'isAdmin': 0,
    }

    let radioList = document.getElementsByName('isAdminRadio');
    for (let i = 0; i < radioList.length; i++) {
        if (radioList[i].checked && radioList[i].value == 1) {
            object.isAdmin = 1;
        }
    }

    let isTaken = false;
    if (object.username == null || object.username == '') {
        let username = document.getElementById('errorUsername')
        username.innerHTML = 'Please Enter Username'
        username.classList.add('errorMessage');
        return;
    } else if (object.username != null || object.username != '') {
        let regex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;
        let result = regex.test(object.username);
        if(result){
            users.forEach(element => {
                if (element.username == object.username) {
                    isTaken = true;
                }
            });
            if (isTaken) {
                let username = document.getElementById('errorUsername')
                username.innerHTML = 'Username is already taken please try to another username !'
                username.classList.add('errorMessage');
                return;
            }
        }else{
                let username = document.getElementById('errorUsername')
                username.innerHTML = 'Please enter valid email address for username !'
                username.classList.add('errorMessage');
                return;
        }
    }
    if (object.password == null || object.password == '') {
        let username = document.getElementById('errorPassword')
        username.innerHTML = 'Please Enter Password'
        username.classList.add('errorMessage');
        return;
    }

    users.push(object);
    localStorage.setItem('users', JSON.stringify(users));
    sessionStorage.setItem('tempUsers', JSON.stringify(users));
    location.reload()


}