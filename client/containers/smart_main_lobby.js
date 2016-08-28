import {connect} from 'react-redux';
import MainLobby from '../components/main_lobby';
import {setMenuOptions} from '../actions/menu_options';

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {
    setMenuOptions: (menu_options) => {
      dispatch(setMenuOptions(menu_options));
    },
  }
}

let SmartMainLobby = connect(mapStateToProps, mapDispatchToProps)(MainLobby);

export default SmartMainLobby;
