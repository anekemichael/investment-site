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

$.ajax({
    url: '/userInvestment',
    data: {},
    contentType: false,
    method: 'GET',
    success: function(req, res, data){
        setUserInvestmentPlan(data)
        console.log(data.responseJSON);
    },
    error: function(err){
        alert(err.responseJSON.data)
    }
})

$.ajax({
    url: '/recentInvestments',
    data: {},
    contentType: false,
    method: 'GET',
    success: function(req, res, data){
        setUpInvestmentTable(data)
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

function setUserInvestmentPlan(data){
    if(data.responseJSON.investmentStatus){
        $('#btc_bal').html("$" + data.responseJSON.btcBalance)
        $('#eth_bal').html("$" + data.responseJSON.etherumBalance)
        $('#usdt_bal').html("$" + data.responseJSON.usdtBalance)
        $('#bnb_bal').html("$" + data.responseJSON.bnbBalance)
        if(data.responseJSON.investmentPlan == 'starter'){
            $('#starter').html("active")
            $('#starter').prop('disabled', true)
        } else if(data.responseJSON.investmentPlan == 'standard'){
            $('#standard').html("active")
            $('#standard').prop('disabled', true)
        } else if(data.responseJSON.investmentPlan == 'unlimited'){
            $('#unlimited').html("active")
            $('#unlimited').prop('disabled', true)
        } else if(data.responseJSON.investmentPlan == 'contract'){
            $('#contract').html("active")
            $('#contract').prop('disabled', true)
        }
    }
    
    //For invoice page.
    $('#invoice-number').html(data.responseJSON.investmentInvoice)
    $('#amount').html('USD ' + data.responseJSON.investmentAmount + ' | ' +'<span>BTC 23.7</span>')
    $('#amount-span').html('Amount: ' + 'USD ' + data.responseJSON.investmentAmount + ' | ' +'<span>BTC 23.7</span>')
    $('#bar-code').prop('src',
    'https://chart.googleapis.com/chart?chs=250x250&cht=qr&chl=bitcoin:389Vq7YVpGmAVFyhBfhcaCT5QZ2rrroKCs?amount=' + data.responseJSON.investmentAmount.toString() + '.00000000');
    
}



function setUpInvestmentTable(data){
    console.log(data.responseJSON);
     $("#empty_table").html("")
    data.responseJSON.result.map(element => {
        $("#recent_investment").append(
            "<tr><td>" + element.data.sn + "</td>" +
            "<td>" + element.data.action + "</td>" + 
            "<td>" + element.data.plan + "</td>" + 
            "<td>" + element.data.amount + "</td>" +
            "<td>" + element.data.dayCounter + "</td>" +
            "<td>" + element.data.coinValue + "</td>" +
            "<td>" + element.data.coinType + "</td>" +
            "<td>" + element.data.status + "</td></tr>"
            );
    });

}