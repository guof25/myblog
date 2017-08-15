exports.checkLogin = function(req, res, next) {
	if (!req.session.user) {
		req.session.error = "Not login!";
		req.session.success = null;
		return res.redirect('/login');
	}
	next();
}

exports.checkNotLogin = function(req, res, next) {
	if (req.session.user) {
		req.session.error = "Already logined!";
		req.session.success = null;
		return res.redirect('/');
	}
	next();
}


