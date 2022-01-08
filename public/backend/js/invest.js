$(document).ready(function (){
    var plan = "";
    $('.plan-select').click(function (){
            if($(this).is(":checked")){
                plan = $(this).val()
            }
        })
        
    $('#invest-form').submit(function (e){
        e.preventDefault()
        if(plan == ""){
            alert("Please select a plan")
        } else if(plan == "starter"  && parseInt($('#amount').val()) < 300){
            alert("Insufficient amount")
        }  else if(plan == "premium"  && parseInt($('#amount').val()) < 5000){
            alert("Insufficient amount")
        }  else if(plan == "unlimited"  && parseInt($('#amount').val()) < 10000){
            alert("Insufficient amount")
        } else if(plan == "contract"  && parseInt($('#amount').val()) < 50100){
            alert("Insufficient amount")
        } else {
            $.ajax({
                url: '/createInvestment',
                data: {
                    plan: plan,
                    paymentType: $('#payment_currency').val(),
                    amount: $('#amount').val()
                },
                contentType: false,
                method: 'POST',
                contentType: 'application/x-www-form-urlencoded',
                success: function(req, res){
                    document.location = '/payment-invoice'
                },
                error: function(err){
                    alert(err.responseJSON.data)
                }
            })
        }
    })


    $('#proof').submit(function (e){
        e.preventDefault()
            var form = document.querySelector('#proof')
            var data = new FormData(form)
            $.ajax({
                url: '/upload-proof',
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                method: 'POST',
                success: function(req, res){
                    document.location = '/dash-board'
                },
                error: function(err){
                    alert(err.responseJSON.data)
                }
            })
    })

    $('#create-withdrawal-invoice').submit(function (e){
        e.preventDefault()
            $.ajax({
                url: '/withdrawal',
                data: {
                    walletType: $('#wallet').val(),
                    amount: $('#withdrawal-amount').val()
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

    $('#withdrawal-form').submit(function (e){
        e.preventDefault()
            $.ajax({
                url: '/withdrawal',
                data: {
                    amount: $('#amount').val()
                },
                contentType: 'application/x-www-form-urlencoded',
                method: 'POST',
                success: function(req, res){
                    document.location = '/dash-board'
                },
                error: function(err){
                    alert(err.responseJSON.data)
                }
            })
    })
})
