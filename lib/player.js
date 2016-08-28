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

  moveUp() {
    this.data.position.y -= 1;
  }

  moveDown() {
    this.data.position.y += 1;
  }

  reachedPeak(ground) {
    return ground - this.data.position.y >= 50; 
  }

  reachedGround(ground) {
    return ground === this.data.position.y;
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
