var express = require('express');
var util = require('../util/gfUtil');
var router = express.Router();



/* GET reg page. */


router.get('/', util.checkLogin);
router.get('/', function(req, res, next) 
{
  
	req.session.error = null;
	req.session.user = null;
	req.session.success = "logout successfully!";
	res.redirect("/");
});


module.exports = router;
