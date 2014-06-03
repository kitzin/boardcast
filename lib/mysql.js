var mysql = require("mysql"),
	g = require("./globals");

function Query(query_str, data) {
	this.query = query_str;
	if(data !== undefined) this.prepare(data);
}
Query.prototype.prepare = function(data) {	
	if(!data) return;
	
	var m = this.query.match(/\:(\w+)/g);
    for(var i = 0; i<m.length; i++) {
        var key = m[i],
            keyVal = key.substring(1),
            val = data[keyVal];
        
        if((val % 1) === 0)
            rep = val;
        else
            rep = mysql.escape(val);
        
        this.query = this.query.replace(key, rep)
    }
}
Query.prototype.execute = function(cb) {
	if(typeof cb !== "function") return;
	g.get("mysql_connection").query(this.query, cb);
}

exports.Query = Query;