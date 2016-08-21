class GameCore {
  constructor(socket, is_server) {
    this.socket = socket;
    this.is_server = is_server;

    if (this.is_server) {
      setInterval(() => {
        this.socket.emit('date', { date:  new Date()});
      }, 1000);
    }
    else {
      socket.on('date', function(data){
        console.log(data.date);
      });
    }
  }

  // Store state calculated by server
  // client_onserverupdate_recieved(data) {
  //   cilent_apply_opponent(data);
  //   client_reoncile_host(data);
  // }
  //
  // // Apply state changes for opponent
  // client_apply_opponent() { }
  //
  // // Reconcile differences between server and host client
  // client_reconcile_host() { }
  //
  // // Apply inputs
  // client_handle_input() { }
  //
  // // Send host input moves to server
  // client_send_host_move() { }
  //
  // configure() {
  //   // Apply constants
  //   this.gravity = 10;
  //   this.players = [];
  //   this.player_inputs = {};
  // }
}

export default GameCore;
