var express = require('express');

var router = express.Router();
var crypto = require("crypto");

var User = require('../models/user');


var util = require('../util/gfUtil');


/* GET reg page. */


router.get('/', util.checkNotLogin);
router.get('/', function(req, res, next) 
{
  
	res.render('reg', { title: 'register' });
});


router.post('/', util.checkNotLogin);
router.post('/',function(req,res,next)
{

	var pwd = req.body.password.replace(/\s+/g,'');
	var pwdr = req.body.passwordrepeat.replace(/\s+/g,'');
	var uname = req.body.username.replace(/\s+/g,'');
     
	if( uname.length<1 || pwd.length <1 || pwdr.length <1)
	{
		req.session.error = " name or pwd must not be empty!";	
		return res.redirect("/reg");	
	}

	if ( pwdr != pwd )
	{	
		req.session.error = " pwds are not same!";	
		return res.redirect("/reg");	
	}


	var md5 = crypto.createHash('md5');
	var password = md5.update(pwd).digest('base64');
	var newUser = new User({
					name: uname,
					password: password,
				});

	
	User.get(newUser.name, function(err, user) {
		if (user){ err = 'Username already exists.';}
		if (err) { 
			req.session.error = err;
			return res.redirect('/reg');}

		newUser.save(function(err) {
			if (err) 
			{ req.session.error = " user save failed.";
			  res.redirect('/reg');
			}
			
			req.session.error = null;
			req.session.user = newUser.name;
			req.session.success = "register success";
			res.redirect('/');
		});
	 });	

});

module.exports = router;
