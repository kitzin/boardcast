var route = require("../lib/defaults").get("route");

route.url = "/login";
route.route = function(req, res) {
	res.render("login");
}

module.exports = route;