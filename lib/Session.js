
var session;

var Session = {};

Session.save = function(req, res, next) {
	session = req.session;
	next();
}
Session.set = function(name, value) {
	session[name] = value;
}
Session.get = function(name) {
	return session[name] || null;
}
Session.isset = function(name) {
	return typeof session[name] !== "undefined";
}


Session.login = function(user) {
	Session.set("loggedin", 1);
	Session.set("user", user);
}
Session.loggedin = function() {
	return Session.get("loggedin") !== null && Session.get("user") !== null;
}

module.exports = Session;