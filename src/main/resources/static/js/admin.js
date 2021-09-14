$(document).ready(function () {
    $('.cBtn').on("click", function (s) {
        s.preventDefault();
        $('#modal').modal('cancel')
    })
});
$(document).ready(function () {
    $('.eBtn').on('click', function (e) {
        e.preventDefault();
        let href = $(this).attr('href');
        $.get(href, function (user) {
            $('.myForm #id').val(user.id);
            $('.myForm #username').val(user.username);
            $('.myForm #email').val(user.email);
            $('.myForm #password').val(user.password);
        });
        $('#modal').modal('show')
    })
});
$(document).ready(function () {
    $('.dBtn').on('click', function (e) {
        e.preventDefault();
        let href = $(this).attr('href');
        $.get(href, function (user) {
            $('#dId').val(user.id);
            $('#dUsername').val(user.username);
            $('#dPassword').val(user.password);
            $('#dEmail').val(user.email);
            let div = document.getElementById('deleteUser');
            let e = document.createElement('a');
            e.className = "btn btn-danger"
            e.href = '/admin/home/linkDelete/' + user.id;
            e.appendChild(document.createTextNode('Delete'));
            div.appendChild(e);
        });
        $('#modalDelete').modal("show");
    });
});

$(document).ready(function () {
    var hash = window.location.hash;
    hash && $('ul.nav-tabs a[href="' + hash + '"]').tab('show');
});





