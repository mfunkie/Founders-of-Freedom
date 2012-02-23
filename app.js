(function(){
var express = require('express'),
    colors = require('colors'),
    roll = require('roll'),
    dbRolls = require('./rolls').rolls;

var app = express.createServer();

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.use(express.logger());
    app.use(express.bodyParser());
    
    //Don't render a layout on a global basis... for now
    app.set('view options', {layout: false} );
});

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
        var youRolledA = "You rolled a " +  thisRoll.result;
        res.render('index.jade', { results: results, thisRoll: youRolledA } );
    };

    console.log("The user rolled a ".blue + String(thisRoll.result).red);
    dbRolls.insert(thisRoll.result, function() {
        dbRolls.poll(coolback);
    });
});

app.listen(3000);

}());
