var express = require('express'),
    colors = require('colors'),
    roll = require('roll'),
    dbClient = require('./db').client,
    dbRolls = require('./db').rolls;

var app = express.createServer();

app.get('/', function(req, res) {
    var thisRoll = roll.roll('2d6');

    var coolback = function(results) {
        var resultsCount = results.length;
        var resultsPrint = "";
        results.forEach(function(result) {
            if (resultsPrint === "") {
                resultsPrint += String(result.roll)
            } else {
                resultsPrint += ", " + String(result.roll)
            }
            resultsCount -= 1;
            if (resultsCount === 0) {
                res.send("You rolled a " + thisRoll.result + "<br>" + "All results so far :<br>" + resultsPrint); 
            }
        });
    };

    console.log("The user rolled a ".blue + String(thisRoll.result).red);

    if(dbClient) {
        dbClient.open(function(err, db) {
            db.collection('rolls', function(err, collection) {
                collection.insert({ roll: thisRoll.result }, function(docs) {
                    dbRolls.poll(dbClient, coolback);
                });
            });
        });
    }

});

app.listen(3000);


