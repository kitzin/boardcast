var redis = require("redis"),
	mongoClient = require("mongodb").MongoClient;

var dbCon = undefined,
	redisClient = undefined;
	
exports.connect = function() {
	redisClient = redis.createClient();
	mongoClient.connect("mongodb://127.0.0.1:27017", function(err, db) {
		if(err) {
			console.log("Failed to connect to mongodb");
			throw err;
		} else {
			dbCon = db;
		}
	});
}
exports.close = function() {
	db.close();
	redisClient.quit();
}

exports.clients = {
	mongo: dbCon,
	redis: redis
}