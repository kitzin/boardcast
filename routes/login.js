var Session = require("../lib/Session"),
	route = require("../lib/defaults").get("route"),
	Authorize = require("../lib/Authorize");

route.level = Authorize.level.session.code | Authorize.level.logged_in.code;
route.method = "post";
route.url = "/login";
route.route = function(req, res) {
	/*var u = User.fromUserPass(req.body.username, req.body.password);
	u.login(function(err, user) {
		if(err) {
			res.send(JSON.stringify(err));
		} else {
			res.send(JSON.stringify(user));
		}
	});*/
	
	res.send("login");
}

module.exports = route;