import {combineReducers} from 'redux';
import socket from './socket';
import menu_options from './menu_options';
import view from './view';
import game from './game';

let rootReducer = combineReducers({
  socket,
  menu_options,
  view,
  game
});

export default rootReducer;
