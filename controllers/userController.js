const { request } = require('express')
const express = require('express')
const registrationRouter = express.Router()
let User = require('../schema/User')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ email: username }, function (err, user) {
        if (err) { return done(err) }
        if (!user) {
          return done(null, false, { message: 'Incorrect Email.' })
        }
        if (user.password != password) {
          return done(null, false, { message: 'Incorrect password.' })
        }
        return done(null, user)
      })
    }
))

passport.serializeUser(function(user, done) {
    done(null, user)
  })
  
  passport.deserializeUser(function(user, done) {
    done(null, user)
  })

registrationRouter.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
  })

registrationRouter.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

registrationRouter.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})
  

registrationRouter.post('/register', (req, res) => {
    User.findOne({ email: req.body.email }).then(user => {
        if (user) {
          return res.status(400).json({ email: "Email already exists" })
        }
        else {
            var register = new User({
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: req.body.password
            })
            register.save()            
                .then(reg => {
                    res.status(200).send("Registration successful")
                })
                .catch(err => {
                    res.status(400).send(err)
                })
        }
    })
})

registrationRouter.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/product',
    failureRedirect: '/user/login',
    failureFlash: true
}))
  

registrationRouter.post('/validateUsername', (req, res) => {
        User.findOne({ email: req.body.email })
            .then(user => user ? res.sendStatus(204) : res.sendStatus(200))
    })

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
    }
      
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/')
    }
    next()
}

module.exports = registrationRouter