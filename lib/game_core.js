import uuid from 'node-uuid';
import sio from 'socket.io-client';

import Player from './player';
import events from './events';

const NUM_PLAYERS_PER_GAME = 2;

class GameCore {

  constructor(game_id) {
    this.default_player = {
      radius: 60,
      position: {
        x: 100,
        y: 480
      }
    }

    this.canvas = {
      width: 760,
      height: 480
    }

    this.game_id = game_id;
  }

  //Used by both client and server
  gameId() { return this.game_id; }

  //SERVER FUNCTIONS
  numPlayers() { return this.num_players; }
  isFull() { return this.players.length >= NUM_PLAYERS_PER_GAME; }

  attachIo(io) {
    this.io = io;
  }

  addPlayer(user_id, socket) {
    console.log('SERVER: adding player ' + user_id + ' to game ' + this.game_id);

    //place this player in this game's room
    socket.join(`room-${this.game_id}`);
    let new_player = new Player(user_id, socket, this.default_player);

    //initialize players array if new game
    if(!this.players) { this.players = []; }

    this.players.push(new_player);
    this.server_updatePlayerPositionListener(new_player);
  }

  //Listens for updates made by clients to their own player
  server_updatePlayerPositionListener(player) {
    player.getSocket().on(events.UPDATE_PLAYER_POSITION, (data) => {
      let player_index = this.players.findIndex(player => player.getUserId() === data.user_id);
      if(player_index !== -1) {
        //update player's position
        this.players[player_index].updatePosition(data.update.position); 
      }

      this.io.to(`room-${this.game_id}`).emit(events.UPDATE_PLAYER_POSITION, data);
    });
  }

  removePlayer(user_id) {
    let player_index = this.players.findIndex(player => player.getUserId() === user_id);
    this.players[player_index].getSocket().leave(`room-${this.game_id}`);
    this.players.splice(player_index, 1);
  }

  notifyOpponents(user_id) {
    this.io.to(`room-${this.game_id}`).emit(events.PLAYER_LEFT, {user_id});
  }

  isEmpty() {
    return this.players.length === 0;
  }

  startGame() {
    //Notify all players to render opponents
    this.players.forEach(player => {
      let user_id = player.getUserId();
      this.players.forEach(opponent => {
        if(opponent.getUserId() !== user_id) {
          player.getSocket().emit(events.OPPONENT_CONNECTED, {
            opponent: opponent.getData(),
            user_id: opponent.getUserId() 
          })
        }
      })
    });
  }

  //CLIENT FUNCTIONS
  //game_data will include the game id and the user id
  initializePlayer(url) {

    this.socket = sio(url);
    this.socket.on('connect', () => {
      this.socket.emit(events.JOIN_GAME); 
    });

    this.socket.on(events.JOIN_SUCCESSFUL, (data) => {
      this.player = new Player(data.user_id, this.socket, this.default_player);
      this.client_updatePlayerPositionListener();
      let canvas = document.getElementById('game-canvas');
      let context = canvas.getContext('2d');
      this.initializeContext(context);
    });

    this.socket.on(events.OPPONENT_CONNECTED, (data) => {
      console.log('OPPONENT_CONNECTED', data);
      if(!this.opponents) this.opponents = [];
      let opponent_data = {
        radius: data.opponent.radius,
        position: {
          x: this.canvas.width - (data.opponent.position.x - data.opponent.radius), 
          y: data.opponent.position.y 
        }
      }
      let opponent = new Player(data.user_id, null, opponent_data);
      this.opponents.push(opponent);

      this.drawPlayer(opponent_data);
    });


    this.socket.on(events.PLAYER_LEFT, (data) => {
      let player_index = this.opponents.findIndex(opp => opp.getUserId() === data.user_id);
      this.clearPlayer(this.opponents[player_index].getData());
      this.opponents.splice(player_index, 1);
    })
  }

  initializeContext(context) {
    this.context = context;
    this.drawPlayer(this.player.getData());
    this.request_id = undefined;
    this.initializeKeyListeners();
  }

  //listens for emits from the server to update a particular player's position
  client_updatePlayerPositionListener() {
    this.socket.on(events.UPDATE_PLAYER_POSITION, (data) => {
      if(data.user_id === this.player.getUserId()) {
        //unnecessary perhaps
      } else {
        let opponent_index = this.opponents.findIndex(opp => opp.getUserId() === data.user_id);
        //compute update
        this.clearPlayer(this.opponents[opponent_index].getData());
        this.opponents[opponent_index].updatePosition({
          x: this.canvas.width - (data.update.position.x - data.update.radius), 
          y: data.update.position.y 
        });
        this.drawPlayer(this.opponents[opponent_index].getData());
      }
    });
  }


  drawPlayer(player) {
    this.context.beginPath();
    this.context.arc(player.position.x, player.position.y, player.radius, 0, Math.PI, true);
    this.context.closePath();
    this.context.fillStyle = 'red';
    this.context.fill();
  }

  clearPlayer(player) {
    this.context.clearRect(player.position.x - player.radius, player.position.y - player.radius, 2*player.radius, player.radius);
  }

  initializeKeyListeners() {
    $(document).keydown(event => {
      switch(event.which) {
        case 37:
          //left arrow
        case 65:
          //'w'
          this.startMovement('left');
          break;
        case 39:
          //right arrow
        case 68:
          //'d'
          this.startMovement('right');
          break;
        default:
          return;
      }
    });

    $(document).keypress(event => {
      switch(event.which) {
        case 32:
          //spacebar 
          this.jump();
          break;
      }
    });

    $(document).keyup(event => {
      if(this.request_id !== undefined && event.which !== 32) {
        window.cancelAnimFrame(this.request_id);
        this.request_id = undefined;
      }
    });
  }

  startMovement(direction) {
    if(direction === 'left' && !this.request_id) {
      //call moveLeft
      this.moveLeft();
    } else if(!this.request_id){
      //call moveRight
      this.moveRight();
    }
  }

  moveLeft() {
    this.clearPlayer(this.player.getData());
    if(this.player.withinBounds(this.canvas)){ 
      this.player.moveLeft();
      //this.notifyServer();
    }
    this.drawPlayer(this.player.getData());
    this.request_id = window.requestAnimFrame(this.moveLeft.bind(this), document.getElementById('game-canvas'));
  }

  moveRight() {
    this.clearPlayer(this.player.getData());
    if(this.player.withinBounds) {
      this.player.moveRight();
      //this.notifyServer();
    }
    this.drawPlayer(this.player.getData());
    this.request_id = window.requestAnimFrame(this.moveRight.bind(this), document.getElementById('game-canvas'));
  }

  moveUp() {

  }

  moveDown() {

  }

  jump() {
    if(this.interval === -1) {
      let up = true; 
      this.interval = setInterval(() => {
        this.clearPlayer(this.player.getData());
        if(up) {
          this.player.moveUp();
          if(this.player.reachedPeak(this.canvas.height)) up = false;
        } else {
          this.player.moveDown();
          if(this.player.reachedGround(this.canvas.height)) {
            clearInterval(this.interval);
            this.interval = -1;
          }
        } 
        this.notifyServer();
        this.drawPlayer(this.player.getData());
      }, 5);
    }
  }

  notifyServer() { 
    this.socket.emit(events.UPDATE_PLAYER_POSITION, {
      user_id: this.player.getUserId(),
      update: this.player.getData()
    });
  }
}

export default GameCore;
