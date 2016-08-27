import {connect} from 'react-redux';
import MainMenu from '../components/main_menu';
import {setView} from '../actions/view';

function mapStateToProps(state) {
  return {
    menu_options: state.menu_options,
    socket: state.socket
  }
}

function mapDispatchToProps(dispatch) {
  return {}
}

let SmartMainMenu = connect(mapStateToProps, mapDispatchToProps)(MainMenu);

export default SmartMainMenu;
