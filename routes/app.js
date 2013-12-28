var route = require("../lib/defaults").get("route"),
	auth = require("../lib/Authorize");

route.url = "/app";
route.level = auth.level.login.code;
route.route = function(req, res) {
	res.send("BOARDCAST APP YOLO");
}

module.exports = route;