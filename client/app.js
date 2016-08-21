//npm package imports
import React from "react";
import { Provider } from 'react-redux';
import ReactDOM from "react-dom"
import sio from "socket.io-client";

import SmartLayout from "./containers/smart_layout.js";
import configureStore from './store/configureStore';

let socket = sio('http://localhost:8080');

let store = configureStore({
    ...require('./store/preloadedState.json'),
    socket
})

ReactDOM.render(
    <Provider store={store}>
        <SmartLayout /> 
    </Provider>, 
    document.getElementById("root")
);
