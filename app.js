import express from 'express';
import http    from 'http';
import io      from 'socket.io';
import UUID    from 'node-uuid';

// Use app as the handler for an http rqeuest
let app = express();

// Log http requests
app.use(require('morgan')('dev'));

let server = http.createServer(app).listen(1337);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Public/index.html');
});

let listener = io.listen(server);

listener.sockets.on('connection', (socket) => {
  setInterval(() => {
    socket.emit('date', { date:  new Date()});
  }, 1000);
});
