var express = require('express');
var router = express.Router();
var path = require('path');
var multer = require('multer');

var productModel = require('../../models/product_details');
var orderDataModel = require('../../models/orderDetails');
var orderProductModel = require('../../models/orderProduct');

var currentDateTime = new Date();
var currentDate = currentDateTime.getDate() + "-" + (currentDateTime.getMonth() + 1) + "-" + currentDateTime.getFullYear();
var userInfo, orderData, alreadyExistFilePath;

var Storage = multer.diskStorage({
    destination: "./public/images/products/",
    filename: (req, files, cb) => {
        cb(null, files.originalname);
    },
});

var upload = multer({
    storage: Storage
}).single('proImage');

router.get('/', async function (req, res, next) {
    userInfo = { adminUser: req.session['adminLogin'] };
    orderData = await orderDataModel.find();
    proData = await productModel.find();
    if (orderData[0]) {
        orderData[0]['orderStatus'] = "Total";
    }
    res.render('./admin/adminMain', { proData, singleData: '', userInfo, orderData, singleProData: '' });
});

router.get('/edit/(:proID)', async function (req, res, next) {
    var singleData = await productModel.findById(req.params.proID);
    alreadyExistFilePath = singleData.product_image;
    res.render('./admin/adminMain', { proData: '', singleData, userInfo: '', orderData: '', singleProData: '' });
});


router.post('/', upload, async function (req, res, next) {
    console.log(req.file)

    var proName = req.body.proName;
    var proDesc = req.body.proDesc;
    var proPrice = req.body.proPrice;
    var proCat = req.body.proCat.toLowerCase();
    var proBrand = req.body.proBrand;
    var proColor = req.body.proColor;
    var proSize = req.body.proSize;
    var proTag = req.body.proTag;
    var proStock = req.body.proStock;
    var proType = req.body.proType;
    if (req.file) {
        var proImagePath = req.file.path.substring(6);
    }
    var addPro = req.body.addPro;
    var id = req.body.proID;
    console.log(proImagePath)

    if (addPro) {
        console.log("condition true");
        var insertProduct = new productModel({
            product_name: proName,
            product_description: proDesc.trim(),
            product_category: proCat,
            product_brand: proBrand,
            product_price: proPrice,
            product_color: proColor,
            product_size: proSize,
            product_tags: proTag,
            product_stock: proStock,
            product_type: proType,
            product_image: proImagePath
        });
        insertProduct.save(function (err, pro) {
            if (err) throw err;
            console.log(pro);
            res.redirect('/admin')
        });
    } else {
        var update = {
            product_name: proName,
            product_description: proDesc,
            product_category: proCat,
            product_brand: proBrand,
            product_price: proPrice,
            product_color: proColor,
            product_size: proSize,
            product_tags: proTag,
            product_stock: proStock,
            product_type: proType
        }

        if (proImagePath) {
            update["product_image"] = proImagePath
        }

        console.log(update)

        await productModel.findByIdAndUpdate(id, update).exec()
        res.redirect('/admin')
    }
});

router.get('/delete/(:proID)', async function (req, res, next) {
    await productModel.findByIdAndDelete(req.params.proID);
    res.redirect('/admin')
});

router.get('/orders/:orderStatus', function (req, res, next) {
    orderStatus = req.params.orderStatus;
    if (orderStatus == 'Daily') {
        var retreivOrderData = orderDataModel.find({ order_date: currentDate }).sort({ order_status: 1 });
        retreivOrderData.exec(function (err, Data) {
            console.log(Data);
            Data[0] ? Data[0]['orderStatus'] = orderStatus : Data = 0;
            orderData = Data
            res.render('./admin/adminMain', { proData: '', singleData: '', userInfo, orderData, singleProData: '' });
        });
    } else {
        var retreivOrderData = orderDataModel.find({ $and: [{ order_status: { $eq: orderStatus } }, { order_date: { $eq: currentDate } }] }).sort({ order_status: 1 });
        retreivOrderData.exec(function (err, Data) {
            Data[0] ? Data[0]['orderStatus'] = orderStatus : Data = 0;
            orderData = Data
            res.render('./admin/adminMain', { proData: '', singleData: '', userInfo, orderData, singleProData: '' });
        });
    }
});


router.get('/fetchproduct/:orderID', async function (req, res, next) {
    var orderID = req.params.orderID;
    var singleProData = await orderProductModel.find({ order_id: parseInt(orderID) });
    console.log(singleProData);
    res.render('./admin/adminMain', { proData: '', singleData: '', userInfo, orderData, singleProData });
});

router.get('/changeStatus/:actionBtn/:orderID', function (req, res, next) {
    var orderID = req.params.orderID;
    var actionBtn = req.params.actionBtn;
    if (actionBtn == 'placed') {
        orderDataModel.findOneAndUpdate({ order_id: parseInt(orderID) }, {
            order_status: 'Order placed',
        }).exec(function (err, data) {
            console.log(data);
            if (err) throw err;
            res.redirect('/admin')
        });
    } else {
        orderDataModel.findOneAndUpdate({ order_id: parseInt(orderID) }, {
            order_status: 'Order Cancelled'
        }).exec(function (err) {
            if (err) throw err;
            res.redirect('/admin')
        });
    }
});

router.get('/logout', function (req, res, next) {
    req.session.destroy(function (err) { })
    res.redirect('/')
});

module.exports = router;