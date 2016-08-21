import {connect} from 'react-redux';
import MainLobby from '../components/main_lobby.js';

function mapStateToProps(state) {
    return {
        menu_options: state.menu_options
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

let SmartMainLobby = connect(mapStateToProps, mapDispatchToProps)(MainLobby);

export default SmartMainLobby;
