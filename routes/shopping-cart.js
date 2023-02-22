var express = require('express');
var path = require('path');
var router = express.Router();

var productModel = require('../models/product_details');
var cartModel = require('../models/cartDetails');
var userInfo;

router.get('/addProduct/:proName', async function (req, res, next) {
  var proName = req.params.proName;
  if (req.session.userLogin) {
    var singleData = await productModel.findOne({ product_name: proName });
    var saveCartData = new cartModel({
      user_name: req.session.userLogin,
      product_image: singleData['product_image'],
      product_name: singleData['product_name'],
      product_price: singleData['product_price'],
      product_color: singleData['product_color'],
      product_size: singleData['product_size'],
      product_tags: singleData['product_tags']
    });

    await saveCartData.save()
    res.redirect('/shopping-cart');
  } else {
    res.redirect('/')
  }
});

router.get('/', async function (req, res, next) {
  userInfo = { username: req.session.userLogin }
  if (userInfo) {
    var cartData = await cartModel.find({ user_name: req.session.userLogin });
    res.render('shopping-cart', { cartData, userInfo });
  } else {
    res.redirect('/')
  }
});

router.get('/proDelete/:proName', async function (req, res, next) {
  var proName = req.params.proName;
  await cartModel.findOneAndDelete({ product_name: proName });
  res.redirect('/shopping-cart');
});

module.exports = router;