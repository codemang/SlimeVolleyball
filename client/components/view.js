import React from 'react';
import SmartMainLobby from '../containers/smart_main_lobby';
import SmartGame from '../containers/smart_game';
import "../stylesheets/main.scss";

class View extends React.Component {
    constructor(props) {
        super(props);
        props.socket.on('connection_successful', (data) => {
          console.log("CLIENT: connection to server successful");
          this.props.setMenuOptions(data.menu_options);  
        });
        props.socket.on('join_successful', data => {
            console.log(data);
            this.props.setView('game');
        });
    }

    getView() {
        switch(this.props.view) {
            case 'main_lobby':
                return <SmartMainLobby />
            case 'game':
                return <SmartGame />
            case 'instructions':
            case 'contribute':
            default:
                return <div>Default View</div>
        }
    }

    render() {
        return this.getView();
    }
}

export default View;
