const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const User = require('../models/user.model');

passport.use('loginU',new localStrategy({
    usernameField: 'nick_name',
    passwordField: 'password'
}, async (nick_name,password,done) => {
    const user = await User.findOne({nick_name});
    if(!user) {
        return done(null,false,{message: 'User not found'});
    }else {
        const compare = await user.comparePassword(password);
        if(compare) {
            return done(null,user);
        }else {
            return done(null,false,{message: 'Password incorrected'});
        }
    }
}));

//serialize
passport.serializeUser((user,done) => {
    done(null,user.id);
});

//deserialize
passport.deserializeUser((id,done) => {
    User.findById(id,(err,user) => {
        done(err,user);
    });
});