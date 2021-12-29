$(document).ready(function (){
    $('#login-form').submit(function (e){
        e.preventDefault()
            $.ajax({
                url: '/login',
                data: {
                    email: $('#email-field').val(),
                    password: $('#password-field').val(),
                },
                contentType: false,
                method: 'POST',
                contentType: 'application/x-www-form-urlencoded',
                success: function(req, res){
                    document.location = '/dash-board'
                },
                error: function(err){
                    alert(err.responseJSON.data)
                }
            })
    })
})




