var express = require("express"),
	http = require("http"),
	path = require("path"),
	Log = require("./lib/Log").use("console"),
	Authorize = require("./lib/Authorize"),
	RequestHandler = require("./lib/RequestHandler"),
	Init = require("./Init");

// Initalize default objects and some more
Init.Prepare();

// cd github/boardcast; (dir -include *.js -recurse | select-string .).Count
	
var app = express();
app.configure(function() {
	app.set("port", process.env.PORT || 1337);
	app.set("views", __dirname + '/views');
	app.set("view engine", "jade");
	
	app.use(express.cookieParser());
	app.use(express.session({ secret: "supbroyouaremessingwithmenowLEET1337" }));
	app.use(express.favicon());
	app.use(express.logger("dev"));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, "public")));
});

// dev only
if(app.get("env") === "development") {
  app.use(express.errorHandler());
}

// If not /app then redirect if client is logged in
app.get("/*", function(req, res, next) {
	if(!/\/app\/?(\?.*)?/g.test(req.url)) {
		var h = new RequestHandler(req);
		if(h.session.isLogin()) {
			res.redirect("/app");
		} else next();
	} else next();
});

// All the routes
var routes = [
	require("./routes/create"),
	require("./routes/login"),
	require("./routes/home"),
	require("./routes/login_render"),
	require("./routes/create_render"),
	require("./routes/logout"),
	require("./routes/app")
];

// Add middleware for route defined auth levels
routes.forEach(function(route) {
	var auth = new Authorize(route);
	auth.add(app);
});

// Start server after mysql connection has been established
Init.Start(function() {
	http.createServer(app).listen(app.get("port"), "127.0.0.1", function() {
		Log.info("boardcast server started at port " + app.get("port"));
	});
});
