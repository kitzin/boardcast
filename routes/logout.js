var route = require("../lib/defaults").get("route"),
	Authorize = require("../lib/Authorize");

route.url = "/logout";
route.level = Authorize.level.login.code;
route.route = function(req, res) {
	res.send("Logging out");
}

module.exports = route;