class Player {
  constructor(user_id, socket, player_data) {
    this.user_id = user_id;
    this.socket = socket;
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
  moveLeft() {
    this.data.position.x -= 1;
  }

  moveRight() {
    this.data.position.x += 1; 
  }

  withinBounds(canvas) {
    return this.data.position.x - this.data.radius > 0 && this.data.position.x + this.data.radius < canvas.width; 
  }

  //used by server
  updatePosition(update) {
    this.data.position = update; 
  }
}

export default Player;
