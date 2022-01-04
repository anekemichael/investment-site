$(document).ready(function (){
    $('#register-form').submit(function (e){
        e.preventDefault()
        if($('#password').val() == $('#confirm_password').val()){
            $.ajax({
                url: '/register',
                data: {
                    name: $('#full-name').val(),
                    email: $('#email').val(),
                    password: $('#password').val(),
                    password_confirm: $('#confirm_password').val()
                },
                contentType: false,
                method: 'POST',
                contentType: 'application/x-www-form-urlencoded',
                success: function(req, res){
                    document.location = '/email-verification'
                },
                error: function(err){
                    alert(err.responseJSON.data)
                }
            })
        } else {
            alert("Password Does Not Match")
        }
    })

    $('#email-verification').submit(function (e){
       // alert($('#token').val())
        e.preventDefault()
            $.ajax({
                url: '/verifyUser',
                data: {
                    token: $('#token').val(),
                },
                contentType: false,
                method: 'POST',
                contentType: 'application/x-www-form-urlencoded',
                success: function(req, res){
                    document.location = '/login'
                },
                error: function(err){
                    alert(err.responseJSON.data)
                 }
            })
    })
})




