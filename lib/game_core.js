import uuid from 'node-uuid';

class GameCore {
  constructor(socket, is_server) {
    this.socket = socket;
    this.is_server = is_server;

    this.socket.connect();

    this.socket.on('connection_successful', (socket) => {
      console.log("CLIENT: connection to server successful");
      this.joinGame();
    });
  }

  joinGame() {
    this.socket.emit('attempt_join', {});
    this.socket.on('join_successful', (data) => {
      console.log(data);
    });
  }
}

export default GameCore;
