import React from "react"

import "../stylesheets/main.scss"
import GameCore from "../../lib/game_core.js"

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      game_core: new GameCore(props.socket, false)
    }
  }

  render() {
    return (
      <div className="nav-bar">hello world</div>
    );
  }
}

export default Layout;
