import uuid from 'node-uuid';
import sio from 'socket.io-client';

import Player from './player';
import events from './events';

const NUM_PLAYERS_PER_GAME = 2;
const W_KEY = 87;
const A_KEY = 65;
const D_KEY = 68;

class GameCore {

  constructor(game_id, is_server=false) {
    this.is_server = is_server;
    this.default_player = {
      radius: 60,
      position: {
        x: 100,
        y: 480
      },
      velocity: {
        x: 0,
        y: 0
      },
      direction: ''
    }

    this.canvas = {
      width: 760,
      height: 480
    }

    this.CONTROL_PT = 120;
    this.MAX_DISTANCE = 150;

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

    this.keyPresses = {};
    this.clientInputs = [];

    this.socket.on(events.JOIN_SUCCESSFUL, (data) => {
      this.player = new Player(data.user_id, this.socket, this.default_player);
      this.client_inputs = [];

      this.client_initGameStateListener();
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

  client_gameLoop() {
    this.client_runGame();
    window.requestAnimFrame(this.client_gameLoop.bind(this), document.getElementById('game-canvas'));
  }

  client_runGame() {
    _.forEach(this.keyPresses, (key, pressed) => {
      if (pressed) {
        this.clientInputs.push(key);
      }
    });

    this.calculateFrameRate();
    this.player.setFrameRate(this.avgFrameDelta);
    this.player.applyMoves(this.clientInputs);

    this.inputsToSend = _.flatten(_.concat(this.inputsToSend, this.clientInputs));
    this.clientInputs = [];

    this.drawGame();
  }

  drawGame() {
    this.drawPlayer(this.player.getData());
  }

  calculateFrameRate() {
    if (this.currentFrameTime) {
      this.lastFrameTime = this.currentFrameTime;
      this.currentFrameTime = new Date();

      let frameDelta = this.currentFrameTime - this.lastFrameTime;

      this.frameDeltas.push(frameDelta);
      if (this.frameDeltas.length > 10) { this.frameDeltas.shift(); }

      this.avgFrameDelta = _.mean(this.frameDeltas);
    }
    else {
      this.currentFrameTime = new Date();
      this.frameDeltas = [];
      this.avgFrameDelta = 1000/60;
    }
  }

  initializeContext(context) {
    this.context = context;
    this.drawPlayer(this.player.getData());
    this.request_id = undefined;
    this.initializeKeyListeners();
  }

  //listens for emits from the server to update a particular player's position
  client_initGameStateListener() {
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
        case W_KEY:
          this.keyPresses['u'] = true;
          break;
        case A_KEY:
          this.keyPresses['l'] = true;
          break;
        case D_KEY:
          this.keyPresses['r'] = true;
          break;
        default:
          return;
      }
    });

    $(document).keypress(event => {
      switch(event.which) {
        case 32:
          //spacebar
          // this.commenceJump();
          break;
      }
    });

    $(document).keyup(event => {
      switch(event.which) {
        case W_KEY:
          this.keyPresses['u'] = false;
          break;
        case A_KEY:
          this.keyPresses['l'] = false;
          break;
        case D_KEY:
          this.keyPresses['r'] = false;
          break;
        default:
          return;
      }
      // if(this.request_id !== undefined && event.which !== 32) {
      //   if(!this.player.isJumping(this.canvas)) {
      //     window.cancelAnimFrame(this.request_id);
      //     this.request_id = undefined;
      //   }
      //   this.player.setVelocityX(0);
      //   this.player.setDirection('');
      // }
    });
  }

  startMovement(direction) {
    if(!this.player.isJumping(this.canvas)) {
      if(!this.request_id) {
        this.player.setDirection(direction);
        this.player.setVelocityX(3);

        if(direction === 'left') {
          this.moveLeft();
        } else {
          this.moveRight();
        }
      }
    }
  }

  commenceJump() {
    if(!this.player.isJumping(this.canvas)) {
      if(this.player.isMoving()) {
        //player is moving horizontally
        //quadratic curve jump
        let start_pt = { ...this.player.getData().position };
        let end_pt = {
          ...this.player.getData().position, //end point
          x: this.player.getData().position.x + this.MAX_DISTANCE
        }
        let control_pt = {
          y: this.canvas.height - this.CONTROL_PT, //control point
          x: this.player.getData().position.x + this.MAX_DISTANCE / 2
        }

        if(this.player.getDirection() === 'left') {
          //jump left
          end_pt.x = this.player.getData().position.x - this.MAX_DISTANCE;
          control_pt.x = this.player.getData().position.x - this.MAX_DISTANCE / 2;
        }
        this.jump(
          new Date().getTime(), //jump start time
          'quadratic', //jump shape
          start_pt,
          end_pt,
          control_pt
        );
      } else {
        //player is stationary
        //vertical jump
        let start_pt = { ...this.player.getData().position };
        let end_pt = { ...this.player.getData().position };
        let control_pt = {
          ...this.player.getData().position,
          y: this.canvas.height - this.CONTROL_PT
        }
        this.jump(
          new Date().getTime(), //jump start time
          'vertical', //jump shape
          start_pt,
          end_pt,
          control_pt
        );
      }
    }
  }

  moveLeft() {
    if(this.player.withinLeftBounds()){
      this.clearPlayer(this.player.getData());
      this.player.moveLeft();
      this.notifyServer();
      this.drawPlayer(this.player.getData());
      this.request_id = window.requestAnimFrame(this.moveLeft.bind(this), document.getElementById('game-canvas'));
    }
  }

  moveRight() {
    if(this.player.withinRightBounds(this.canvas)) {
      this.clearPlayer(this.player.getData());
      this.player.moveRight();
      this.notifyServer();
      this.drawPlayer(this.player.getData());
      this.request_id = window.requestAnimFrame(this.moveRight.bind(this), document.getElementById('game-canvas'));
    }
  }

  jump(start_time, shape, start_pt, end_pt, control_pt) {
    let cur_time = new Date().getTime();

    if(cur_time - start_time  < 1000) {
      this.clearPlayer(this.player.getData());
      this.player.quadraticJump(
        start_pt,
        end_pt,
        control_pt,
        (cur_time - start_time) / 1000, //time
        this.canvas
      );
      this.notifyServer();
      this.drawPlayer(this.player.getData());
      this.request_id = window.requestAnimFrame(() => {
        this.jump(start_time, shape, start_pt, end_pt, control_pt);
      }, document.getElementById('game-canvas'))
    } else {
      this.clearPlayer(this.player.getData());
      this.player.updatePosition({
        ...this.player.getData().position,
        y: this.canvas.height
      });
      this.drawPlayer(this.player.getData());
      window.cancelAnimFrame(this.request_id);
      this.request_id = undefined;
      if(this.player.isMoving()) {
        this.startMovement(this.player.getDirection());
      }
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
