const express = require('express')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require("path")
var favicon = require('serve-favicon')
const myApp = require('./firebase/init')
const { getAnalytics } = require('firebase/analytics')
//const analytics = getAnalytics(myApp)
// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080
var app = express()
const route = require('./routes/route')
var cronJobs = require('./routes/helpers/cron-jobs')


app.use(flash())
app.use(cookieParser())
app.use(session({ secret: 'email' }))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: false}));
app.use('/', route)
app.set('view engine', 'ejs')

app.listen(port, () => {
   console.log("Node server is runing in $s", port)
})

