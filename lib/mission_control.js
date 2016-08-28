import uuid from 'node-uuid';
import GameCore from './game_core';
import _ from 'lodash';

import {menu_options} from './menu';
import events from './events';

class MissionControl {
  constructor(io) {
    this.io = io;
    this.games = [];
    this.users = {};
  }

  liftOff() {
    console.log("------ Mission Control Initiated ------");

    // Setup initial listeners
    this.io.on('connection', (socket) => {
      console.log('SERVER: client connected to socket'); 
      this.establishClientChannel(socket);

      //User disconnects from app 
      socket.on('disconnect', () => {
        //Will only exist if connected to a game
        if(this.users[socket.id]) {
          let user_data = this.users[socket.id];
          //Find game with user
          let game_index = this.games.findIndex(game => game.gameId() === user_data.game_id);
          this.games[game_index].removePlayer(user_data.user_id);

          //If game is empty after removing player, remove game
          if(this.games[game_index].isEmpty()) {
            this.games.splice(game_index, 1);
          } else {
            this.games[game_index].notifyOpponents(user_data.user_id);
          }
          
          //remove this user
          delete this.users[socket.id];
        }
      });
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
      this.users[socket.id] = {user_id, game_id: game_for_player.gameId()};
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
