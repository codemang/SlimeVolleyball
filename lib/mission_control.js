import uuid from 'node-uuid';
import GameCore from './game_core';
import _ from 'lodash';

import {menu_options} from './menu';
import events from './events';

class MissionControl {
  constructor(io) {
    this.io = io;
    this.games = [];
  }

  liftOff() {
    console.log("------ Mission Control Initiated ------");

    // Setup initial listeners
    this.io.on('connection', (socket) => {
      console.log('SERVER: client connected to socket'); 
      this.establishClientChannel(socket);
    });
  }

  establishClientChannel(socket) {

    // ------ When a client wants to join a game ------
    socket.on(events.JOIN_GAME, (data) => {
      console.log("SERVER: received request to join game from client");

      //find game
      let game_for_player = this.games.find(game => !game.isFull());
      if(!game_for_player) game_for_player = this.createNewGame();

      // Add user to game
      let user_id = `user-${uuid()}`;
      game_for_player.addPlayer(user_id, socket); 

      socket.emit(events.JOIN_SUCCESSFUL, {user_id});

      if(game_for_player.isFull()) {
        game_for_player.startGame();
      }
    });
  }

  createNewGame() {
    let game_id = `game-${uuid()}`;
    let game_for_player = new GameCore(game_id);
    game_for_player.attachIo(this.io);
    this.games.push(game_for_player);
    console.log('SERVER: creating new game with id', game_id);
    return game_for_player;
  }
}

export default MissionControl;
