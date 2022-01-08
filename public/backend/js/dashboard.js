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
        console.log(err.responseJSON.data)
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

$.ajax({
    url: '/recentWithdrawal',
    data: {},
    contentType: false,
    method: 'GET',
    success: function(req, res, data){
        setUpWithdrawalTable(data)
        setUpPendingHistroyTable(data)
    },
    error: function(err){
        alert(err.responseJSON.data)
    }
})

$.ajax({
    url: '/getActiveInvestmentPlan',
    data: {},
    contentType: false,
    method: 'GET',
    success: function(req, res, data){
        setActiveInvestmentTable(data)
        withdrawalData(data)
    },
    error: function(err){
        alert(err.responseJSON.data)
    }
})


$('#logout-modal').submit(function (e){
    e.preventDefault()
    $.ajax({
        url: '/signOut',
        data: {},
        contentType: false,
        method: 'POST',
        success: function(req, res, data){
            document.location = '/login'
        },
        error: function(err){
            alert(err.responseJSON.data)
        }
    })
})


$('#user-basic-info-form').submit(function (e){
    e.preventDefault()
        $.ajax({
            url: '/updateUserBasicInfo',
            data: {
                fullName: $('#first-name').val() + ' ' + $('#last-name').val(),
                gender: $('#gender').val(),
                phone: $('#phone').val(),
                address: $('#address').val(),
                country: $('#country-select').val()
            },
            contentType: false,
            method: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            success: function(req, res, data){
                document.location = '/dash-board'
            },
            error: function(err){
                alert(err.responseJSON.data)
            }
        })
})

$('#account-settings-form').submit(function (e){
    e.preventDefault()
    var bankName = $('#bank-name').val()
    var accountName = $('#account-name').val()
    var accountNumber = $('#account-number').val()
    var btcWallet = $('#btc-wallet').val()
    var ethWallet = $('#eth-wallet').val()
    var usdtWallet = $('#usdt-wallet').val()
    if(bankName == ""){
        bankName = "None Provided"
    }
    if(accountName == ""){
        accountName = "None Provided"
    }
    if(accountNumber == ""){
        accountNumber = "None Provided"
    }
    if(btcWallet == ""){
        btcWallet = "None Provided"
    }
    if(ethWallet == ""){
        ethWallet = "None Provided"
    }
    if(usdtWallet == ""){
        usdtWallet = "None Provided"
    }
        $.ajax({
            url: '/updateUserAccountInfo',
            data: {
                bankName: bankName,
                accountName: accountName,
                accountNumber: accountNumber, 
                btcWallet: btcWallet,
                ethWallet: ethWallet,
                usdtWallet: usdtWallet
            },
            contentType: false,
            method: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            success: function(req, res, data){
                document.location = '/dash-board'
            },
            error: function(err){
                alert(err.responseJSON.data)
            }
    })
})

$('#security-form').submit(function (e){
    e.preventDefault()
    if($('#new-password').val() == $('#confirm-password').val()){
        $.ajax({
            url: '/updateUserSecurity',
            data: {
                currentPassword: $('#current-password').val(),
                newPassword:  $('#current-password').val()
            },
            contentType: false,
            method: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            success: function(req, res, data){
                document.location = '/dash-board'
            },
            error: function(err){
                alert(err.responseJSON.data)
            }
        })
    } else {
        alert('Passwords Does not match')
    }
})

$('#password-reset').submit(function (e){
    e.preventDefault()
        $.ajax({
            url: '/resetPassword',
            data: {
                email: $('#email-reset').val(),
            },
            contentType: false,
            method: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            success: function(req, res, data){
                document.location = '/login'
            },
            error: function(err){
                alert(err.responseJSON.data)
            }
        })
})























function setData(data){
    var response = data.responseJSON
    $('#username').html(response.fullName)
    $('#username-top').html(response.fullName)
    $('#user-name').html(response.fullName)
    $('#fullname').html(response.fullName)
    $('#email').html(response.emailAddress)
    $('#notification').html('Welcome to greenium trades. We are the world leading cryptocurrency platform. With 24/7 customer care services')
    $('#referral-link').html('https://www.greeniumtrade.com/register?code=' + response.referralCode)
    if(response.address == ""){
        $('#address').html('None Provided')
    } else {
        $('#address').html(response.address)
    }
    if(response.phone == ""){
        $('#phone').html('None Provided')
    } else {
        $('#phone').html(response.phone)
    }
    if(response.gender == ""){
        $('#gender').html('None Provided')
    } else {
        $('#gender').html(response.gender)
    }
    if(response.bankName == ""){
        $('#bank-name').html('None Provided')
    } else {
        $('#bank-name').html(response.bankName)
    }
    if(response.accountName == ""){
        $('#account-name').html('None Provided')
    } else {
        $('#account-name').html(response.accountName)
    }
    if(response.accountNumber == ""){
        $('#account-number').html('None Provided')
    } else {
        $('#account-number').html(response.accountNumber)
    }
    if(response.btcWallet == ""){
        $('#btc-wallet').html('None Provided')
    } else {
        $('#btc-wallet').html(response.btcWallet)
    }
    if(response.etherumWallet == ""){
        $('#eth-wallet').html('None Provided')
    } else {
        $('#eth-wallet').html(response.etherumWallet)
    }
    if(response.usdt == ""){
        $('#usdt-wallet').html('None Provided')
    } else {
        $('#usdt-wallet').html(response.usdt)
    }
    if(response.bnbWallet == ""){
        $('#bnb-wallet').html('None Provided')
    } else {
        $('#bnb-wallet').html(response.bnbWallet)
    } 
    if(response.country == ""){
        $('#country').html('None Provided')
    } else {
        $('#country').html(response.country)
    } 
}

function withdrawalData(data){
    var response = data.responseJSON.result
    $('#plan').html(response.investmentPlan + ' Plan')
    $('#invested-amount').html('$' + response.investmentAmount)
    $('#intrest-amount').html('$' + response.btcBalance)
    $('#date').html(response.investedDate)
}

function setUserInvestmentPlan(data){
    var plan;
    var investmentAmount = data.responseJSON.investmentAmount
    if(data.responseJSON.investmentStatus){
        $('#btc_bal').html("$" + data.responseJSON.btcBalance)
        $('#eth_bal').html("$" + data.responseJSON.etherumBalance)
        $('#usdt_bal').html("$" + data.responseJSON.usdtBalance)
        $('#bnb_bal').html("$" + data.responseJSON.bnbBalance)
        if(data.responseJSON.investmentPlan == 'starter'){
            $('#starter').html("active")
            $('#starter').prop('disabled', true)
            plan = starter
        } else if(data.responseJSON.investmentPlan == 'standard'){
            $('#standard').html("active")
            $('#standard').prop('disabled', true)
            plan = standard
        } else if(data.responseJSON.investmentPlan == 'unlimited'){
            $('#unlimited').html("active")
            $('#unlimited').prop('disabled', true)
            plan = unlimited
        } else if(data.responseJSON.investmentPlan == 'contract'){
            $('#contract').html("active")
            $('#contract').prop('disabled', true)
            plan = contract
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
    if(data.responseJSON.result.length != 0){
        $("#empty_state").html("")
        data.responseJSON.result.map((element, index) => {
            $("#recent_investment").append(
                "<tr>"+
                "<td class=\"text-center\">" + (index + 1) + "</td>" + 
                "<td class=\"text-center\">" + element.data.action + "</td>" + 
                "<td class=\"text-center\">" + element.data.plan + "</td>" + 
                "<td class=\"text-center\">" + element.data.amount + "</td>" +
                "<td class=\"text-center\">" + element.data.coinType + "</td>" +
                "<td class=\"text-center\">" + element.data.status + "</td>" + 
                "<td class=\"text-center\">" + element.data.createdAt + "</td>" +
                "</tr>"
                );
        });
    }
}

function setUpWithdrawalTable(data){
    console.log(data.responseJSON);
    if(data.responseJSON.result.length != 0){
        $("#empty_withdrawal_state").html("")
        data.responseJSON.result.map((element, index) => {
            $("#recent-withdrawal").append(
                "<tr>"+
                "<td class=\"text-center\">" + (index + 1) + "</td>" + 
                "<td class=\"text-center\">" + element.data.action + "</td>" + 
                "<td class=\"text-center\">" + element.data.amount + "</td>" +
                "<td class=\"text-center\">" + element.data.calculatedAmount + "</td>" + 
                "<td class=\"text-center\">" + element.data.status + "</td>" + 
                "<td class=\"text-center\">" + element.data.coinType + "</td>" +
                "<td class=\"text-center\">" + element.data.settlementStatus + "</td>" +
                "<td class=\"text-center\">" + element.data.createdAt + "</td>" +
                "</tr>"
                );
        });
    }
}

function setUpPendingHistroyTable(data){
    console.log(data.responseJSON);
    if(data.responseJSON.result.length != 0){
        $("#empty_pending_state").html("")
        data.responseJSON.result.map((element, index) => {
            $("#pending-histroy-table").append(
                "<tr>"+
                "<td class=\"text-center\">" + (index + 1) + "</td>" + 
                "<td class=\"text-center\">" + element.data.action + "</td>" + 
                "<td class=\"text-center\">" + element.data.amount + "</td>" +
                "<td class=\"text-center\">" + element.data.calculatedAmount + "</td>" + 
                "<td class=\"text-center\">" + element.data.status + "</td>" + 
                "<td class=\"text-center\">" + element.data.coinType + "</td>" +
                "<td class=\"text-center\">" + element.data.settlementStatus + "</td>" +
                "<td class=\"text-center\">" + element.data.createdAt + "</td>" +
                "</tr>"
                );
        });
    }
}

function setUpConfirmedHistroyTable(data){
    console.log(data.responseJSON);
    if(data.responseJSON.result.length != 0){
        $("#empty_state_confirmed").html("")
        data.responseJSON.result.map((element, index) => {
            $("#confirmed-table-histroy").append(
                "<tr>"+
                "<td class=\"text-center\">" + (index + 1) + "</td>" + 
                "<td class=\"text-center\">" + element.data.action + "</td>" + 
                "<td class=\"text-center\">" + element.data.amount + "</td>" +
                "<td class=\"text-center\">" + element.data.calculatedAmount + "</td>" + 
                "<td class=\"text-center\">" + element.data.status + "</td>" + 
                "<td class=\"text-center\">" + element.data.coinType + "</td>" +
                "<td class=\"text-center\">" + element.data.settlementStatus + "</td>" +
                "<td class=\"text-center\">" + element.data.createdAt + "</td>" +
                "</tr>"
                );
        });
    }
}




function setActiveInvestmentTable(data){
    var response = data.responseJSON.result
    if(response.investmentStatus == true){
        $('#empty_reinvest_state').html('')
        $("#investment-plan-table").append(
            "<tr>"+
            "<td class=\"text-center\">" + "1" + "</td>" + 
            "<td class=\"text-center\">" + "<button class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#planUpgrade\">Upgrade</button>" + "</td>" +
            "<td class=\"text-center\">" + "<button class=\"btn btn-primary\" data-toggle=\"modal\" data-target=\"#withdrawalModal\">Withdraw</button>" + "</td>" +
            "<td class=\"text-center\">" + response.investmentPlan + "</td>" +
            "<td class=\"text-center\">" + response.investmentAmount + "</td>" + 
            "<td class=\"text-center\">" + response.btcBalance + "</td>" + 
            "<td class=\"text-center\">" + 'BTC' + "</td>" + 
            "<td class=\"text-center\">" + response.investedDate + "</td>" +
            "</tr>"
        );
    }
}