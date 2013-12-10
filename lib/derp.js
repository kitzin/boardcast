var logger = require("./Logger"),
	Log = require("./Logger").Log;

var Log2 = require("./Logger2.0.js");

Log2.use("file").get("file").add("error", "/home/webserver/boardcast.in/boardcast/log/error.log").use("error");
Log2.info("derp derp");
Log2.log("lol lol");
Log2.warning("omg omg");

/*
logger.add("error", "/home/webserver/boardcast.in/boardcast/log/error.log").use("error");

console.log(typeof Logger);

var l = new Log(logger);

l.info("derp");*/
