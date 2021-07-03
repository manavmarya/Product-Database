require('./db')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('express-flash')
const cors = require('cors')
var productRoutes = require('./controllers/productController')
var registrationRoutes = require('./controllers/userController')
var User = require('./schema/User')
var app = express()
const passport = require('passport')



app.set('view-engine', 'ejs')
app.use(flash())
app.use(session({
    secret:"blablabla",       
    resave: false,          
    saveUninitialized:false,
    cookie:{
        maxAge: 60*60*1000 
    }    
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.listen(4000, ()=> console.log('server started at 4000'))

app.use('/product', productRoutes)
app.use('/user', registrationRoutes)