
var route = {
	method: "post",
	url: "/login",
	route: function(req, res) {
		/*var u = User.fromUserPass(req.body.username, req.body.password);
		u.login(function(err, user) {
			if(err) {
				res.send(JSON.stringify(err));
			} else {
				res.send(JSON.stringify(user));
			}
		});*/
		
		res.send("login");
	}
};

module.exports = route;