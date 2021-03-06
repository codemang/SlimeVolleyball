import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import config from './webpack.config.js';
import path from 'path';
import http from 'http';
import express from 'express';
import GameCore from './lib/game_core';

const SERVER_PORT = 8080;
const APP_PORT = 3000;

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
//On connection by the client, create a new GameCore
io.on('connection', (socket) => {
    console.log('socket connected');
    //Create GameCore which at the moment emits the time to 
    //the client every second
    new GameCore(socket, true);
});
