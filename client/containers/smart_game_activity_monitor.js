import {connect} from 'react-redux';
import GameActivityMonitor from '../components/game_activity_monitor';

function mapStateToProps(state) {
    return {}
}

function mapDispatchToProps(dispatch) {
    return {}
}

let SmartGameActivityMonitor = connect(mapStateToProps, mapDispatchToProps)(GameActivityMonitor);

export default SmartGameActivityMonitor;
