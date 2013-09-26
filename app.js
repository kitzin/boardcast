var express = require("express"),
	http = require("http"),
	evh = require("express-vhost"),
	boardcast = require("./sites/boardcast").app,
	api = require("./sites/api.boardcast").app;

var app = express();

app.configure(function() {
	app.set("port", process.env.PORT || 1337);
	
	app.use(function(err, req, res, next) {
		// TODO error handling...
		// TODO and send some message...

		next();
	});

	app.use(function(req, res, next) {
		// TODO logging
		
		next();
	});

	// Virtual hosts
	app.use(evh.vhost());
	evh.register(boardcast.get("domain"), boardcast);
	evh.register(api.get("domain"), api);
});


http.createServer(app).listen(app.get("port"), function() {
	console.log("Boardcast server started on port " + app.get("port"));
});
