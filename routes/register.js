var express = require('express');
var router = express.Router();

var loginModel = require('../models/login');

router.get('/', function (req, res, next) {
    res.render('register', { msg: '', userInfo: '' });
});

router.post('/', function (req, res, next) {
    var name = req.body.name;
    var contact = req.body.contact;
    var username = req.body.username.toLowerCase();
    var pass = req.body.pass;

    loginDetails = new loginModel({
        name: name,
        contact: contact,
        username: username,
        password: pass,
    });
    loginDetails.save(function (err, data) {
        if (err) throw err;
        console.log(data);
        res.render('login', { msg: 'Registered Successfully', userInfo: '' });
    });

});

module.exports = router;