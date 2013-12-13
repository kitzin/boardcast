
var route = {
	method: "get",
	url: "/create",
	route: function(req, res) {
		res.render("create");
	}
};

module.exports = route;