var express = require('express');
var router = express.Router();
var loginModel = require('../models/login');

router.get('/', function (req, res, next) {
    res.render('login', { msg: '', userInfo: '' });
});

router.post('/', function (req, res, next) {
    var username = req.body.username.toLowerCase();
    var password = req.body.password;

    var checkLogin = loginModel.countDocuments({ $and: [{ username: { $eq: username } }, { password: { $eq: password } }] });
    checkLogin.exec(function (err, data) {
        if (data > 0) {
            req.session.userLogin = username;
            res.redirect('/home');
        } else if (username == "admin" && password == "admin123") {
            req.session.adminLogin = username;
            res.redirect("/admin");
        } else {
            res.render('login', { msg: 'User Not Found', userInfo: '' });
        }
    });
});

router.get('/signout', function (req, res, next) {
    req.session.destroy()
    res.redirect('/')
});

module.exports = router;