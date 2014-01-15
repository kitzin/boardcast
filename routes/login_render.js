var route = require("../lib/defaults").get("route"),
	Handler = require("../lib/RequestHandler");

route.url = "/login";
route.route = function(req, res) {
	var h = new Handler(req);
	h.session.setToken(function(token) {
		res.render("login", {
			title: "Boardcast - Login",
			token: token
		});
	});
}

module.exports = route;