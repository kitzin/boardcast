var Log = require("./lib/Log"),
	mysql = require("mysql"),
	g = require("./lib/globals"),
	defaults = require("./lib/defaults"),
	fs = require("fs");

exports.Prepare = function() {
	// Set default error response
	defaults.set("error", function() {
		return {
			code: 0,
			message: ""
		}
	});
	
	// Set default response
	defaults.set("response", function() {
		return {
			error: defaults.get("error"),
			action: "", // not decided yet
			data: {}
		};
	});
	
	// Set default route object
	defaults.set("route", function() {
		return {
			method: "get",
			url: "",
			route: function() {},
			level: 0
		};
	});
	
	// Default user row
	defaults.set("user", function() {
		return {
			username: "",
			password: "",
			salt: "",			
			created: new Date().getTime(),
			last_login: 0,
			profile_picture: "http://dotkitti.se/media/images/hummus.png",
            nickname: ""
		};
	});
	
	// Initalize file logger
	Log.use("file").base
		.add("info", "/home/webserver/boardcast.in/boardcast/log/info.log")
		.add("error", "/home/webserver/boardcast.in/boardcast/log/error.log")
		.use("info");
}

exports.Start = function(cb) {
	// Create connection to mysql database
	var connection = mysql.createConnection({
		host: "localhost",
		user: "boardcast",
		password: fs.readFileSync("pw.txt"), // you know why
		database: "boardcast"
	});
	
	// Connect to mysql database and fire callback to start server
	g.add("mysql_connection", connection);
	connection.connect(function(err) {
		if(err) throw err;
		
		Log.use("console").info("mysql connection established!");
		cb();
	});
}