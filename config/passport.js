const LocalStrategy = require('passport-local').Strategy
var User = require('../models/user.js')
const dbconfig = require('../config/DB-config')
const bcryt  = require('bcryptjs')

module.exports = function(passport){
    passport.use(new LocalStrategy(function(username, password, done){
        var query = {username: username}
        User.findOne(query, function(err, user){
            if (err) throw err
            if(!user){
                return done(null, false, {message: "No user found"})
            }

            console.log('matching user found')
            bcryt.compare(password, user.password, function(err, isMatch){
                if (err) throw err 
                if(isMatch){
                    return done(null, user)
                }
                else {
                    return done(null, false, {message: "Incorrect password"})
                }
            })
        })
    }))

    passport.serializeUser(function(user, done){
        done(null, user.id)
    })
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
            done(err, user)
        })
    })
}

