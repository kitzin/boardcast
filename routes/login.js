var Session = require("../lib/Session"),
	route = require("../lib/defaults").get("route"),
	Authorize = require("../lib/Authorize");

route.level = Authorize.level.session.code | Authorize.level.ajax.code;
route.method = "post";
route.url = "/login";
route.route = function(req, res) {
	res.send("login");
}

module.exports = route;