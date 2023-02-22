var express = require('express');
var router = express.Router();
var path = require('path');

var currentDateTime = new Date();
var orderDataModel = require('../models/orderDetails')
var orderdProductModel = require('../models/orderProduct');
var cartModel = require('../models/cartDetails');

var userInfo;
var now = currentDateTime.getDate() + "-" + (currentDateTime.getMonth() + 1) + "-" + currentDateTime.getFullYear();

router.get('/', async function (req, res, next) {
  userInfo = { username: req.session.userLogin }
  if (userInfo) {
    var cartData = await cartModel.find({ user_name: req.session.userLogin });
    res.render('check-out', { cartData, userInfo });
  } else {
    res.redirect('/')
  }
});

router.post('/', async function (req, res, next) {

  var order_id = new Date().valueOf();

  var fir = req.body.fir;
  var last = req.body.last;
  var address = req.body.address;
  var pinCode = req.body.pinCode;
  var city = req.body.city;
  var email = req.body.email;
  var phone = req.body.phone;
  var paymentMethod = req.body.paymentMethod;
  var phone = req.body.phone;
  var placeOrder = req.body.placeOrder;

  var cartLength = req.body.cartLength;

  if (placeOrder && req.session.userLogin) {
    for (i = 1; i <= parseInt(cartLength); i++) {
      var insertProduct = new orderdProductModel({
        order_id: order_id,
        product_name: req.body['orderProName' + i],
        product_total: req.body['orderProTotal' + i],
      });
      await insertProduct.save();
    }

    var insertOrder = new orderDataModel({
      order_date: now,
      order_id: order_id,
      user_name: req.session.userLogin,
      full_name: fir + " " + last,
      address: address,
      pincode: pinCode,
      city: city,
      email_id: email,
      contact: phone,
      payment_method: paymentMethod,
      order_status: 'Pending'
    });
    await insertOrder.save();
    await cartModel.remove({ user_name: req.session.userLogin })
  } else {
    res.redirect('/home');
  }
});

module.exports = router;