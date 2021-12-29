var util = require('util')
var express = require('express')
var router = express.Router()
var httpMsgs = require('http-msgs')
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth')
const auth = getAuth()
const db = require('../firebase/firestore')
var userModel = {
    uid: "",
    fullName: "",
    gender: "",
    address: "",
    referralCode: "",
    country: "",
    emailAddress: "",
    isEmailVerified: false,
    password: "",
    bankName: "",
    accountName: "",
    accountName: "",
    btcWallet: "",
    etherumWallet: "",
    usdt: "",
    bnbWallet: "",
}




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
        console.log(user);
        //send login email
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
    var password_confirm = req.body.password_confirmation

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            //signed in
            const user = userCredential.user
            //send email verification
            //sendVerificationLink(res)
            //save user to firestore
            var userModel = {
                uid: user.uid,
                fullName: req.body.name,
                gender: "",
                address: "",
                referralCode: "",
                country: "",
                emailAddress: user.email,
                isEmailVerified: user.emailVerified,
                password: req.body.password,
                bankName: "",
                accountName: "",
                accountName: "",
                btcWallet: "",
                etherumWallet: "",
                usdt: "",
                bnbWallet: "",
            }
            db.addUserToFireStore(user.uid, userModel)
            //add user to cookie.
            res.cookie("userData", userModel)
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
    db.getUserFromFireStore(req.cookies.userData.uid, req, res)
})



module.exports = router