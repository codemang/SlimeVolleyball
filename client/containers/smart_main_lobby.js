import {connect} from 'react-redux';
import MainLobby from '../components/main_lobby.js';
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

let SmartMainLobby = connect(mapStateToProps, mapDispatchToProps)(MainLobby);

export default SmartMainLobby;
