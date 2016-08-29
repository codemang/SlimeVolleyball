//npm package imports
import React from "react";
import { Provider } from 'react-redux';
import ReactDOM from "react-dom"

import SmartView from "./containers/smart_view";
import configureStore from './store/configureStore';
import './utilities/window';

let store = configureStore({
    ...require('./store/preloadedState.json'),
});

ReactDOM.render(
    <Provider store={store}>
        <SmartView /> 
    </Provider>, 
    document.getElementById("root")
);
