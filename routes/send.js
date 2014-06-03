var RequestHandler = require("../lib/RequestHandler"),
	defaults = require("../lib/defaults"),
	Authorize = require("../lib/Authorize"),
	Log = require("../lib/Log").use("console"),
	Query = require("../lib/mysql").Query;
	
var route = defaults.get("route");

route.url = "/action/addfriend";
route.method = "post";
route.level = Authorize.level.login.code;
route.route = function(req, res) {
	
	var handler = new RequestHandler(req),
		e = defaults.get("error"),
		response = defaults.get("response");
		response.action = "SENDMESSAGE";
	
	
}

module.exports = route;