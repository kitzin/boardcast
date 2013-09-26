var express = require("express");

var app = express();

// all environments
app.configure(function() {
	app.set("domain", "api.boardcast.in");
	app.use(express.favicon());
	app.use(express.logger("dev"));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);

	app.use(function(req, res, next) {
		// TODO Authenticate api request
		// if authenticated lower the request limit for key
	});
});

// development only
if("development" == app.get("env")) {
  app.use(express.errorHandler());
}

app.get("/", function(req, res) {
	res.send("api.boardcast.in");
});

exports.app = app;
