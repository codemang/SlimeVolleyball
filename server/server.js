import path from 'path';
import http from 'http';
import express from 'express';
import GameCore from '../lib/game_core';
import MissionControl from '../lib/mission_control';

const SERVER_PORT = 8080;

/* Create server to handle socket server requests
 * Routed by webpackDevServer proxy
 */

let app = express();
let server = http.createServer(app);

app.use('/', express.static(path.resolve(__dirname, 'build')))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/build/index.html');
})

server.listen(SERVER_PORT, () => {
   console.log(`Server is now running on http://localhost:${SERVER_PORT}`);
});

let io = require('socket.io')(server);

// Start game manager
let mission_control = new MissionControl(io);
mission_control.liftOff();
