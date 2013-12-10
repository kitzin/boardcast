var table =  {};
function add(name, url, cb) {
	if(typeof cb !== "function") return;

	table[name] = {
		url: url,
		cb: cb
	};
}

module.exports = function() {
	add("index", "/", function(req, res) {
		res.send("index");		
	});
}
