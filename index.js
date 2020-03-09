const express = require('express');
const  app = express();
const   passport = require('passport');
const   auth = require('./auth');
const   cookieParser = require('cookie-parser');
const   cookieSession = require('cookie-session');

auth(passport);
app.use(passport.initialize());

app.use(cookieSession({
    name: 'session',
    keys: ['rishabh'],
    maxAge: 24 * 60 * 60 * 1000
}));
app.use(cookieParser());

app.get('/', (req, res) => {
    if (req.session.token) {
        res.cookie('token', req.session.token);
        res.send(" you are logged in"    
        );
    } else {
        res.cookie('token', '')
        res.send( " you are logged out" );
    }
});

app.get('/logout', (req, res) => {
    req.logout();
    req.session = null;
    res.redirect('/');
});

app.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/userinfo.profile']
}));

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/'
    }),
    (req, res) => {
        console.log(req.user.token);
        req.session.token = req.user.token;
        res.redirect('/');
    }
);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});