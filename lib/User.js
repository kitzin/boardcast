﻿var Query = require("./mysql").Query,
	bcrypt = require("bcrypt"),
	crypto = require("crypto"),
	Log = require("./Log");

var defaults = {
	user: function() {
		return {
			username: "", 
			password: "",
			salt: "", 				
			created: 0,
			last_login: 0,
			friends: [],
			profile_picture: "Default Picture"
		};
	},
	error: function() {
		return {
			code: 0,
			errorText: ""
		}
	}
};

var User = {
	queries: {},
	error: {}
};

/* default queries */
User.queries.new = "INSERT INTO `Users`(`username`, `password`, `salt`, `created`, `last_login`, `friends`, `profile_picture`) VALUES (:username, :password, :salt, :created, :last_login, :friends, :profile_picture)";
User.queries.exists = "SELECT COUNT(*) FROM `Users` WHERE `Users`.`username` = :username LIMIT 1";
User.queries.login = "SELECT * FROM `Users` WHERE `Users`.`username` = :username LIMIT 1";

/* error codes */
User.error.DB_ERROR = 1;
User.error.EXIST = 2;
User.error.FAILED_LOGIN = 3;


User.instance = function() {
	this.user = defaults.user();
}
User.instance.prototype.set = function(name, value) {
	this.user[name] = value;
}
User.instance.prototype.exist = function(cb) {
	var self = this;
	new Query(User.queries.exists, { username: self.user.username })
	.execute(function(err, rows) {
		if(!err) {
			cb(null, rows.length === 0);
		} else {
			Log.fatal(JSON.stringify(err));
			var e = defaults.error();
			e.code = User.error.DB_ERROR;
			e.errorText = "Database failure!";
			cb(e);
		}
	});
}
User.instance.prototype.generatePassword = function(cb) {	
	var self = this;
	bcrypt.genSalt(10, function(err, bSalt) {
		var saltLen = (Math.floor(Math.random() * 20) + 30);
		crypto.randomBytes(saltLen, function(ex, buff) {
			var salt = buff.toString("base64");
			bcrypt.hash((self.user.password + salt), bSalt, function(err, hash) {
				cb(hash, salt);
			});
		});
	});
}
User.instance.prototype.passwordMatch = function(hash, salt, cb) {
	bcrypt.compare((this.user.password + salt), hash, function(err, res) {
		cb(res);
	});
}
User.instance.prototype.save = function(cb) {
	
}
User.instance.prototype.create = function(cb) {
	var self = this;
	this.exist(function(err, exists) {
		if(err) {
			cb(err);
		} else {
			if(exists === true) {
				var e = defaults.error();
				e.code = User.error.EXIST;
				e.errorText = "User already exists";
				cb(e);
			} else {				
				self.generatePassword(function(hash, salt) {
					self.user.password = hash;
					self.user.salt = salt;
					self.user.created = new Date().getTime();
					self.user.friends = JSON.stringify(self.user.friends);
					
					new Query(User.queries.new, self.user)
					.execute(function(err, rows) {
						if(err) {
							var e = defaults.error();
							e.code = User.error.DB_ERROR;
							e.errorText = "Database failure!";
							cb(e);
						} else {
							cb(null, self.user);
						}
					});
				});
			}	
		}
	});
}
User.instance.prototype.login = function(cb) {
	var self = this;
	new Query(User.queries.login, {
		username: self.user.username
	}).execute(function(err, rows) {
		if(err) {
			var e = defaults.error();
			e.code = User.error.DB_ERROR;
			e.errorText = "Database failure!";
			cb(e);
		} else {
			if(rows.length === 0) {
				var e = defaults.error();
				e.code = User.error.FAILED_LOGIN;
				e.errorText = "Incorrect username or password.";
				cb(e);
			} else {
				self.passwordMatch(rows[0].password, rows[0].salt, function(match) {
					if(match === false) {
						var e = defaults.error();
						e.code = User.error.FAILED_LOGIN;
						e.errorText = "Incorrect username or password.";
						cb(e);
					} else {
						cb(null, rows[0]);
					}
				});
			}
		}
	});
}

/* get user */
User.User = function() { return new User.instance(); }
User.fromID = function(id) {
	var u = new User.instance();
	u.set("id", id);
	
	return u;
}
User.fromUserPass = function(username, password) {
	var u = new User.instance();
	u.set("username", username);
	u.set("password", password);
	
	return u;
}

module.exports = User;





