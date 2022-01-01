var util = require('util')
var express = require('express')
var router = express.Router()
var httpMsgs = require('http-msgs')
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth')
const auth = getAuth()
const db = require('../firebase/firestore')
const UserModel = require('../model/user')
const Investment = require('../model/investment')




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
        res.cookie("userData", user.uid)
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
    res.render('register')
})

router.post('/register', function (req, res){
    var email = req.body.email
    var password = req.body.password

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            //signed in
            const user = userCredential.user
            //send email verification
            //sendVerificationLink(res)
            //save user to firestore
            var userModel = new UserModel(
                user.uid,
                "",
                req.body.name,
                "None Provided",
                "None Provided",
                "None Provided",
                "None Provided",
                email,
                user.emailVerified,
                password,
                "None Provided",
                "None Provided",
                "None Provided",
                "None Provided",
                "None Provided",
                "None Provided",
                "None Provided"
            )
            db.addUserToFireStore(user.uid, userModel.toMap())
            //add user to cookie.
            res.cookie("userData", user.uid)
            httpMsgs.sendJSON(req, res, {result: "registered successfully"})
        })

        .catch((error) => {
            httpMsgs.send500(req, res, error.message)
            const errorCode = error.code
            const errorMessage = error.message
    })
})

function sendVerificationLink(res){
    const user = auth.currentUser
    user.sendEmailVerification().then(function (){
        httpMsgs.sendJSON(req, res, {result: "registered successfully"})
    }) 
}

router.get('/email-verification', function(req, res){
    res.render('email-verification')
})


router.get('/services', function (req, res){
    res.render('services')
})

router.get('/terms-of-use', function (req, res){
    res.render('terms-of-use')
})

router.get('/dash-board', function(req, res){
    res.render('dash-board')
})

router.get('/profile', function(req, res){
    res.render('profile')
})

router.get('/edit-profile', function(req, res){
    res.render('edit-profile')
})

router.get('/invest', function(req, res){
    res.render('invest')
})


router.get('/withdrawal', function(req, res){
    res.render('withdrawal')
})


router.get('/reinvest', function(req, res){
    res.render('reinvest')
})

router.get('/view-pending-history', function(req, res){
    res.render('view-pending-history')
})

router.get('/view-confirmed-history', function(req, res){
    res.render('view-confirmed-history')
})

router.get('/referral', function(req, res){
    res.render('referral')
})

router.get('/referral-withdrawal', function(req, res){
    res.render('referral-withdrawal')
})

router.get('/getUser', function(req, res){
    db.getUserFromFireStore(req.cookies.userData, req, res)
})

router.get('/userInvestment', function(req, res){
    //get investmentId from firestore
    db.getUserDataOnce(req.cookies.userData, req, res)
})


router.post('/createInvestment', function(req, res){
    var generateInvoice = (Math.floor(Math.random() * 100) + Date.now())
    var data = {
            investmentAmount: req.body.amount,
            investmentStatus: false,
            investmentPlan: req.body.plan,
            investmentInvoice: generateInvoice,
            investedDate: setTimeDate(),
            withdrawalDate: withdrawalDate(),
            btcBalance: req.body.amount,
            bnbBalance: 0,
            usdtBalance: 0,
            etherumBalance: 0
    }

    var invest = new Investment(
        req.body.amount,
        false,
        generateInvoice,
        req.body.plan, 
        setTimeDate(),
        withdrawalDate(),
        req.body.amount,
        0,
        0,
        0,
    )

    var data = invest.recentInvestment(1, "investment", "starter", 500, 0, 0, 0, "pending")
    db.createInvestmentPlan(req.cookies.userData, invest.toMap()).then(() => {
        db.createRecentInvestmentCollection(req.cookies.userData, data).then(() => {
            httpMsgs.sendJSON(req, res, {result: "registered successfully"})
        })
    })
})


router.get('/recentInvestments', function(req, res){
    var data = db.getRecentInvestments(req.cookies.userData)
    data.then((item) => {
        httpMsgs.sendJSON(req, res, { result:  item })
    })
})

router.get('/payment-invoice', function(req, res){
    res.render('payment-invoice')
})




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
    dataObj.setDate(dataObj.getDate() + 7)
    var date = ("0" + dataObj.getDate()).slice(-2)
    var month = ("0" + (dataObj.getMonth() + 1)).slice(-2)
    var year = dataObj.getFullYear()
    var hours = dataObj.getHours()
    var minutes = dataObj.getMinutes()
    var seconds = dataObj.getSeconds()
    return (year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds)
}



module.exports = router