var util = require('util')
var express = require('express')
var router = express.Router()

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

router.get('/page-error', function (req, res){
    res.render('page-error')
})

router.get('/register', function (req, res){
    res.render('register')
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



module.exports = router