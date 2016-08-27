import {combineReducers} from 'redux';
import socket from './socket';
import menu_options from './menu_options';
import view from './view';

let rootReducer = combineReducers({
  socket,
  menu_options,
  view
});

export default rootReducer;
