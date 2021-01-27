var mongodb = require("mongodb");
global.dbase = {};
// Code for using Environment variable


var mongoHost = process.env.mongoHost ||'localhost';
var port = process.env.port || '27017'
var mongoDB = process.env.mongoDB ||'ORP';
var mongoUser = process.env.mongoUser ||null;
var mongoUserPass = process.env.mongoUserPass || null;
var socketTimeoutMS = process.env.socketTimeoutMS || 35000;
var maxPoolSize = process.env.maxPoolSize || 100;
// for server deployment
//var mongoUrl = "mongodb://" + mongoUser + ":" + mongoUserPass + "@" + mongoHost + "/" + mongoDB + "?authSource=admin&connectTimeoutMS=300000";

var mongoUrl = "mongodb://localhost:27017/ORP";

/**
* @description - connection to mongodb and initialize collections
* @params - Nil
* @return callback function
*/
var theDb = null;
function getDb(callback) {
    if (!theDb || (theDb && !theDb.db.serverConfig.isConnected())) {
        mongodb.MongoClient.connect(mongoUrl,{poolSize: maxPoolSize,socketTimeoutMS:socketTimeoutMS,useUnifiedTopology: true },function (err, databaseClient) {
            if (err) {
                console.log("Mongo connection error",JSON.stringify(err));
                callback({"message":"Database Connection refused"}, null);
            } else {
                dbase = databaseClient;
                let db = databaseClient.db(mongoDB);
                theDb = {
                    db: db,
                    // login: db.collection("Login"),
                    orp_User: db.collection("ORP_User"),
                    orp_Items: db.collection("ORP_Items"),
                    orp_Session: db.collection("sessions"),

              };
                callback(null, theDb);
            }
        });

    } else {
        callback(null, theDb);
    }
};

module.exports = {
    getDb: getDb
};