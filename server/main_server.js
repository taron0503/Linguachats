var express = require('express');
var app = express();
// var http = require('http').createServer(app);


app.use(express.static('public'));


app.listen(8080);
// console.log('Express server started');


app.get('*', (req, res) => {
  console.log(__dirname)
  res.sendFile(__dirname + '/public/index.html');
});