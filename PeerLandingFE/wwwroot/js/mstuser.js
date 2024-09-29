async function fetchUsers() {
    const token = localStorage.getItem('Token');
    const response = await fetch('ApiMstUser/GetAllUsers', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    if (!response.ok) {
        alert('Failed to fetch users');
        return;
    }
    const jsonData = await response.json();
    if (jsonData.success) {
        populateUserTable(jsonData.data);
    }
    else {
        alert('no users found');
    }
}

function populateUserTable(users) {
    const userTableBody = document.querySelector('#userTable tbody');
    userTableBody.innerHTML = "";
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.balance}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="editUser('${user.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser('${user.id}')">Delete</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

window.onload = fetchUsers;

function editUser(id) {
    const token = localStorage.getItem('Token');
    fetch(`/ApiMstUser/GetUserById?Id=${id}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
                
            }
            return response.json();
        })

        .then(data => {
            if (data.success) {
                const user = data.data;
                document.getElementById('userName').value = user.name;
                document.getElementById('userRole').value = user.role;
                document.getElementById('userBalance').value = user.balance;

                //for ID user
                document.getElementById('userId').value = id;

                $('#editUserModal').modal('show');
            } else {
                alert('User not found');
            }
        })
        .catch(error => {
            alert('Error fetching user data: ' + error.message);
        });
}
function addUser() {
    const name = document.getElementById('addUserName').value;
    const email = document.getElementById('addUserEmail').value;
    const password = document.getElementById('addUserPassword').value;
    const role = document.getElementById('addUserRole').value;
    const balance = document.getElementById('addUserBalance').value;

    const reqAddUserDto = {
        name: name,
        email: email,
        password: password,
        role: role,
        balance: parseFloat(balance)
    };

    const token = localStorage.getItem('Token');

    fetch(`/ApiMstUser/AddUser`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqAddUserDto)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add user.');
            }
            return response.json();
        })
        .then(data => {
            alert('User added successfully!');
            $('#addUserModal').modal('hide');
            fetchUsers();
        })
        .catch(error => {
            alert('Error adding user: ' + error.message);
        });
}

function updateUser() {
    const id = document.getElementById('userId').value;
    const name = document.getElementById('userName').value;
    const role = document.getElementById('userRole').value;
    const balance = document.getElementById('userBalance').value;

    const reqMstUserDto = {
        name: name,
        role: role,
        balance: parseFloat(balance)
    };

    const token = localStorage.getItem('Token');

    fetch(`/ApiMstUser/UpdateUser/${id}`, {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqMstUserDto)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update user');
            }
            return response.json();
        })
        .then(data => {
            alert('User updated successfully!');
            $('#editUserModal').modal('hide');
            fetchUsers();
        })
        .catch(error => {
            alert('Error updating user: ' + error.message);
        });
}

function deleteUser(id) {
    const confirmation = confirm("Are you sure you want to delete this user?");

    if (!confirmation) {
        return;
    }

    const token = localStorage.getItem('Token');

    fetch(`/ApiMstUser/DeleteUser/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            return response.text();
        })
        .then(message => {
            alert(message);
            fetchUsers();
        })
        .catch(error => {
            alert('Error deleting user: ' + error.message);
        });
}