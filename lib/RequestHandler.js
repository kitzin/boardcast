var crypto = require("crypto");

function Session(req) {
	this.req = req;
}
Session.prototype.login = function(user) {
	this.set("logged_in", 1);
	this.set("user", user);
}
Session.prototype.logout = function() {
	this.set("logged_in", null);
	this.set("user", null);
}
Session.prototype.isLogin = function() {
	return this.get("logged_in") === 1 && this.isset("user");
}
Session.prototype.validToken = function(token) {
	return this.get("session_token") === token;
}
Session.prototype.setToken = function(cb) {
	var self = this;
	crypto.randomBytes(48, function(err, buff) {
		var token = buff.toString("hex");
		self.get("session_token") = token;
		cb(token);
	});
}

Session.prototype.isset = function(name) {
	return typeof this.get(name) !== "undefined";
}
Session.prototype.set = function(name, value) {
	this.req.session[name] = value;
}
Session.prototype.get = function(name) {
	return (typeof this.req.session[name] === "undefined") ? null : this.req.session[name];
}

Session.login = function(user) {
	Session.set("loggedin", 1);
	Session.set("user", user);
}
Session.loggedin = function() {
	return Session.get("loggedin") !== null && Session.get("user") !== null;
}

function Params(req) {
	this.req = req;
}
Params.prototype.isset = function(name) {
	return typeof this.req.body[name] !== "undefined";
}
Params.prototype.get = function(name) {
	return (typeof this.req.params[name] === "undefined") ? null : this.req.params[name];
}

function Body(req) {
	this.req = req;
}
Body.prototype.isset = function(name) {
	return typeof this.req.body[name] !== "undefined";
}
Body.prototype.get = function(name) {
	return (typeof this.req.body[name] === "undefined") ? null : this.req.body[name];
}

function RequestHandler(req) {
	this.session = new Session(req);
	this.body = new Body(req);
	this.params = new Params(req);
}

module.exports = RequestHandler;