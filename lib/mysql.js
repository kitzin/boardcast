var Log = require("./Log");
	mysql = require("mysql"),
	g = require("./globals");

function Query(query_str, data) {
	this.query = query_str;
	if(data !== undefined) this.prepare(data);
}
Query.prototype.prepare = function(data) {	
	if(!data) return;
	
	for(var key in data) {
        var val = data[key],
		    m = this.query.match(/\:(\w+)/g);
        
        if(m != null && typeof m[0] !== "undefined") {
			var rep;
			if((val % 1) === 0)
				rep = val;
			else
				rep = mysql.escape(val);
				
            this.query = this.query.replace(m[0], rep)
		}
	}
}
Query.prototype.execute = function(cb) {
	if(typeof cb !== "function") return;
	g.get("mysql_connection").query(this.query, cb);
}

exports.Query = Query;