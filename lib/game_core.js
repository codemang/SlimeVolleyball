import uuid from 'node-uuid';

const NUM_PLAYERS_PER_GAME = 2;

class GameCore {

  /*constructor(socket, is_server) {
    this.socket = socket;
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
  }*/

  constructor(opts={}) {
    this.is_server = opts.is_server || false;
    this.num_players = opts.num_players || 0;
    this.game_id = opts.game_id;
    this.players = []
  }

  numPlayers() { return this.num_players; }
  gameId() { return this.game_id; }
  isFull() { return this.num_players >= NUM_PLAYERS_PER_GAME; }

  addPlayer(user_id) {
    this.players.push(user_id);
    if (this.isFull()) {
      this.startGame();
    }
  }

  startGame() {
    // setInterval(() => {
    //
    // }, ) ;
  }
}

export default GameCore;
