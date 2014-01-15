var Query = require("../lib/mysql").Query,
	route = require("../lib/defaults").get("route");

route.url = "/";
route.route = function(req, res) {	
	res.render("index", {
		title: "Boardcast"
	});
}

module.exports = route;