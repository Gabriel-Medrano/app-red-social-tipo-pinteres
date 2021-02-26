const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphdb = require('express-handlebars');
const handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const Esession = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');

//Initalization
const app = express();

//Settings
app.set('port',process.env.PORT || 3000);
app.set('views',path.resolve('./src/views'));
app.engine('.hbs',exphdb({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    handlebars: allowInsecurePrototypeAccess(handlebars),
    helpers: require('./helper')
}));
app.set('view engine','.hbs');

//Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(Esession({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Variables global
app.use((req,res,next) => {
    res.locals.Msg_success = req.flash('success_msg');
    res.locals.Msg_error = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;

    next();
});

//Routes
app.use(require('../routes/publicYprivate.route'));
app.use(require('../routes/user.route'));
app.use(require('../routes/publication.route'));

//Static files
app.use(express.static(path.resolve('./src/public')));

//Exports
module.exports = app;