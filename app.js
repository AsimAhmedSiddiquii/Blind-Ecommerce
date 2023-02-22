var createError = require('http-errors');
require("dotenv").config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require("express-session")

var mongoose = require("mongoose");
mongoose.connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true, });

//requiring all files
var loginRouter = require('./routes/login');
var homeRouter = require('./routes/index')
var shopRouter = require('./routes/shop');
var contactRouter = require('./routes/contact');
var shoppingCartRouter = require('./routes/shopping-cart');
var ordersRoutes = require('./routes/orders');
var checkOutRouter = require('./routes/check-out');
var registerRouter = require('./routes/register');
var adminRouter = require('./routes/admin/adminMain')
var app = express();

// view engine setup
app.use(session({ secret: "7(U@ELqyuuF)*6*g", saveUninitialized: true, resave: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/home', homeRouter);
app.use('/shop', shopRouter);
app.use('/contact', contactRouter);
app.use('/shopping-cart', shoppingCartRouter);
app.use('/my-orders', ordersRoutes);
app.use('/check-out', checkOutRouter);
app.use('/registration', registerRouter);
app.use('/admin', adminRouter);
app.use('/', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
app.listen('8080', () => console.log('listening on 8080'));