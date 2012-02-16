var express = require('express'),
    colors = require('colors'),
    app = express.createServer();

app.get('/', function(req, res) {
    console.log('A wild user has appeared!');
    res.send("Hello World!");
    console.log("DERP".blue);
});

app.listen(3000);


