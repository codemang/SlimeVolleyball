import React from 'react';

class MainLobby extends React.Component {
    constructor(props) {
        super(props);
    }

    getMenuOptions() {
        return this.props.menu_options.map((menu_option, index) => {
            if(menu_option.active) {
                return <p key={index} className="active-menu-option">{menu_option.label}</p>
            } else {
                return <p key={index} className="inactive-menu-option">{menu_option.label}</p>
            }
        })
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
