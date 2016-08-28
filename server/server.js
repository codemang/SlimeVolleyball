import path from 'path';
import http from 'http';
import express from 'express';
import GameCore from '../lib/game_core';
import MissionControl from '../lib/mission_control';
import initializeRoutes from './routes';

const SERVER_PORT = 8080;

/* Create server to handle socket server requests
 * Routed by webpackDevServer proxy
 */

let app = express();
let server = http.createServer(app);

var allowCrossDomain = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

app.use(allowCrossDomain);
app.use(express.static(__dirname + '/build'));



server.listen(SERVER_PORT, () => {
   console.log(`Server is now running on http://localhost:${SERVER_PORT}`);
});

let io = require('socket.io')(server);

// Start game manager
let mission_control = new MissionControl(io);
mission_control.liftOff();

initializeRoutes(app, mission_control);
