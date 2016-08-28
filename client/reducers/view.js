import actions from '../utilities/actions';

function view(state = '', action) {
  switch(action.type) {
    case actions.SET_VIEW:
    case actions.JOIN_GAME:
      return action.data.view;
    default:
      return state;
  }
}

export default view;
