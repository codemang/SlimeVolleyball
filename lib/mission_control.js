import uuid from 'node-uuid';
import _ from 'lodash';

import {menu_options} from './menu';

class MissionControl {
  constructor(io) {
    this.io = io;
    this.games = []
  }

  liftOff() {
    console.log("------ Mission Control Initiated ------");

    // Setup initial listeners
    this.io.on('connection', (socket) => {
      console.log("SERVER: Initial connection from client received");
      socket.emit('connection_successful', {menu_options})
      this.establishClientChannel(socket);
    });
  }

  establishClientChannel(socket) {

    // ------ When a client wants to join a game ------
    socket.on('attempt_join', (data) => {
      console.log("SERVER: received request to join game from client");

      // Find game for player
      let last_game = _.last(this.games);
      if (last_game === undefined || last_game.num_players >= 2) {
        last_game = {
          game_id: uuid(),
          num_players: 0,
        };
        this.games.push(last_game);
      }

      // Connect player to game
      last_game.num_players += 1;
      socket.join(last_game.game_id);
      socket.emit('join_successful', {game_id: last_game.game_id});
    });

  }
}

export default MissionControl;
