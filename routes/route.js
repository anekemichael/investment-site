var util = require('util')
var express = require('express')
var router = express.Router()
var httpMsgs = require('http-msgs')
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updatePassword, sendPasswordResetEmail, reauthenticateWithCredential, AuthCredential } = require('firebase/auth')
const auth = getAuth()
const db = require('../firebase/firestore')
const UserModel = require('../model/user')
const Investment = require('../model/investment')
const multer = require('multer');
const cloudStorage = require('../firebase/cloud-storage')
const mailer = require('../mailer/mailer')
const shortId = require('shortid')
var email;
var password;
var token;
var fullname;
var inviteeReferralCode;





router.get('/', function (req, res) {
    res.render('index')
})

router.get('/about', function (req, res){
    res.render('about')
})

router.get('/affiliate', function (req, res){
    res.render('affiliate')
})

router.get('/contact', function (req, res){
    res.render('contact')
})

router.get('/faq', function (req, res){
    res.render('faq')
})


router.get('/forgot-password', function (req, res){
    res.render('forgot-password')
})

router.get('/I', function (req, res){
    res.render('I')
})


router.get('/login', function (req, res){
    res.render('login')
})

router.post('/login', function (req, res){
    signInWithEmailAndPassword(auth, req.body.email, req.body.password)
    .then((userCredential) => {
        const user = userCredential.user
        //send login email
        var cookieData = {
            uid: user.uid,
            email: user.email
        }
        res.cookie("userData", cookieData)
        sendEmail(user.email, 'Login Alert', 'GreeniumTrade Login Alert', 'Dear ' + user.email + ' There was a successful login to your GreeniumTrade Account. Please see below for login details', 
        setTimeDate(), 'If you did not login to your Greenium account Kindly contact GreeniumTrade (our 24/7 Live support)', 'Send email to greeniumtrade@gmail.com')
        httpMsgs.sendJSON(req, res, {result: "registered successfully"})
    })

    .catch((error) => {
        httpMsgs.send500(req, res, error.message)
    })
})

router.get('/page-error', function (req, res){
    res.render('page-error')
})

router.get('/register', function (req, res){
    res.render('register', { code: req.query.code})
})

router.post('/register', function (req, res){
    email = req.body.email
    password = req.body.password
    fullname = req.body.name
    inviteeReferralCode = req.body.referralCode

    if(inviteeReferralCode == ""){
        inviteeReferralCode = "None Provided"
    }

    httpMsgs.sendJSON(req, res, {result: "registered successfully"})
})


router.get('/email-verification', function(req, res){
    if(email){
        const randomIds = '12ab34cd56efghijk79lmnopstuk0wxtvuwyxz'
        token = randomToken(6, randomIds)
        sendEmail(email, 'Account Activation', 'Welcome To GreeniumTrade', 'Hi ' + email + '\n' + 'You have succesfully created an account with GreeniumTrade, Below is a six digit code for the activation of your account. Please provide this code to proceed. Thanks for being part of GreeniumTrade family.', token, 'We are glad to have you on board.', 'Feel free to explore our platform and enjoy our services.')
        //siginInUser(email, password)
        res.render('email-verification')
    } else {
        res.redirect('/register')
    }
})

router.post('/verifyUser', function(req, res){
    if(req.body.token == token){
        siginInUser(email, password, req, res)
    } else {
        httpMsgs.send500(req, res, 'Token dosent match. Click below to resend token')
    }
})


router.get('/services', function (req, res){
    res.render('services')
})

router.get('/terms-of-use', function (req, res){
    res.render('terms-of-use')
})

router.get('/dash-board', function(req, res){
    onAuthStateChanged(auth, (user) => {
        if(user){
            res.render('dash-board')
        } else {
            res.redirect('/login')
        }
    })
})

router.get('/profile', function(req, res){
    onAuthStateChanged(auth, (user) => {
        if(user){
            res.render('profile')
        } else {
            res.redirect('/login')
        }
    })
})

router.get('/edit-profile', function(req, res){
    onAuthStateChanged(auth, (user) => {
        if(user){
            res.render('edit-profile')
        } else {
            res.redirect('/login')
        }
    })
})

router.post('/updateUserBasicInfo', function(req, res){
   db.updateUserBasicInfo(req.cookies.userData.uid, req.body.fullName, req.body.gender,
    req.body.address, req.body.country, req.body.phone).then(() => {
        // sendEmail(user, subject, header, text, action, text_one, text_two)
        sendEmail(req.cookies.userData.email, 'User Update Information', 'Dear ' + req.cookies.userData.email, 'Your User Information was updated successfully, . see below for details', setTimeDate(), 'We are glad to have you on board', 'Feel free to explore our platform and enjoy our services')
       httpMsgs.sendJSON(req, res, { result: 'Successfully updated'})
   })
})


router.post('/updateUserAccountInfo', function(req, res){
   db.updateAccountInfo(req.cookies.userData.uid, req.body.bankName, req.body.accountName, 
    req.body.accountNumber, req.body.btcWallet, req.body.ethWallet, req.body.usdtWallet).then(() => {
        // sendEmail(from, subject, header, text, action, text_one, text_two)
        sendEmail(req.cookies.userData.email, 'User Account Update', 'Dear ' + req.cookies.userData.email, 'Your User Account Information was updated successfully, . see below for details', setTimeDate(), 'We are glad to have you on board', 'Feel free to explore our platform and enjoy our services')
        httpMsgs.sendJSON(req, res, { result: 'Successfully updated'})
    })
})

router.post('/updateUserSecurity', function(req, res){
    var user = auth.currentUser
    db.getUserData(req.cookies.userData.uid).then((doc) => {
        if(doc.exists()){
            if(doc.data().password == req.body.currentPassword){
                updatePassword(user, req.body.password).then(() => {
                    db.updateUserPassword(req.cookies.userData.uid, req.body.newPassword).then(() => {
                        sendEmail(req.cookies.userData.email, 'User security Update Information', 'Dear ' + req.cookies.userData.email, 'Your User Security Information was updated successfully, . see below for details', setTimeDate(), 'We are glad to have you on board', 'Feel free to explore our platform and enjoy our services')
                        httpMsgs.sendJSON(req, res, { result: 'Successfully updated'})
                    })
                  })
                  .catch((error) => {
                     httpMsgs.send500(req, res, error.message)
                  })
            } else {
                httpMsgs.send500(req, res, 'Password Does Not Match')
            }
        }
    })
})

router.get('/invest', function(req, res){
    onAuthStateChanged(auth, (user) => {
        if(user){
            res.render('invest')
        } else {
            res.redirect('/login')
        }
    })
})


router.get('/withdrawal', function(req, res){
    onAuthStateChanged(auth, (user) => {
        if(user){
            res.render('withdrawal')
        } else {
            res.redirect('/login')
        }
    })
})


router.get('/reinvest', function(req, res){
    onAuthStateChanged(auth, (user) => {
        if(user){
            res.render('reinvest')
        } else {
            res.redirect('/login')
        }
    })
})

router.get('/view-pending-history', function(req, res){
    onAuthStateChanged(auth, (user) => {
        if(user){
            res.render('view-pending-history')
        } else {
            res.redirect('/login')
        }
    })
})

router.get('/view-confirmed-history', function(req, res){
    onAuthStateChanged(auth, (user) => {
        if(user){
            res.render('view-confirmed-history')
        } else {
            res.redirect('/login')
        }
    })
})

router.get('/referral', function(req, res){
    onAuthStateChanged(auth, (user) => {
        if(user){
            res.render('referral')
        } else {
            res.redirect('/login')
        }
    })
})

router.get('/referral-withdrawal', function(req, res){
    onAuthStateChanged(auth, (user) => {
        if(user){
            res.render('referral-withdrawal')
        } else {
            res.redirect('/login')
        }
    })
})

router.get('/getUser', function(req, res){
    db.getUserFromFireStore(req.cookies.userData.uid, req, res)
})

router.get('/userInvestment', function(req, res){
    //get investmentId from firestore
    db.getUserInvesmentPlan(req.cookies.userData.uid, req, res)
})


router.post('/createInvestment', function(req, res){
    var generateInvoice = (Math.floor(Math.random() * 100) + Date.now())
    var invest = new Investment(
        req.body.amount,
        false,
        generateInvoice,
        req.body.plan, 
        setTimeDate(),
        withdrawalDate(),
        "",
        req.body.amount,
        0,
        0,
        0,
    )
    var data = invest.recentInvestment("investment", req.body.plan, req.body.amount, /*0, 0,*/ 'btc', "pending", setTimeDate())
    var investmentId = (req.cookies.userData.uid + req.cookies.userData.email)
    db.createInvestmentPlan(req.cookies.userData.uid, investmentId, invest.toMap()).then(() => {
        db.createRecentInvestmentCollection(req.cookies.userData.uid, data).then(() => {
            sendEmail(req.cookies.userData.email, 'Investment Plan Creation', 'Dear ' + req.cookies.userData.email, 'Your request to make deposit was created successfully. Proceed to make payments. Please you are directed to make payment within 24hours of creating the deposit request. \n Currenecy: BTC \n Amount: ' +  req.body.amount + '\n Plan: ' + req.body.plan + '\n Invoice Number: ' + generateInvoice + '. see below for details', setTimeDate(), 'We are glad to have you on board', 'Feel free to explore our platform and enjoy our services')
            sendEmail('avantioneil@gmail.com', 'Investment Plan Creation', 'Dear Admin', req.cookies.userData.email + 'request to make deposit was created successfully.\n Currenecy: BTC \n Amount: ' +  req.body.amount + '\n Plan: ' + req.body.plan + '\n Invoice Number: ' + generateInvoice + '. see below for details', setTimeDate(), 'We are glad to have you on board', 'Feel free to explore our platform and enjoy our services')
            sendEmail('greeniumtrade@gmail.com', 'Investment Plan Creation', 'Dear Admin', req.cookies.userData.email + 'request to make deposit was created successfully. \n Currenecy: BTC \n Amount: ' +  req.body.amount + '\n Plan: ' + req.body.plan + '\n Invoice Number: ' + generateInvoice + '. see below for details', setTimeDate(), 'We are glad to have you on board', 'Feel free to explore our platform and enjoy our services')
            httpMsgs.sendJSON(req, res, {result: "registered successfully"})
        })
    })
})


router.get('/recentInvestments', function(req, res){
    var data = db.getRecentInvestments(req.cookies.userData.uid)
    data.then((item) => {
        httpMsgs.sendJSON(req, res, { result:  item })
    })
})



router.get('/payment-invoice', function(req, res){
    onAuthStateChanged(auth, (user) => {
        if(user){
            res.render('payment-invoice')
        } else {
            res.redirect('/login')
        }
    })
})

router.post('/upload-proof', handleFileUpload().single('payment_proof'), function(req, res){
    //upload to storage
    sendEmail(req.cookies.userData.email, 'Payment Successful', 'Dear ' + req.cookies.userData.email, 'Payment Proof Upload was successful. see below for details', setTimeDate(), 'We are glad to have you on board', 'Feel free to explore our platform and enjoy our services')
    sendEmail('avantioneil@gmail.com', 'Payment Successful', 'Dear Admin', req.cookies.userData.email + ' Payment Proof Uploaded was successful. see below for details', setTimeDate(), 'We are glad to have you on board', 'Feel free to explore our platform and enjoy our services')
    sendEmail('greeniumtrade@gmail.com', 'Payment Successful', 'Dear Admin', req.cookies.userData.email + ' Payment Proof Uploaded was successful. see below for details', setTimeDate(), 'We are glad to have you on board', 'Feel free to explore our platform and enjoy our services')
    cloudStorage.uploadFileToCloudStorage(req.file.path, req.file.originalname, req.cookies.userData.uid, req, res)
})

router.get('/withdrawal-invoice', function(req, res){
    res.render('withdrawal-invoice')
})


router.post('/withdrawal', function(req, res){
    var investmentId = (req.cookies.userData.uid + req.cookies.userData.email)
    var amount = parseInt(req.body.amount)
    var dataObj = new Date()
    var investmentData = db.getInvestmentPlan(investmentId)
    if(dataObj.getDay() == 5){
       investmentData.then((doc) => {
           if(doc.data().investmentStatus == true){
            var availiableWithdrawalAmount =  parseInt(doc.data().btcBalance) - parseInt(doc.data().investmentAmount)
            if(amount <= availiableWithdrawalAmount){
             //send email to user
             //send email to admin
             var recentWithdrawal = new Investment().recentWithdrawal('Withdrawal', amount, amount,
             'pending', 'btc', 'pending', setTimeDate())
             db.createWithdrawalCollection(req.cookies.userData.uid, recentWithdrawal).then(() => {
                sendEmail(req.cookies.userData.email, 'Withdrawal Alert', 'Dear ' + req.cookies.userData.email, 'You have requested for withdrawal, kindly pay 30% of your interest for withdrawal to be approved. Send payment proof to greeniumtrade@gmail.com. see below for details', setTimeDate(), 'We are glad to have you on board', 'Feel free to explore our platform and enjoy our services')
                sendEmail('avantioneil@gmail.com', 'Withdrawal Alert', 'Dear Admin', req.cookies.userData.email + ' have requested for withdrawal, Withdrawal Payment proof status(pending). see below for details', setTimeDate(), 'We are glad to have you on board', 'Feel free to explore our platform and enjoy our services')
                sendEmail('greeniumtrade@gmail.com', 'Withdrawal Alert', 'Dear Admin', req.cookies.userData.email + ' have requested for withdrawal, Withdrawal Payment proof status(pending). see below for details', setTimeDate(), 'We are glad to have you on board', 'Feel free to explore our platform and enjoy our services')
                 httpMsgs.sendJSON(req, res, { data: 'success'})
             })
            } else {
                httpMsgs.send500(req, res, 'Insufficient Funds, Cant withdraw capital until 90 days of investment')
            }
           } else {
            httpMsgs.send500(req, res, 'No current Investment Plan')
           }
       })
    } else {
        investmentData.then((doc) => {
            if(setTimeDate() == doc.data().withdrawalDate){
                if(doc.data().investmentStatus == true){
                    var availiableWithdrawalAmount = parseInt(doc.data().btcBalance)
                    if(amount <= availiableWithdrawalAmount){
                     //send email to user
                     //send email to admin
                 var recentWithdrawal = new Investment().recentWithdrawal('Withdrawal', amount, amount,
                 'pending', 'btc', 'pending', setTimeDate())
                 db.createWithdrawalCollection(req.cookies.userData.uid, recentWithdrawal).then(() => {
                    sendEmail(req.cookies.userData.email, 'Withdrawal Alert', 'Dear ' + req.cookies.userData.email, 'You have requested for withdrawal, kindly pay 30% of your interest for withdrawal to be approved. Send payment proof to greeniumtrade@gmail.com. . see below for details', setTimeDate(), 'We are glad to have you on board', 'Feel free to explore our platform and enjoy our services')
                    sendEmail('avantioneil@gmail.com', 'Withdrawal Alert', 'Dear Admin', req.cookies.userData.email + ' have requested for withdrawal, Withdrawal Payment proof status(pending). see below for details', setTimeDate(), 'We are glad to have you on board', 'Feel free to explore our platform and enjoy our services')
                    sendEmail('greeniumtrade@gmail.com', 'Withdrawal Alert', 'Dear Admin', req.cookies.userData.email + ' have requested for withdrawal, Withdrawal Payment proof status(pending). see below for details', setTimeDate(), 'We are glad to have you on board', 'Feel free to explore our platform and enjoy our services')
                     httpMsgs.sendJSON(req, res, { data: 'success'})
                 })
                } else {
                    httpMsgs.send500(req, res, 'Insufficient Funds')
                }
             }
            } else if(setTimeDate() <= doc.data().withdrawalDate){
                httpMsgs.send500(req, res, 'Cashout withdrawals is on fridays')
            }
        })
    }
})

router.get('/recentWithdrawal', function(req, res){
    var data = db.getAllWithdrawalCollection(req.cookies.userData.uid)
    data.then((item) => {
        httpMsgs.sendJSON(req, res, { result:  item })
    })
})


router.get('/getActiveInvestmentPlan', function(req, res){
    var investmentId = (req.cookies.userData.uid + req.cookies.userData.email)
    db.getInvestmentPlan(investmentId).then((doc) => {
        httpMsgs.sendJSON(req, res, { result: doc.data() })
    })
})

router.post('/resetPassword', function(req, res) {
    sendPasswordResetEmail(auth, req.body.email).then(() => {
        httpMsgs.sendJSON(req, res, { result: 'successful' })
    })
    .catch((error) => {
        httpMsgs.send500(req, res, error.message)
    })
})

router.post('/signOut', function(req, res){
    signOut(auth).then(() => {
        httpMsgs.sendJSON(req, res, { data: "sigin out successful"})
    }).catch((err) => {
        httpMsgs.send500(req, res, 'An error occured sigining you out')
    })
})

router.post('/contact-us', function (req, res) {
    var text = req.body.name + '\n' + req.body.email + '\n' + req.body.message
    sendEmail('avantioneil@gmail.com', 'User Contact Request', 'Dear Admin', text, setTimeDate(), 'We are glad to have you on board', 'Feel free to explore our platform and enjoy our services')
    sendEmail('greeniumtrade@gmail.com', 'User Contact Request', 'Dear Admin', text, setTimeDate(), 'We are glad to have you on board', 'Feel free to explore our platform and enjoy our services')
    httpMsgs.sendJSON(req, res, { data: "successful"})
})


function randomToken(len, arr) {
    var ans = '';
    for (var i = len; i > 0; i--) {
        ans += 
          arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
}

function sendEmail(user, subject, header, text, action, text_one, text_two){
   var nodeTransport = mailer.createNodeMailerTransport('gmail', 'greeniumtrade@gmail.com', 'Greenium&trade1')
   mailer.sendEmail('greeniumtrade@gmail.com', user, subject, header, text, action, text_one, text_two, nodeTransport)
}

function siginInUser(email, password, req, res){
    //generate unique code
    var referralCode = shortId.generate()
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            //signed in
            const user = userCredential.user
            var userModel = new UserModel(
                user.uid,
                "",
                fullname,
                "None Provided",
                "None Provided",
                referralCode,
                "None Provided",
                email,
                true,
                password,
                "None Provided",
                "None Provided",
                "None Provided",
                "None Provided",
                "None Provided",
                "None Provided",
                "None Provided",
                inviteeReferralCode,
                ""
            )

            db.addUserToFireStore(user.uid, userModel.toMap())
            var cookieData = {
                uid: user.uid,
                email: user.email
            }
            res.cookie("userData", cookieData)
            httpMsgs.sendJSON(req, res, {result: "registered successfully"})
        })
        .catch((error) => {
            httpMsgs.send500(req, res, error.message)
        })
}

function handleFileUpload(){
    var storage = multer.diskStorage({
        destination: function(req, file, cb){
            cb(null, './uploads')
        },
        filename: function(req, file, cb){
            fileName = file.originalname
            cb(null, fileName)
        }
    })
    var upload = multer({storage: storage})
    return upload
}

function setTimeDate(){
    var dataObj = new Date()
    var date = ("0" + dataObj.getDate()).slice(-2)
    var month = ("0" + (dataObj.getMonth() + 1)).slice(-2)
    var year = dataObj.getFullYear()
    var hours = dataObj.getHours()
    var minutes = dataObj.getMinutes()
    var seconds = dataObj.getSeconds()
    return (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds)
}

function withdrawalDate(){
    var dataObj = new Date()
    dataObj.setDate(dataObj.getDate() + 90)
    var date = ("0" + dataObj.getDate()).slice(-2)
    var month = ("0" + (dataObj.getMonth() + 1)).slice(-2)
    var year = dataObj.getFullYear()
    var hours = dataObj.getHours()
    var minutes = dataObj.getMinutes()
    var seconds = dataObj.getSeconds()
    return (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds)
}



module.exports = router
