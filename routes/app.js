var route = require("../lib/defaults").get("route"),
	auth = require("../lib/Authorize");

route.url = "/app";
//route.level = auth.level.login.code;
route.route = function(req, res) {
	res.render("app", {
		title: "Boardcast - App"
	});
}

module.exports = route;