import {connect} from 'react-redux';
import MainLobby from '../components/main_lobby';
import {setView} from '../actions/view';

function mapStateToProps(state) {
  return {}
}

function mapDispatchToProps(dispatch) {
  return {}
}

let SmartMainLobby = connect(mapStateToProps, mapDispatchToProps)(MainLobby);

export default SmartMainLobby;
