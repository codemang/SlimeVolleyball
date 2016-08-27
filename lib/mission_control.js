import uuid from 'node-uuid';
import GameCore from './game_core';
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
      let game_for_player = _.last(this.games);
      if (game_for_player === undefined || game_for_player.isFull) {
        game_for_player = this.createNewGame();
      }

      // Add user to game
      let user_id = `user-${uuid()}`;
      game_for_player.addPlayer(user_id);

      // Alert user
      socket.join(game_for_player.gameId);
      socket.emit('join_successful', {game_id: game_for_player.game_id, user_id: user_id});
    });
  }

  createNewGame() {
    let game_id = `game-${uuid()}`;
    let game_for_player = new GameCore(game_id);
    this.games.push(game_for_player);
    return game_for_player;
  }
}

export default MissionControl;
