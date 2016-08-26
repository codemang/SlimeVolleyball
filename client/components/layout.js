import React from "react"

import GameCore from "../../lib/game_core.js"
import SmartMainLobby from '../containers/smart_main_lobby';

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      game_core: new GameCore(props.socket, false)
    }

    props.socket.on('connection_successful', (data) => {
      console.log("CLIENT: connection to server successful");
      this.props.setMenuOptions(data.menu_options);  
    });
    props.socket.on('join_successful', (data) => {
      console.log(data);
    });
  }

  render() {
    return (
      <div className="nav-bar"><SmartMainLobby /></div>
    );
  }
}

export default Layout;
