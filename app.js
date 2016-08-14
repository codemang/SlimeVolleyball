import express from 'express';
import http    from 'http';
import io      from 'socket.io';
import UUID    from 'node-uuid';

// Use app as the handler for an http rqeuest
let app = express();

// The server
let server = http.createServer(app);

// Attach socket.io to server
let listener = io.listen(server);

// Log http requests
app.use(require('morgan')('dev'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Public/index.html');
});

// Listen on the 'connection' event
listener.sockets.on('connection', (socket) => {
	console.log("Client connected...");

  setInterval(() => {
    socket.emit('date', { date:  new Date()});
  }, 1000);
});

server.listen(1337);