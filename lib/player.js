// Pixels per second
const X_SPEED = 30;

class Player {
  constructor(user_id, socket, player_data) {
    this.user_id = user_id;
    this.socket = socket;
    //data includes:
    //  radius of player
    //  position of player (x, y)
    //  velocity of player (x, y)
    this.data = player_data;
  }

  getUserId() {
    return this.user_id;
  }

  getData() {
    return this.data;
  }

  getSocket() {
    return this.socket;
  }

  //used by client
  setDirection(direction) {
    this.data.direction = direction;
  }

  isMoving() {
    return this.data.direction !== '';
  }

  getDirection() {
    return this.data.direction;
  }

  setVelocityX(velocityX) {
    this.data.velocity.x = velocityX;
  }

  setVelocityY(velocityY) {
    this.data.velocity.y = velocityY;
  }

  //We are considering for every call to these 'move' functions,
  //one unit per time passes
  moveLeft() {
    this.data.position.x -= this.xVelocity();
  }

  moveRight() {
    this.data.position.x +=  this.xVelocity();
  }

  reachedPeak(ground) {
    return ground - this.data.position.y >= 50;
  }

  reachedGround(ground) {
    return ground === this.data.position.y;
  }

  withinLeftBounds() {
    return this.data.position.x - this.data.radius > 5;
  }

  withinRightBounds(canvas) {
    return this.data.position.x + this.data.radius < (canvas.width / 2) - 5;
  }

  //used by server
  updatePosition(update) {
    this.data.position = update;
  }

  isJumping(canvas) {
    return this.data.position.y < canvas.height;
  }

  //x = start_ptX*(1-time)^2 + 2*time*apex_ptX*(1-time) + end_ptX*time^2
  //y = start_ptY*(1-time)^2 + 2*time*apex_ptY*(1-time) + end_ptY*time^2
  quadraticJump(start_pt, end_pt, control_pt, time, canvas) {
    var x = (Math.pow(1-time,2) * start_pt.x) + (2 * (1-time) * time * control_pt.x) + (Math.pow(time,2) * end_pt.x);
    var y = Math.pow(1-time,2) * start_pt.y + 2 * (1-time) * time * control_pt.y + Math.pow(time,2) * end_pt.y;
    this.data.position = {x: Math.round(x), y: Math.round(y)};
    if(start_pt.x - end_pt.x > 0) {
      //jumping left
      if(!this.withinLeftBounds()) {
         this.data.position.x = 5 + this.data.radius;
      }
    } else {
      if(!this.withinRightBounds(canvas)) {
        this.data.position.x = (canvas.width / 2) - 5 - this.data.radius;
      }
      //jumping right
    }
  }

  applyMoves(moves) {
    switch (moves) {
      case 'u':
        break;
      case 'l':
        break;
      case 'r':
        break;
      default:
        return;
    }
  }

  setFrameRate(frameRate) {
    this.frameRate = frameRate;
  }

  xVelocity() {
    return  X_SPEED * this.frameRate / 1000;
  }
}

export default Player;
