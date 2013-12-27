var Query = require("../lib/mysql").Query,
	route = require("../lib/defaults").get("route");

route.url = "/";
route.route = function(req, res) {
	new Query("SELECT :num1 + :num2 AS answer", {
		num1: 30,
		num2: 45
	}).execute(function(err, rows) {
		res.send("boardcast.in " + rows[0].answer);
	});
}

module.exports = route;