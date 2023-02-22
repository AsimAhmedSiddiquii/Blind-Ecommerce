var express = require('express');
var router = express.Router();
var userInfo;
/* GET home page. */
router.get('/', function(req, res, next) {
  userInfo={username:req.session.userLogin}
  res.render('contact',{userInfo});
});


module.exports = router;
