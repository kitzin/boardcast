var RequestHandler = require("../lib/RequestHandler"),
	defaults = require("../lib/defaults"),
	Authorize = require("../lib/Authorize"),
	User = require("../lib/User"),
	Log = require("../lib/Log").use("console");

var route = defaults.get("route");
	
route.level = Authorize.level.session.code; //| Authorize.level.ajax.code;
route.method = "post";
route.url = "/action/login";
route.route = function(req, res) {
	
	var handler = new RequestHandler(req);
		e = defaults.get("error"),
		errors = [],
		response = defaults.get("response");
		response.action = "LOGIN";
	
	if(handler.body.get("auth_cookie") !== "") {
		// Bot
	}
	
	if(!handler.body.isset("username") || handler.body.get("username") === "") {
		errors.push("username");
	}
	if(!handler.body.isset("password") || handler.body.get("password") === "") {
		errors.push("password");
	}
	
	if(errors.length >= 1) {
		e.code = User.error.VALIDATION;
		e.message = "The field"+ (errors.length > 1 ? "s" : "") + " ("+ errors.join(", ") +") was not filled in.";
		
		response.error = e;
		res.send(JSON.stringify(response));
	}
	else {
		var u = User.fromUserPass(handler.body.get("username"), handler.body.get("password"));
		u.login(function(err, user) {
			if(err) {
				response.error = err;
				res.send(JSON.stringify(response));
			}
			else {
				user = User.harmful(user);
				response.data.user = user;
				handler.session.login(user);
				res.send(JSON.stringify(response));
			}
		});
	}
}

module.exports = route;