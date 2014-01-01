var defaults = require("../lib/defaults"),
	Authorize = require("../lib/Authorize"),
	User = require("../lib/User"),
	RequestHandler = require("../lib/RequestHandler"),
	Log = require("../lib/Log").use("console");

var route = defaults.get("route");	

route.method = "post";
route.level = Authorize.level.session.code; //| Authorize.level.ajax.code;
route.url = "/action/create";
route.route = function(req, res) {
	var user = defaults.get("user"),
		handler = new RequestHandler(req),
		e = defaults.get("error"),
		errors = [],
		response = defaults.get("response");
		response.action = "CREATE";
		
	if(handler.body.get("auth_cookie") !== "") {
		// Bot
	}
	
	if(!handler.body.isset("username") || !User.valid.username(handler.body.get("username"))) {
		errors.push("username");
	}
	if(!handler.body.isset("password") || !User.valid.password(handler.body.get("password"))) {
		errors.push("password");
	}
	
	if(handler.body.get("email") !== "") {
		if(handler.body.isset("email") && !User.valid.email(handler.body.get("email"))) {
			errors.push("email");
		}
	}
	
	if(errors.length >= 1) {
		e.code = User.error.VALIDATION;
		e.message = "The field"+ (errors.length > 1 ? "s" : "") +" ("+ errors.join(", ") +") did not pass the validation!";
		
		response.error = e;
		res.send(JSON.stringify(response));
	}
	else {
		user.username = handler.body.get("username");
		user.password = handler.body.get("password");
		user.email = handler.body.isset("email") ? handler.body.get("email") : "";
		
		var u = User.fromUser(user);
		u.create(function(err, user) {
			if(err) {
				response.error = err;
				res.send(JSON.stringify(response));
			}
			else {
				user = User.harmful(user);
				response.data.user = user;
				res.send(JSON.stringify(response));
			}
		});
	}
}

module.exports = route;