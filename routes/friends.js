var RequestHandler = require("../lib/RequestHandler"),
	defaults = require("../lib/defaults"),
	Authorize = require("../lib/Authorize"),
	Log = require("../lib/Log").use("console"),
	Query = require("../lib/mysql").Query;
	
var route = defaults.get("route");

route.url = "/action/friends";
route.method = "post";
route.level = Authorize.level.login.code;
route.route = function(req, res) {
	
	var handler = new RequestHandler(req),
		e = defaults.get("error"),
		response = defaults.get("response");
		response.action = "FRIENDS";
	
	new Query("SELECT id, profile_picture, username, nickname, created FROM Users INNER JOIN Friends ON id=user_id OR id=friend_id WHERE (user_id = :id OR friend_id = :id) AND id != :id", {
		id: handler.session.get("user").id
	}).execute(function(err, rows) {
		if(err) {
			Log.fatal(JSON.stringify(err));
			e.code = 2;
			e.message = "Database failure!";
			response.error = e;
			res.send(JSON.stringify(response));
		} else {
			response.data = rows;
			res.send(JSON.stringify(response));
		}
	});
}

module.exports = route;