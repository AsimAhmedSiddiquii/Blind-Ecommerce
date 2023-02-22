var express = require('express');
var router = express.Router();
var productModel = require('../models/product_details');
var userInfo;

router.get('/', function(req, res, next) {
    if (req.session.userLogin) {
        userInfo = { username: req.session.userLogin }

        var retreiveProData = productModel.find({ $and: [{ product_type: { $eq: 'Featured' } }, { product_tags: { $eq: 'Cloth' } }] });
        retreiveProData.exec(function(err, featureProData) {
            res.render('index', { featureProData, userInfo });
        });
    } else {
        res.redirect('/')
    }
});

module.exports = router;