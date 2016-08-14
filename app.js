var express = require('express');
var http    = require('http');
var io      = require('socket.io');
var UUID    = require('node-uuid');

// Use app as the handler for an http rqeuest
var app = express();
app.use(require('morgan')('dev'));

var server = http.createServer(app).listen(1337);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var listener = io.listen(server);
listener.sockets.on('connection', function (socket) {
  setInterval(function() {
    socket.emit('date', { date:  new Date()});
  }, 1000);
});
