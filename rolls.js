(function() {

var dbClient = require('./db').client;

var pollRolls = function(callback) {
    dbClient.openTable('rolls', function(db, collection) {
        collection.find().toArray(function(err, results) {
            if (err) throw err;
            db.close();
            callback(results);
        });
    });
};

var incrementRollCount = function(rollResult, callback) {
    dbClient.openTable('rolls', function(db, collection) {
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
                        insertRoll(rollResult, callback);
                    }
                });
            });
        } else {
           db.close();
           callback();
        } 
    });
};

var insertRoll = function(rollResult, callback) {
    var tRoll = {
                    roll: rollResult,
                    "count": 1
                };
    dbClient.openTable('rolls', function(db, collection) {
        collection.insert( tRoll, function(docs) {
            db.close();
            callback();
        });
    });
};

module.exports = { 
    rolls: {
        poll: pollRolls,
        insert: incrementRollCount
    }
};

}());
