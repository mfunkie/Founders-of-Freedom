var express = require('express'),
    colors = require('colors'),
    app = express.createServer(),
    roll = require('roll');

app.get('/', function(req, res) {
    var thisRoll = roll.roll('2d6');
    res.send("Hello World! " + thisRoll.result); 
    console.log("The user rolled a ".blue + String(thisRoll.result).red);
});

app.listen(3000);


