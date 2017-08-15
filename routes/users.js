var express = require('express');

var User = require('../models/user');
var Post = require('../models/post');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  
	
	var url = req.originalUrl;
	var n = url.lastIndexOf("/");
 	var paramValue = n!=0?url.substr(n+1,url.length-n-1):url;
	
	User.get(paramValue,function(err,user){
		if(!user)
		{	
			req.session.error = " user doesn't exists.";
			return res.redirect("/");
		}
		Post.get(user.name,function(err,posts){
			
			if (err) { req.session.error = err; return res.redirect('/');}
			res.render('user',{ title:'user',user: user.name,posts:posts, });
		});
	})
	
});



module.exports = router;
