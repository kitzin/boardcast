var defaults = {};

function set(key, value) {
	if(typeof value === "function") {
		defaults[key] = value;
	}
}
function get(key) {
	return defaults[key]();
}

exports.get = get;
exports.set = set;