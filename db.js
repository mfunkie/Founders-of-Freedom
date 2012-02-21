(function() {

var fs = require('fs'),
    mongoDb = require('mongodb').Db,
    mongoServer = require('mongodb').Server;

var dbSettingsFile = __dirname + "/settings.json",
    dbSettings = {},
    dbClient;

var connectToDB = function(databaseSettings) {
    console.log("Connecting to " + databaseSettings.server + " at port " + databaseSettings.port);
    return new mongoDb(databaseSettings.name, new mongoServer(databaseSettings.server, databaseSettings.port, {}));
};

var thisFile = fs.readFileSync(dbSettingsFile);

dbSettings = JSON.parse(thisFile);
console.log("Database: ".blue + dbSettings.database.name);

var dbClient = connectToDB(dbSettings.database);

var openTable = function(tableName, executeFunction) {
    if (dbClient) {
        dbClient.open(function(err, db) {
            db.collection(tableName, function(err, collection) {
                if (err) throw err;
                executeFunction(db, collection);
            });
        });
    } else {
        return null;
    }
};

var pollRolls = function(callback) {
    openTable('rolls', function(db, collection) {
        collection.find().toArray(function(err, results) {
            if (err) throw err;
            dbClient.close();
            callback(results);
        });
    });
};

var incrementRollCount = function(rollResult, callback) {
    openTable('rolls', function(db, collection) {
        openIncrementRollCount(rollResult, collection, function() {
            db.close();
            callback();
        });
    });
};

var openIncrementRollCount = function(rollResult, collection, callback) {
    if(collection) {
        collection.find({ roll: rollResult }, function(err, cursor) {
            var foundItem = false;
            cursor.each(function(err, entry) {
                if (entry !== null && !foundItem) {
                    foundItem = true;
                    console.log("Found entry for " + rollResult + ". Incrementing count.");
                    entry["count"] += 1;
                    collection.save(entry, function(err, result) {
                        callback();
                    });
                }
                else if (!foundItem) {
                    console.log("Couldn't find entry for " + rollResult + ".  Adding to table.");
                    insertRoll(rollResult, callback);
                }
            });
        });
    } else {
       callback();
    } 
};

var insertRoll = function(rollResult, callback) {
    openTable('rolls', function(db, collection) {
        collection.insert({ roll: rollResult, "count": 1 }, function(docs) {
            db.close();
            callback();
        });
    });
};

module.exports = { 
    client: dbClient, 
    rolls: {
        poll: pollRolls,
        insert: incrementRollCount
    }
};

}());
