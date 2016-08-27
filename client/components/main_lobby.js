import React from 'react';
import SmartMainMenu from '../containers/smart_main_menu';
import SmartGameActivityMonitor from '../containers/smart_game_activity_monitor';

class MainLobby extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="main-lobby">
        <div id="left-panel">
          <SmartMainMenu />
        </div>
      </div>
    );
  }
}

export default MainLobby;
