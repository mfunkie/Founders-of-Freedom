var fs = require('fs'),
    mongoDb = require('mongodb').Db;
    mongoServer = require('mongodb').Server;

var dbSettingsFile = __dirname + "/settings.json";
var dbSettings = {};
var dbClient;

var openDB = function(databaseSettings) {
    console.log("Connecting to " + databaseSettings.server + " at port " + databaseSettings.port);
    return new mongoDb(databaseSettings.name, new mongoServer(databaseSettings.server, databaseSettings.port, {}));
}

var thisFile = fs.readFileSync(dbSettingsFile);

dbSettings = JSON.parse(thisFile);
console.log("Database: ".blue + dbSettings.database.name);
var dbClient = openDB(dbSettings.database);

var pollRolls = function(dbC, callback) {
    dbC.open(function(err, db) {
        db.collection('rolls', function(err, collection) {
            collection.find().toArray(function(err, results) {
                if (err) throw error;
                console.log("All rolls so far: ");
                console.log(results);
                dbC.close();
                callback(results);
            });
        });
    });
};

var insertRoll = function(dbC, callback) {
    callback();
}

module.exports = { 
    client: dbClient, 
    rolls: {
        poll: pollRolls,
        insert: insertRoll
    }
};

