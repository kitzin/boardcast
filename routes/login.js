var RequestHandler = require("../lib/RequestHandler"),
	defaults = require("../lib/defaults"),
	Authorize = require("../lib/Authorize"),
	User = require("../lib/User"),
	Log = require("../lib/Log").use("console");

var route = defaults.get("route");
	
//route.level = Authorize.level.session.code | Authorize.level.ajax.code;
route.method = "post";
route.url = "/action/login";
route.route = function(req, res) {
	
	var handler = new RequestHandler(req);
		e = defaults.get("error"),
		errors = [];
	
	if(!handler.body.isset("username") || handler.body.get("username") === "") {
		errors.push("username");
	}
	if(!handler.body.isset("password") || handler.body.get("password") === "") {
		errors.push("password");
	}
	
	if(errors.length >= 1) {
		e.code = User.error.VALIDATION;
		e.errorText = "The field"+ (errors.length > 1 ? "s" : "") + " ("+ errors.join(", ") +") was not filled in.";
		res.send(JSON.stringify(e));
	}
	else {
		var u = User.fromUserPass(handler.body.get("username"), handler.body.get("password"));
		u.login(function(err, user) {
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
				// Successfully logged in YEAH!
				//var s = new Session(req.session);
				//s.login(user);
				handler.session.login(user);
				res.send("OKEKEEEEEY YOU HAVE SUCCESSFULLY LOGGED IN YOU SNEEKY BASTARD! REDIRECT TO HTTP://BOARDCAST.IN/APP");
			}
		});
	}
}

module.exports = route;