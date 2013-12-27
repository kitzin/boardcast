var Session = require("./Session"),
	Log = require("./Log").use("console");

function Authorize(route) {
	this.route = route;
}

Authorize.prototype.add = function(app) {
	var self = this,	
		params = [this.route.url];
	
	for(var i in Authorize.level) {
		var level = Authorize.level[i];
		if((self.route.level & level.code) !== 0) {
			params.push(level.cb);
		}
	}
	
	params.push(this.route.route);
	app[this.route.method].apply(app, params);
}

Authorize.session = function(req, res, next) {
	
	next();
}
Authorize.loggedIn = function(req, res, next) {
	if(Session.loggedin() === false) {
		res.redirect("http://boardcast.in/login");
	} else
		next();
}

Authorize.level = {};
Authorize.level.session = {
	code: 1,
	cb: function(req, res, next) {
		Log.info("though session");
		next();
	}
}
Authorize.level.logged_in = {
	code: 2,
	cb: function(req, res, next) {
		Log.info("though logged_in");
		next();
	}
}

module.exports = Authorize;