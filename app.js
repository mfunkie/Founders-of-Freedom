(function(){
var express = require('express'),
    colors = require('colors'),
    roll = require('roll'),
    dbRolls = require('./rolls').rolls;

var app = express.createServer();

app.get('/', function(req, res) {
    var thisRoll = roll.roll('2d6');

    var coolback = function(results) {
        var resultsCount = results.length;
        if (results.length > 0) {
            results.sort(function(a,b) {
                return a.roll - b.roll;
            });
        }
        var resultsPrint = "";
        results.forEach(function(result) {
            if (resultsPrint === "") {
                resultsPrint += "<table><tr><td>Roll</td><td>Times rolled</td></tr>";
            }
            resultsPrint += "<tr><td>" + String(result.roll) + "</td><td>" + String(result.count) + "</td></tr>";
            resultsCount -= 1;
            if (resultsCount === 0) {
                resultsPrint += "</table>";
                res.send("You rolled a " + thisRoll.result + "<br>" + "All results so far :<br>" + resultsPrint); 
            }
        });
    };

    console.log("The user rolled a ".blue + String(thisRoll.result).red);
    dbRolls.insert(thisRoll.result, function() {
        dbRolls.poll(coolback);
    });
});

app.listen(3000);

}());
