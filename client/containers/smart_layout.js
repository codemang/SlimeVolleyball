import {connect} from 'react-redux';
import Layout from '../components/layout';
import {setMenuOptions} from '../actions/menu_options'; 

function mapStateToProps(state) {
    return {
        socket: state.socket
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setMenuOptions: (menu_options) => {
            dispatch(setMenuOptions(menu_options));
        }
    }
}

let SmartLayout = connect(mapStateToProps, mapDispatchToProps)(Layout);

export default SmartLayout;
