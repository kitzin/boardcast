var route = require("../lib/defaults").get("route");

route.url = "/create";
route.route = function(req, res) {
	res.render("create");
}

module.exports = route;