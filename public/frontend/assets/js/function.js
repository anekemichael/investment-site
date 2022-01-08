$(document).ready(function (){
    $('#contact-form').submit(function (e){
        e.preventDefault()
            $.ajax({
                url: '/contact-us',
                data: {
                    name: $('#name').val(),
                    email: $('#email').val(),
                    subject: $('#subject').val(),
                    message: $('#message').val(),
                },
                contentType: false,
                method: 'POST',
                contentType: 'application/x-www-form-urlencoded',
                success: function(req, res){
                    document.location.reload()
                },
                error: function(err){
                    alert(err.responseJSON.data)
                }
            })
    })
})




