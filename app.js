var express = require('express')
    app = express.createServer();


app.get('/', function(req, res) {
    console.log('A wild user has appeared!');
    res.send('Hello World');
});

app.listen(3000);


