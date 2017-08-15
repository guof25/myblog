var express = require('express');
var Post = require('../models/post');
var router = express.Router();



/* GET home page. */

router.get('/', function(req,res, next) 
{
  
	
	Post.get(null,function(err,posts){
		if(err){ posts = [];}
		res.render('index', { title:'HomePage',user:req.session.user,posts:posts });


	});
});




module.exports = router;
