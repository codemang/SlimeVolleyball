import {connect} from 'react-redux';
import View from '../components/view';
import {setMenuOptions} from '../actions/menu_options'; 
import {setView} from '../actions/view';

function mapStateToProps(state) {
    return {
        view: state.view,
        socket: state.socket
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setMenuOptions: (menu_options) => {
            dispatch(setMenuOptions(menu_options));
        },
        setView: (view) => {
            dispatch(setView(view));
        }
    }
}

let SmartView = connect(mapStateToProps, mapDispatchToProps)(View);

export default SmartView;
