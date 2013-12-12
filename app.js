var express = require("express"),
	http = require("http"),
	path = require("path"),
	Log = require("./lib/Log"),
	Query = require("./lib/mysql").Query,
	crypto = require("crypto"),
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

app.get("/", function(req, res) {
	new Query("SELECT :num1 + :num2 AS answer", {
		num1: 30,
		num2: 45
	}).execute(function(err, rows) {
		res.send("boardcast.in " + rows[0].answer);
	});
});

app.get("/login", function(req, res) {
	res.render("login");
});
app.post("/login", function(req, res) {
	var u = User.fromUserPass(req.body.username, req.body.password);
	u.login(function(err, user) {
		if(err) {
			res.send(JSON.stringify(err));
		} else {
			res.send(JSON.stringify(user));
		}
	});
});

require("./Init")(function() {
	http.createServer(app).listen(app.get("port"), "127.0.0.1", function() {
		Log.use("console").info("boardcast server started at port " + app.get("port"));
	});
});
