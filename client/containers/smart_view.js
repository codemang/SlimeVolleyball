import {connect} from 'react-redux';
import View from '../components/view';
import {setView} from '../actions/view';

function mapStateToProps(state) {
  return {
    view: state.view,
    socket: state.socket
  }
}

function mapDispatchToProps(dispatch) {
  return {
    setView: (view) => {
      dispatch(setView(view));
    },
  }
}

let SmartView = connect(mapStateToProps, mapDispatchToProps)(View);

export default SmartView;
