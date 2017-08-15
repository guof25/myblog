var express = require('express');

var router = express.Router();
var Post = require('../models/post');
var util = require('../util/gfUtil');





/* GET reg page. */

/*
router.get('/', util.checkLogin);
router.get('/', function(req, res, next) 
{
  
	res.render('post', { title: 'post' });
});

*/

router.post('/', util.checkLogin);
router.post('/',function(req,res,next)
{
	var currentUser = req.session.user;
	var post =new Post(currentUser,req.body.post);
	post.save(function(err){
		if (err) { req.session.error = err;  res.redirect('/u/' + currentUser); }
		req.session.success = " post successfully! ";
		res.redirect('/u/'+ currentUser);
	});
});


module.exports = router;
