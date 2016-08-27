import React from 'react';

class MainMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  handleMenuOptionClick(selected_option) {
    console.log('Clicked option: ' + selected_option);
    switch(selected_option) {
      case 'online':
        this.props.socket.emit('attempt_join', {});
        break;
      case 'local':
      case 'instructions':
      case 'contribute':
      default:
        return;
    }
  }

  getMenuOptions() {
    return this.props.menu_options.map((menu_option, index) => {
      if(menu_option.active) {
        return <p key={index} onClick={() => this.handleMenuOptionClick(menu_option.value)} className="menu-option active-menu-option">{menu_option.label}</p>
      } else {
        return <p key={index} className="menu-option inactive-menu-option">{menu_option.label}</p>
      }
    });
  }

  render() {
    return (
      <div id="main-menu">
        {this.getMenuOptions()}
      </div>
    );
  }
}

export default MainMenu;
