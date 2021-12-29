// $(document).ready(function (){
//     e.preventDefault()
//     alert("called")
//     $.ajax({
//         url: '/getUser',
//         data: {},
//         contentType: false,
//         method: 'GET',
//         success: function(req, res){
            
//         },
//         error: function(err){
//             alert(err.responseJSON.data)
//         }
//     })
// })

$.ajax({
    url: '/getUser',
    data: {},
    contentType: false,
    method: 'GET',
    success: function(req, res, data){
        setData(data)
        console.log(data.responseJSON);
    },
    error: function(err){
        alert(err.responseJSON.data)
    }
})

function setData(data){
    $('#username').html(data.responseJSON.fullName)
    $('#username-top').html(data.responseJSON.fullName)
    $('#fullname').html(data.responseJSON.fullName)
    $('#email').html(data.responseJSON.emailAddress)
}