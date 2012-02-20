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

var pollRolls = function(callback) {
    dbClient.open(function(err, db) {
        db.collection('rolls', function(err, collection) {
            collection.find().toArray(function(err, results) {
                if (err) throw error;
                dbClient.close();
                callback(results);
            });
        });
    });
};

var incrementRollCount = function(rollResult, callback) {
    if(dbClient) {
        dbClient.open(function(err, db) {
            db.collection('rolls', function(err, collection) {
                if (err) throw error;
                collection.find({ roll: rollResult }, function(err, cursor) {
                    var foundItem = false;
                    cursor.each(function(err, entry) {
                        if (entry !== null && !foundItem) {
                            foundItem = true;
                            console.log("Found entry for " + rollResult + ". Incrementing count.");
                            entry["count"]++;
                            collection.save(entry, function(err, result) {
                                db.close();
                                callback()
                            });
                        }
                        else if (!foundItem) {
                            console.log("Couldn't find entry for " + rollResult + ".  Adding to table.");
                            insertRoll(rollResult, callback);
                        }
                    });
                });
            });
        });
    } 
}

var insertRoll = function(rollResult, callback) {
    if(dbClient) {
        dbClient.open(function(err, db) {
            db.collection('rolls', function(err, collection) {
                collection.insert({ roll: rollResult, "count": 1 }, function(docs) {
                    dbClient.close();
                    callback();
                });
            });
        });
    }
}

module.exports = { 
    client: dbClient, 
    rolls: {
        poll: pollRolls,
        insert: incrementRollCount
    }
};

