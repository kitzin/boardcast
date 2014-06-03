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
		response.action = "ADDFRIEND";
	
	if(handler.body.get("name") === null) {
		e.code = 101;
		e.message = "Fill in all fields!";
		response.error = e;
		res.send(JSON.stringify(response));
	} else {
		new Query("SELECT id FROM Users WHERE username=:name LIMIT 1", {
			name: handler.body.get("name")
		}).execute(function(err, rows) {
			if(err) {
				e.code = 2;
				e.message = "Database failure!";
				response.error = e;
				res.send(JSON.stringify(response));
			} else {
				if(rows.length === 0) {
					e.code = 2;
					e.message = "No user found with that name!";
					response.error = e;
					res.send(JSON.stringify(response));
				} else {
					new Query("INSERT INTO Friends (user_id, friend_id, added) VALUES (:id, :friendid, :time)", {
						id: handler.session.get("user").id,
						friendid: rows[0].id,
						time: +new Date
					}).execute(function(err, rows) {
						if(err) {
							e.code = 2;
							e.message = "Database failure!";
							response.error = e;
							res.send(JSON.stringify(response));
						} else {
							res.send(JSON.stringify(response));
						}
					});
				}
			}
		});
	}
}

module.exports = route;