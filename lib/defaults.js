var defauls = {};

function set(key, value) {
	if(typeof value === "function")
		defaults[key] = value;
}
function get(key) {
	return defaults[key]();
}

module.exports = { get: get, set: set };