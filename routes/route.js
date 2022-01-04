var util = require('util')
var express = require('express')
var router = express.Router()
var httpMsgs = require('http-msgs')
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } = require('firebase/auth')
const auth = getAuth()
const db = require('../firebase/firestore')
const UserModel = require('../model/user')
const Investment = require('../model/investment')
const multer = require('multer');
const cloudStorage = require('../firebase/cloud-storage')
const mailer = require('../mailer/mailer')
const e = require('connect-flash')
var email;
var password;
var token;
var fullname;





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
        sendGeneralEmail(user.email, 'Login Successful')
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
    console.log(req.body);
    email = req.body.email
    password = req.body.password
    fullname = req.body.name
    httpMsgs.sendJSON(req, res, {result: "registered successfully"})
})


router.get('/email-verification', function(req, res){
    if(email){
        res.redirect('/register')
    } else {
        const randomIds = '12ab34cd56efghijk79lmnopstuk0wxtvuwyxz'
        token = randomToken(6, randomIds)
        sendVerificationToken(email, token)
        //siginInUser(email, password)
        res.render('email-verification')
    }
})

router.post('/verifyUser', function(req, res){
    console.log('token ' + token);
    console.log('post_token ' + req.body.token);

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
    var data = invest.recentInvestment(1, "investment", "starter", 500, 0, 0, 0, "pending")
    var investmentId = (req.cookies.userData.uid + req.cookies.userData.email)
    db.createInvestmentPlan(req.cookies.userData.uid, investmentId,invest.toMap()).then(() => {
        db.createRecentInvestmentCollection(req.cookies.userData.uid, data).then(() => {
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
    cloudStorage.uploadFileToCloudStorage(req.file.path, req.file.originalname, req.cookies.userData.uid, req, res)
})


router.post('/withdrawal', function(req, res){
    // var dataObj = new Date()
    // var investmentData = db.getInvestmentPlan(req.)
    // if(dataObj.getDay() == 5){
      
    // }
    // console.log(req.body);
    // console.log(dataObj.getDay());
})

router.post('/signOut', function(req, res){
    signOut(auth).then(() => {
        httpMsgs.sendJSON(req, res, { data: "sigin out successful"})
    }).catch((err) => {
        httpMsgs.send500(req, res, 'An error occured sigining you out')
    })
})

function randomToken(len, arr) {
    var ans = '';
    for (var i = len; i > 0; i--) {
        ans += 
          arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
}


function sendVerificationToken(user, token){
   var nodeTransport = mailer.createNodeMailerTransport('gmail', 'campdaniel06@gmail.com', 'password_campdaniel06')
   mailer.sendEmail('campdaniel06@gmail.com', user, 'This is your verification code. Keep it secret', token, nodeTransport)
}

function sendGeneralEmail(user, action){
    var nodeTransport = mailer.createNodeMailerTransport('gmail', 'campdaniel06@gmail.com', 'password_campdaniel06')
    mailer.sendEmail('campdaniel06@gmail.com', user, 'Login Alert', action, nodeTransport)
}

function siginInUser(email, password, req, res){
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        //signed in
        const user = userCredential.user
        //save user to firestore
        var userModel = new UserModel(
            user.uid,
            "",
            fullname,
            "None Provided",
            "None Provided",
            "None Provided",
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
            "None Provided"
        )
        db.addUserToFireStore(user.uid, userModel.toMap())
        //add user to cookie.
        var cookieData = {
            uid: user.uid,
            email: user.email
        }
        res.cookie("userData", cookieData)
        httpMsgs.sendJSON(req, res, {result: "registered successfully"})
    })

    .catch((error) => {
        httpMsgs.send500(req, res, error.message)
        const errorCode = error.code
        const errorMessage = error.message
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