var express = require("express"),
	http = require("http"),
	path = require("path"),
	Log = require("./lib/Log"),
	User = require("./lib/User");

var app = express();

// all environments
app.configure(function() {
	app.set("port", process.env.PORT || 1337);
	app.set("views", __dirname + '/views');
	app.set("view engine", "jade");

	app.use(function(req, res, next) {
		next();
	});
	
	app.use(express.cookieParser());
	app.use(express.session({ secret: "supbroyouaremessingwithmenowLEET1337" }));
	app.use(express.favicon());
	app.use(express.logger("dev"));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, "public")));

});

// development only
if("development" == app.get("env")) {
  app.use(express.errorHandler());
}

var routes = [
	require("./routes/home"),
	require("./routes/login_render"),
	require("./routes/login"),
	require("./routes/create_render"),
	require("./routes/create")
];

routes.forEach(function(route) {
	app[route.method](route.url, route.route);
});

require("./Init")(function() {
	http.createServer(app).listen(app.get("port"), "127.0.0.1", function() {
		Log.use("console").info("boardcast server started at port " + app.get("port"));
	});
});
