var crypto = require("crypto");

function Session(sessions) {
	this.sessions = sessions;
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
	return this.get("logged_in") === 1 && this.get("user") !== null;
}
Session.prototype.validToken = function(token) {
	return this.sessions["session_token"] === token;
}
Session.prototype.setToken = function(cb) {
	var self = this;
	crypto.randomBytes(48, function(err, buff) {
		var token = buff.toString("hex");
		self.session["session_token"] = token;
	});
}

Session.prototype.isset = function(name) {
	return typeof this.sessions[name] !== "undefined";
}
Session.prototype.set = function(name, value) {
	this.sessions[name] = value;
}
Session.prototype.get = function(name) {
	return typeof this.sessions[name] === "undefined" ? null : this.sessions[name];
}

Session.login = function(user) {
	Session.set("loggedin", 1);
	Session.set("user", user);
}
Session.loggedin = function() {
	return Session.get("loggedin") !== null && Session.get("user") !== null;
}

module.exports = Session;