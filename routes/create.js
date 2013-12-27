var route = require("../lib/defaults").get("route"),
	Authorize = require("../lib/Authorize");

route.method = "post";
route.level = Authorize.level.session.code;
route.url = "/create";
route.route = function(req, res) {
	res.send("create");
}

module.exports = route;