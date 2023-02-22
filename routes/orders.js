var express = require('express');
var router = express.Router();

var orderDetails = require('../models/orderDetails');
var orderProduct = require('../models/orderProduct');

var userInfo;

router.get('/', async function (req, res, next) {
  userInfo = req.session.userLogin;
  if (userInfo) {
    var orders = []
    var orderData = await orderDetails.find({ user_name: userInfo });

    for (var i = 0; i < orderData.length; i++) {
      var obj = {}
      obj.order_date = orderData[i].order_date;
      obj.order_status = orderData[i].order_status;
      obj.delAddress = orderData[i].address + ', ' + orderData[i].city + ', ' + orderData[i].pincode;
      var orderProds = await orderProduct.find({ order_id: orderData[i].order_id });
      obj.prods = orderProds;
      orders.push(obj)
    }
    console.log(orders)
    res.render('my-orders', { orders, userInfo });
  } else {
    res.redirect('/')
  }
});

module.exports = router;