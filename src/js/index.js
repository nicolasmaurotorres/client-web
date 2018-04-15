import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore , applyMiddleware, compose } from 'redux';
import jwt from 'jsonwebtoken';

import Routes from './components/Routes'
import rootReducer from './reducers/rootReducer'
import setAuthorizationInfo from './utils/setAuthorizationInfo';
import { setCurrentUser } from './actions/authActions';

import FontAwesome from 'react-fontawesome'

const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )
);
// TODO: agregar un time para hacer la validacion si el token es valido por 5m sino desloguearlo
if (localStorage.jwtToken){
    setAuthorizationInfo(localStorage.jwtToken);
    store.dispatch(setCurrentUser(jwt.decode(localStorage.jwtToken)));
} else {
    store.dispatch(setCurrentUser({}));
}

const app = document.getElementById('app');
ReactDOM.render(<Provider store={ store }>
                    <Routes />
                </Provider>,app);