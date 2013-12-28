var defaults = require("../lib/defaults"),
	Authorize = require("../lib/Authorize"),
	User = require("../lib/User"),
	RequestHandler = require("../lib/RequestHandler"),
	Log = require("../lib/Log").use("console");

var route = defaults.get("route");	

route.method = "post";
//route.level = Authorize.level.session.code | Authorize.level.ajax.code;
route.url = "/action/create";
route.route = function(req, res) {
	var user = defaults.get("user"),
		handler = new RequestHandler(req),
		e = defaults.get("error"),
		errors = [];
	
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
		e.errorText = "The field"+ (errors.length > 1 ? "s" : "") +" ("+ errors.join(", ") +") did not pass the validation!";
		res.send(JSON.stringify(e));
	}
	else {
		user.username = handler.body.get("username");
		user.password = handler.body.get("password");
		user.email = handler.body.isset("email") ? handler.body.get("email") : "";
		
		var u = User.fromUser(user);
		u.create(function(err, user) {
			if(err) {
				res.send(JSON.stringify(err));
			}
			else {
				/*
				{
					code: 0,
					successText: "User was successfully created!",
					data: {
						user: user
					}
				}
				*/			
				// Successfully created a user
				res.send("OKEEEEEEY WHEN THIS IS RETURNED TO THE CLIENT PLEASE REDIRECT TO HTTP://BOARDCAST.IN/LOGIN");
			}
		});
	}
}

module.exports = route;