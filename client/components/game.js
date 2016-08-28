import React from 'react';
import GameCore from '../../lib/game_core';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      game_core: new GameCore(),
      canvas: {
        width: 800,
        height: 480
      }
    }
  }

  componentDidMount() {
    this.state.game_core.initialize(`http://localhost:8080`);
  }

  render() {
    return (
      <canvas id="game-canvas" ref='canvas' width={this.state.canvas.width} height={this.state.canvas.height}></canvas>
    )
  }
}

export default Game;
