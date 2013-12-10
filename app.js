var express = require("express"),
	http = require("http"),
	path = require("path"),
	Log = require("./lib/Log"),
	Query = require("./lib/mysql").Query;

var app = express();

// all environments
app.configure(function() {
	app.set("port", process.env.PORT || 1337);
	app.set("views", __dirname + '/views');
	app.set("view engine", "jade");

	app.use(function(req, res, next) {
		next();
	});
	
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
	var q = new Query("SELECT :num1 + :num2 AS sup");
	q.prepare({
		num1: 30,
		num2: 43
	});
	
	q.execute(function(err, rows) {
		if(err) throw err;
		Log.error(rows[0].sup);
		
		res.send("boardcast.in");
	});
	
	
});

require("./Init")(function() {
	http.createServer(app).listen(app.get("port"), "127.0.0.1", function() {
		Log.use("console").info("boardcast server started at port " + app.get("port"));
	});
});
