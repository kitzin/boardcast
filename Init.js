var Log = require("./lib/Log"),
	mysql = require("mysql"),
	g = require("./lib/globals");
	
module.exports = function(cb) {
	Log.get("file")
	.add("info", "/home/webserver/boardcast.in/boardcast/log/info.log")
	.add("error", "/home/webserver/boardcast.in/boardcast/log/error.log")
	.use("info");
	
	var connection = mysql.createConnection({
		host: "localhost",
		user: "boardcast",
		password: "boardcast",
		database: "boardcast"
	});
	
	g.add("mysql_connection", connection);
	connection.connect(function(err) {
		if(err) throw err;
		
		Log.use("console").info("mysql connection established!");
		cb();
	});
	
}