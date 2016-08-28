import React from 'react';
import SmartMainMenu from '../containers/smart_main_menu';
import SmartGameActivityMonitor from '../containers/smart_game_activity_monitor';
import {getMenuOptions} from '../utilities/requests';
import {routes} from '../utilities/routes';

class MainLobby extends React.Component {
  constructor(props) {
    super(props);

    getMenuOptions(routes.menu_options, props.setMenuOptions);
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
