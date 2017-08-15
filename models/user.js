var mongodb = require('./db');

function User(user) {
	this.name = user.name;
	this.password = user.password;
};



User.prototype.save = function save(callback) {
	var user = {
			name: this.name,
			password: this.password,
		   };

	mongodb.open(function(err, db) {
	         if (err) {
                 		return callback(err);
			   }
		// read users collection
		db.collection('users', function(err, collection) {
			if (err) {
					mongodb.close();
					return callback(err);
				}

	                 collection.ensureIndex('name', {unique: true});

			collection.insert(user, {safe: true}, function(err, user) {
					mongodb.close();
					return callback(err, user);
				});
		});
	});
};

//query and get user info.
User.get = function get(username, callback) {
	mongodb.open(function(err, db) {
	
		if (err) {
			return callback(err);
		}

		db.collection('users', function(err, collection) {
			if (err) {
					mongodb.close();
					return callback(err);
				}

			collection.findOne({name: username}, function(err, doc) {
				mongodb.close();
				if (doc) {
						var user = new User(doc);
						return callback(err, user);
				} else {
						return callback(err, null);
				}
			});
		});
	});
};

module.exports = User;