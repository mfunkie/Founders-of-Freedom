(function() {

var fs = require('fs'),
    mongoDb = require('mongodb').Db,
    mongoServer = require('mongodb').Server,
    dbSettingsFile = __dirname + "/settings.json",
    dbSettings = {},
    dbClient,
    connectToDB,
    thisFile,
    dbClient,
    openTable;

connectToDB = function(databaseSettings) {
    console.log("Connecting to " + databaseSettings.server + " at port " + databaseSettings.port);
    return new mongoDb(databaseSettings.name, new mongoServer(databaseSettings.server, databaseSettings.port, {}));
};

thisFile = fs.readFileSync(dbSettingsFile);

dbSettings = JSON.parse(thisFile);
console.log("Database: ".blue + dbSettings.database.name);

dbClient = connectToDB(dbSettings.database);

openTable = function(tableName, executeFunction) {
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
