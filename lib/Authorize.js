var RequestHandler = require("./RequestHandler"),
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
		Log.info("though session check");
		
		var h = new RequestHandler(req);
		if(typeof h.body.get("token") === "undefined" || !h.session.validToken(h.body.get("token"))) {
			// Send error
			res.redirect("/?error=token");
		}
		else {
			next();
		}
		
	}
}
Authorize.level.login = {
	code: 2,
	cb: function(req, res, next) {
		Log.info("though login check");
		
		var h = new RequestHandler(req);
		if(!h.session.isLogin()) {
			// Send error 
			Log.info("redirecting");
			res.redirect("/login?error=login");
		}
		else {
			next();
		}
		
	}
}
Authorize.level.ajax = {
	code: 4,
	cb: function(req, res, next) {
		Log.info("though ajax check");
		
		if(req.headers["X-Requested-With"] !== "XMLHttpRequest") {
			// Send error
			res.send("Ajax plz");
		}
		else {
			next();
		}
	}
}

module.exports = Authorize;