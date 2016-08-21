import actions from '../utilities/actions';

function menu_options(state = [], action) {
    switch(action.type) {
        case actions.SET_MENU_OPTIONS:
            return action.data.menu_options;
        default:
            return state;
    }
} 

export default menu_options;
