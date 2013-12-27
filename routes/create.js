var defaults = require("../lib/defaults"),
	Authorize = require("../lib/Authorize"),
	User = require("../lib/User"),
	Session = require("../lib/Session");

var route = defaults.get("route");	

route.method = "post";
route.level = Authorize.level.session.code | Authorize.level.ajax.code;
route.url = "/create";
route.route = function(req, res) {
	var user = defaults.get("user"),
		s = new Session(req.session),
		e = defaults.get("error"),
		errors = [];
	
	if(!s.isset("username") || !User.valid.username(s.get("username"))) {
		errors.push("username");
	}
	if(!s.isset("password") || !User.valid.password(s.get("password"))) {
		errors.push("password");
	}
	if(s.isset("email") && !User.valid.email(s.get("email"))) {
		errors.push("email");
	}
	
	if(errors.length >= 1) {
		e.errorText = "The field" + (errors.length > 1) ? "s" : "" + " (" + errors.join(", ") + ") was not filled in.";
		res.send(JSON.stringify(e));
	}
	else {
		user.username = s.get("username");
		user.password = s.get("password");
		user.email = s.isset("email") ? s.get("email") : "";
		
		var u = User.fromUser(user);
		u.create(function(err, user) {
			if(err) {
				res.send(JSON.stringify(err));
			}
			else {
				
				// Successfully created a user
				res.send("OKEEEEEEY WHEN THIS IS RETURNED TO THE CLIENT PLEASE REDIRECT TO HTTP://BOARDCAST.IN/LOGIN");
			}
		});
	}
}

module.exports = route;