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

module.exports = { 
    client: {
                openTable: openTable
            }
};

}());
