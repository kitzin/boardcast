var fs = require("fs");

function DateStr(str) {
	if(!str) str = "";
	else str = "["+ str.toUpperCase() +"]";

	var date = new Date();
	return str + "["+ date.getFullYear() + "-" + date.getMonth()+1 + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() +"]: ";
}

function FileLogger() {
	this.files = {};
	this.current = null;
}
FileLogger.prototype.add = function(name, path) {
	if(!fs.existsSync(path)) {
		fs.writeFileSync(path, "");
		console.log("nope");
	}
	
	this.files[name] = path;
	return this;
}
FileLogger.prototype.use = function(name) {
	this.current = this.files[name];
	return this;
}
FileLogger.prototype.print = function(str, clear) {
	if(!clear) clear = false;

	if(clear === true)
		fs.writeFile(this.current, str, function(err) {});
	else
		fs.appendFile(this.current, str, function(err) {});
}

function ConsoleLogger() {}
ConsoleLogger.prototype.print = function(str) {
	console.log(str);
}


function Log() {
	this.types = {};
	this.types.file = new FileLogger();
	this.types.console = new ConsoleLogger();
	
	this.current = this.types.file;
}

Log.prototype.add = function(name, type) {
	this.types[name] = type;
	return this;
}
Log.prototype.use = function(name) {
	this.current = this.types[name];
	return this;
}
Log.prototype.get = function(name) {
	return this.types[name];
}

Log.prototype.log = function(str) {
	str += "\n";
	this.current.print(DateStr() + str);
	return this;
}
Log.prototype.info = function(str) {
	str += "\n";
	this.current.print(DateStr("info") + str);
	return this;
}
Log.prototype.warning = function(str) {
	str += "\n";
	this.current.print(DateStr("warning") + str);
	return this;
}
Log.prototype.error = function(str) {
	str += "\n";
	this.current.print(DateStr("warning") + str);
	return this;
}
Log.prototype.fatal = function(str) {
	str += "\n";
	this.current.print(DateStr("warning") + str);
	return this;
}

var static_log = new Log();

module.exports = static_log;
exports.Log = Log;
