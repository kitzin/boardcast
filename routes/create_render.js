var route = require("../lib/defaults").get("route"),
	Handler = require("../lib/RequestHandler");

route.url = "/create";
route.route = function(req, res) {
	var h = new Handler(req);
	h.session.setToken(function(token) {
		res.render("create", {
			title: "Boardcast - Create User",
			token: token
		});	
	});
}

module.exports = route;