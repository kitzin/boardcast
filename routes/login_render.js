
var route = {
	method: "get",
	url: "/login",
	route: function(req, res) {
	
		res.render("login");
		
	}
};

module.exports = route;