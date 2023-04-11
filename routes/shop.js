var express = require('express');
var router = express.Router();
var productModel = require('../models/product_details');
var orderDataModel = require('../models/orderDetails');
var getAllProduct = productModel.find({});
var stateChange, userInfo;

router.get('/:cat?', async function (req, res, next) {
    userInfo = { username: req.session.userLogin }
    if (req.session.userLogin) {
        var cat = req.params.cat ? req.params.cat : "gents";
        var options = {
            offset: 1,
            limit: 9
        };
        stateChange = 1;

        var products = await productModel.find({ product_category: cat })

        productModel.paginate({ product_category: cat }, options).then(function (result) {
            res.render('shop', {
                recordChangeIndicater: stateChange,
                records: products,
                current: result.offset,
                result: result.total,
                pages: Math.ceil(result.total / result.limit),
                userInfo: userInfo
            });
        });
    } else {
        res.redirect('/')
    }

});

router.post('/', async function (req, res, next) {

    var filters = {}
    if (req.body.category) {
        filters['product_category'] = { $in: req.body.category }
    }

    if (req.body.brandCheck) {
        filters['product_brand'] = { $in: req.body.brandCheck }
    }

    if (req.body.minPrice && req.body.maxPrice) {
        filters['product_price'] = { $gte: parseInt(req.body.minPrice), $lte: parseInt(req.body.maxPrice) }
    }

    if (req.body.product_size) {
        filters['product_size'] = { $in: req.body.product_size }
    }

    if (req.body.color) {
        filters['product_color'] = { $in: req.body.color }
    }

    var options = {
        offset: 1,
        limit: 9
    };
    stateChange++;

    var posNumber = req.body.pos;
    var name = "name".concat(posNumber);
    var posData = req.body[name];
    console.log(posData)

    if (posData != null) {
        var orderData = productModel.findOne({ _id: posData });
        orderData.exec(function (err, data) {
            if (err) throw err;
            if (data) {
                var orderId = 1;
                var productName = data.product_name;
                var productCategory = data.product_category;
                var productBrand = data.product_brand;
                var productPrice = data.product_price;
                var productColor = data.product_color;
                var productSize = data.product_size;
                var productTags = data.product_tags;
                var insertOrder = new orderDataModel({
                    order_id: orderId,
                    product_name: productName,
                    product_category: productCategory,
                    product_brand: productBrand,
                    product_price: productPrice,
                    product_color: productColor,
                    product_size: productSize,
                    product_tags: productTags,
                });
                insertOrder.save(function (err, doc) {
                    if (err) throw err;
                    console.log("order data save in order table" + doc);
                });
            }
        });
    }

    console.log(filters)
    var products = await productModel.find(filters)

    productModel.paginate({
        $or: [{
            $and: [
                { filters }
            ]
        }
        ]
    }, options).then(function (result) {
        res.render('shop', {
            recordChangeIndicater: stateChange,
            records: products,
            current: result.offset,
            total: result.total,
            pages: Math.ceil(result.total / result.limit),
            userInfo
        });
    });
});

router.get('/pagination/:page', function (req, res, next) {
    var perPage = 9;
    stateChange = 0;

    var page = req.params.page || 1;
    getAllProduct.skip((perPage * page) - perPage)
        .limit(perPage).exec(function (err, data) {
            if (err) throw err;
            productModel.countDocuments({}).exec((err, count) => {
                res.render('shop', {
                    recordChangeIndicater: stateChange,
                    records: data,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    userInfo: ''
                });
            });
        });
});

module.exports = router;