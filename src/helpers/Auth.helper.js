const passport = require('passport');
const authHelper = {};

authHelper.login = passport.authenticate('loginU',{
    failureRedirect: '/signin',
    failureFlash: true
}), function (req,res,next) {
    return next();
}

authHelper.isAuthenticated = (req,res,next) => {
    if(req.isAuthenticated()) {
        return next();
    }else {
        req.flash('error_msg','Not authorized');
        res.redirect('/');
    }
}

authHelper.notAuthenticated = (req,res,next) => {
    if(!req.user) {
        return next();
    }else {
        req.flash('error_msg','First looged of count');
        res.redirect('/');
    }
}

//Exports
module.exports = authHelper;

