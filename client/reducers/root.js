import {combineReducers} from 'redux';
import socket from './socket';
import menu_options from './menu_options';

let rootReducer = combineReducers({
    socket,
    menu_options
})

export default rootReducer;
