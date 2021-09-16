$(async function () {
    await getTable()
    await getNewUserForm();
    await getDefaultModal();
    await addNewUser();
})

const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findAllUsers: async () => await fetch('http://localhost:8080/admin/getAll'),
    findOneUser: async (id) => await fetch(`findOne/${id}`),
    addNewUser: async (user) => await fetch('addUser', {
        method: 'POST',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    updateUser: async (user, id) => await fetch(`save/${id}`, {
        method: 'PUT',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`linkDelete/${id}`, {method: 'DELETE', headers: userFetchService.head})
}


async function getTable() {
    let htmlTable
    let table = $('#usersTable tbody')
    table.empty()
    await userFetchService.findAllUsers()
        .then(res => res.json())
        .then(users => {
            for (let i = 0; i < users.length; i++) {
                htmlTable += `$(
                        <tr>
                            <td>${users[i].id}</td>
                            <td>${users[i].username}</td>
                            <td>${users[i].email}</td>    
                            <td>
                                 <button type="button" data-userid="${users[i].id}" data-action="edit" class="btn btn-primary" 
                                data-toggle="modal" data-target="#modal">Edit</button>
                            </td>
                            <td>
                                    <button type="button" data-userid="${users[i].id}" data-action="delete" class="btn btn-danger" 
                                data-toggle="modal" data-target="#modal">Delete</button>
                            </td>
                        </tr>
                )`;
            }
            table.append(htmlTable);
        })
    $("#usersTable").find('button').on('click', (event) => {
        let defaultModal = $('#modal');

        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');

        defaultModal.attr('data-userid', buttonUserId);
        defaultModal.attr('data-action', buttonAction);
        defaultModal.modal('show');
    })
}

async function getDefaultModal() {
    $('#modal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}


async function getNewUserForm() {
    let button = $(`#SliderNewUserForm`);
    let form = $(`#defaultSomeForm`)
    button.on('click', () => {
        if (form.attr("data-hidden") === "true") {
            form.attr('data-hidden', 'false');
            form.show();
            button.text('Hide panel');
        } else {
            form.attr('data-hidden', 'true');
            form.hide();
            button.text('Show panel');
        }
    })
}

async function editUser(modal, id) {
    let preuser = await userFetchService.findOneUser(id);
    let user = preuser.json();

    modal.find('.modal-title').html('Edit user');

    let editButton = `<button  class="btn btn-outline-success" id="editButton">Edit</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(editButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {
        let bodyForm = `
            <form class="form-group row row-centered col-6 offset-3 text-sm-center" id="editUser">
            <label for="id" class="form-label col-12 ">ID</label>
                <input type="text" class="form-control " id="id" name="id" value="${user.id}" disabled><br>
            <label for="username" class="form-label col-12 ">Username</label>
                <input class="form-control " type="text" id="username" name="username" value="${user.username}"><br>
            <label for="email" class="form-label col-12 ">Email</label>
                <input class="form-control " type="text" id="email"  name="email" value="${user.email}"><br>
            <label for="password" class="form-label col-12 ">Password</label>
                <input class="form-control " type="password" name="password" id="password"><br>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    $("#editButton").on('click', async () => {
        let id = modal.find("#id").val();
        let username = modal.find("#username").val();
        let email = modal.find("#email").val();
        let password = modal.find("#password").val();

        let data = {
            id: id,
            username: username,
            email: email,
            password: password
        }
        console.log(data)
        const response = await userFetchService.updateUser(data, id);

        if (response.ok) {
            await getTable();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show col-12" role="alert" id="sharaBaraMessageError">
                            ${body.info}
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}

async function deleteUser(modal, id) {
    let userFetch = await userFetchService.findOneUser(id);
    let user = userFetch.json();

    modal.find('.modal-title').html('Delete user');

    let deleteButton = `<button  class="btn btn-danger" id="deleteButton">Delete</button>`;
    let closeButton = `<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>`
    modal.find('.modal-footer').append(deleteButton);
    modal.find('.modal-footer').append(closeButton);

    user.then(user => {
        let bodyForm = `
            <form class="form-group row row-centered col-6 offset-3 text-sm-center" id="editUser">
            <label for="id" class="form-label col-12 ">ID</label>
                <input type="text" class="form-control " id="id" name="id" value="${user.id}" disabled><br>
            <label for="username" class="form-label col-12 ">Username</label>
                <input class="form-control " type="text" id="username" name="username" value="${user.username}" disabled><br>
            <label for="email" class="form-label col-12 ">Email</label>
                <input class="form-control " type="text" id="email"  name="email" value="${user.email}" disabled><br>
            <label for="password" class="form-label col-12 ">Password</label>
                <input class="form-control " type="password" name="password" id="password" disabled><br>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })
    $("#deleteButton").on('click', async () => {
        await userFetchService.deleteUser(id);
        modal.modal('hide')
    })

}

async function addNewUser() {

    $('#addUserButton').click(async () => {
        let addUserForm = $('#newUserForm')
        let username = addUserForm.find('#newUsername').val()
        let email = addUserForm.find('#newEmail').val()
        let password = addUserForm.find('#newPassword').val()
        let data={
            username:username,
            email: email,
            password: password
        }
        await userFetchService.addNewUser(data)
    })
}

$(document).ready(function () {
    let hash = window.location.hash;
    hash && $('ul.nav-tabs a[href="' + hash + '"]').tab('show');
});





