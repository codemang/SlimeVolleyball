var webpack = require('webpack');
var dev_server = require('webpack-dev-server');
var config = require('./webpack.config.js');

var compiler = webpack(config);
var server = new dev_server(compiler);

server.listen(12345, () => {
  console.log("listening on port");
});

var io = require('socket.io');

// io.on('connection', (socket) => {
//   new GameCore(socket, true);
// });
