const express = require('express')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const route = require('./route')
const path = require("path")
// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080

var app = express()

app.use(flash())
app.use(cookieParser())
app.use(session({ secret: 'email' }))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));
app.use('/', route)
app.set('view engine', 'ejs')

app.listen(port)
console.log("Node server is runing in $s", port)
