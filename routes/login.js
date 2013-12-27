var Session = require("../lib/Session"),
	defaults = require("../lib/defaults"),
	Authorize = require("../lib/Authorize");

var route = defaults.get("route");
	
route.level = Authorize.level.session.code | Authorize.level.ajax.code;
route.method = "post";
route.url = "/login";
route.route = function(req, res) {
	var s = new Session(req.session),
		e = defaults.get("error"),
		errors = [];
		
	if(!s.isset("username") || s.get("username") === "") {
		errors.push("username");
	}
	if(!s.isset("password") || s.get("password") === "") {
		errors.push("password");
	}
	
	if(errors.length >= 1) {
		e.code = User.error.VALIDATION;
		e.errorText = "The field"+ (errors.length > 1) ? "s" ? "" +" "+ errors.join(", ") +") was not filled in.";
		res.send(JSON.stringify(e));
	}
	else {
		var u = User.fromUserPass(s.get("username"), s.get("password"));
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
				s.login(user);
				res.send("OKEKEEEEEY YOU HAVE SUCCESSFULLY LOGGED IN YOU SNEEKY BASTARD! REDIRECT TO HTTP://BOARDCAST.IN/APP");
			}
		});
	}
}

module.exports = route;