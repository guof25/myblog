var express = require('express');

var router = express.Router();

var crypto = require("crypto");

var User = require('../models/user');


var util = require('../util/gfUtil');





/* GET reg page. */


router.get('/', util.checkNotLogin);
router.get('/', function(req, res, next) 
{
  
	res.render('login', { title: 'login' });
});



router.post('/', util.checkNotLogin);
router.post('/',function(req,res,next)
{
	req.session.error = {};
	req.session.success = {};

	var md5 = crypto.createHash('md5');
	var password = md5.update(req.body.password).digest('base64');

	User.get(req.body.username, function(err, user) {
		if (!user) {
			req.session.error = "user not exist!";
			return res.redirect('/login');
		}
		if (user.password != password) {
			req.session.error = "password is wrong!";
			return res.redirect('/login');
		}
		req.session.error = null;		
		req.session.user = user.name;
		req.session.success =  'login successfully!';
		res.redirect('/');
	});
});


module.exports = router;
