var express = require("express"),
	http = require("http");

var app = express();

// all environments
app.configure(function() {
	app.set("port", process.env.PORT || 1227);

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

http.createServer(app).listen(app.get("port"), "127.0.0.1", function() {
	console.log("boardcast api server started at port " + app.get("port"));
});
