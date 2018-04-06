import React                                        from 'react';
import ReactDOM                                     from 'react-dom';
import { Provider }                                 from 'react-redux';
import   thunk                                      from 'redux-thunk';
import { createStore , applyMiddleware, compose }   from 'redux';

import Routes from './components/Routes'
import rootReducer from './reducers/rootReducer'
import setAuthorizationInfo from './utils/setAuthorizationInfo';

const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )
);

setAuthorizationInfo(localStorage.jwtToken);

const app = document.getElementById('app');
ReactDOM.render(<Provider store={ store }>
                    <Routes />
                </Provider>,app);