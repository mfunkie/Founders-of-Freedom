(function() {

var dbClient = require('./db').client;

var pollTable = function(callback) {
   dbClient.openTable('player', function(db, collection) {
        collection.find().toArray(function(err, results) {
            if (err) throw err;
            dbClient.close();
            callback(results);
        });
    });
};

var incrementCount = function(rollResult, callback) {
    dbClient.openTable('player', function(db, collection) {
        if(collection) {
            collection.find({ roll: rollResult }, function(err, cursor) {
                var foundItem = false;
                cursor.each(function(err, entry) {
                    if (entry !== null && !foundItem) {
                        foundItem = true;
                        console.log("Found entry for " + rollResult + ". Incrementing count.");
                        entry["count"] += 1;
                        collection.save(entry, function(err, result) {
                            db.close();
                            callback();
                        });
                    }
                    else if (!foundItem) {
                        console.log("Couldn't find entry for " + rollResult + ".  Adding to table.");
                        db.close();
                        insertPlayer(rollResult, callback);
                    }
                });
            });
        } else {
           db.close();
           callback();
        } 
    });
};

var insertPlayer = function(player, callback) {
    dbClient.openTable('player', function(db, collection) {
        collection.insert({ name: player.name, games: [player.gameid]}, function(docs) {
            db.close();
            callback();
        });
    });
};

module.exports = { 
    client: dbClient, 
    players: {
        poll: pollTable,
        insert: incrementCount
    }
};

}());
