var globals = {};

exports.add = function(name, data) {
	if(globals.name === undefined)
		globals[name] = data;
}
exports.get = function(name) {
	var global = globals[name];
	if(global !== undefined);
		return global;
		
	return null;
}