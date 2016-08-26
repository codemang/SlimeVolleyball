import React from 'react';

class MainLobby extends React.Component {
    constructor(props) {
        super(props);
    }

    handleMenuOptionClick(selected_option) {
        console.log('Clicked option: ' + selected_option);
        switch(selected_option) {
            case 'join_match':
                this.props.socket.emit('attempt_join', {});
                break;
            case 'bot_match':
            case 'instructions':
            case 'contribute':
            default:
                return;
        }
    }

    getMenuOptions() {
        return this.props.menu_options.map((menu_option, index) => {
            if(menu_option.active) {
                return <p key={index} onClick={() => this.handleMenuOptionClick(menu_option.value)} className="active-menu-option">{menu_option.label}</p>
            } else {
                return <p key={index} className="inactive-menu-option">{menu_option.label}</p>
            }
        });
    }

    render() {
        return (
            <div>
                {this.getMenuOptions()}
            </div>
        );
    }
}

export default MainLobby;
