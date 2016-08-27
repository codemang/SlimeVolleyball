import React from 'react';
import GameCore from '../../lib/game_core';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      game_core: new GameCore()
    }
  }

  render() {
    return (
      <div>Game View</div>
    )
  }
}

export default Game;
