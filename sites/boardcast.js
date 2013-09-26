var express = require("express"),
	path = require("path");

var app = express();

// all environments
app.configure(function() {
	app.set("domain", "boardcast.in");
	app.set("views", __dirname + '/views');
	app.set("view engine", "jade");
	app.use(express.favicon());
	app.use(express.logger("dev"));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, "public")));

	app.use(function(req, res, next) {
		console.log("boardcast.in");
		next();
	});
});

// development only
if("development" == app.get("env")) {
  app.use(express.errorHandler());
}

app.get("/", function(req, res) {
	res.send("Boardcast.in");
});

exports.app = app;

