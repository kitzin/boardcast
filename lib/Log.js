var fs = require("fs");

function DateStr(str) {
	if(!str) str = "";
	else str = "["+ str.toUpperCase() +"]";

	var date = new Date();
	return str + "["+ date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() +"]: ";
}

function FileLogger() {
	this.files = {};
	this.current = null;
}
FileLogger.files = {};
FileLogger.prototype.add = function(name, path) {
	if(!fs.existsSync(path)) {
		fs.writeFileSync(path, "");
	}
	
	FileLogger.files[name] = path;
	return this;
}
FileLogger.prototype.use = function(name) {
	this.current = this.files[name];
	return this;
}
FileLogger.prototype.clear = function() {
	fs.writeFile(this.current, "", function() {});
	return this;
}
FileLogger.prototype.print = function(str, clear) {
	if(!clear) clear = false;
	
	str += "\n";
	if(clear === true)
		fs.writeFile(this.current, str, function(err) {});
	else
		fs.appendFile(this.current, str, function(err) {});
}

function ConsoleLogger() {}
ConsoleLogger.prototype.print = function(str) {
	console.log(str);
}

function Log(base) {
	this.base = base;
}

Log.prototype.request = function(req, res, next) {
	this.info("Request to: " + req.url);
	next();
}
Log.prototype.print = function(str) {
	this.base.print(str);
}
Log.prototype.log = function(str) {
	this.base.print(DateStr() + str);
	return this;
}
Log.prototype.info = function(str) {
	this.base.print(DateStr("info") + str);
	return this;
}
Log.prototype.warning = function(str) {
	this.base.print(DateStr("warning") + str);
	return this;
}
Log.prototype.error = function(str) {
	this.base.print(DateStr("warning") + str);
	return this;
}
Log.prototype.fatal = function(str) {
	this.base.print(DateStr("fatal") + str);
	return this;
}

var logs = { console: new ConsoleLogger(), file: new FileLogger() };
function add(name, logger) {
	logs[name] = logger;
}

exports.use = function(what) {
	return new Log(logs[what]);
}

exports.Log = Log;
exports.add = add;
