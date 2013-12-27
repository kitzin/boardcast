var Session = require("./Session"),
	Log = require("./Log").use("console"),
	defaults = require("./defaults");

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

Authorize.level = {};
Authorize.level.session = {
	code: 1,
	cb: function(req, res, next) {
		Log.info("though session");
		
		var s = new Session(req.session);
		if(!s.validToken(req.body.session_token)) {
			res.redirect("http://boardcast.in/?error=token");
			return;
		}
		
		next();
	}
}
Authorize.level.login = {
	code: 2,
	cb: function(req, res, next) {
		Log.info("though logged_in");
		
		var s = new Session(req.session);
		if(!s.isLogin()) {
			res.redirect("boardcast.in/login?error=login");
			return;
		}
		
		next();
	}
}
Authorize.level.ajax = {
	code: 3,
	cb: function(req, res, next) {
		Log.info("though ajax");
		
		if(req.headers["X-Requested-With"] !== "XMLHttpRequest") {
			res.send("Ajax plz");
			return;
		}
		
		next();
	}
}

module.exports = Authorize;