var express = require("express"),
	http = require("http"),
	path = require("path");

var app = express();

// all environments
app.configure(function() {
	app.set("port", process.env.PORT || 1337);
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

http.createServer(app).listen(app.get("port"), "127.0.0.1", function() {
	console.log("boardcast server started at port " + app.get("port"));
});
