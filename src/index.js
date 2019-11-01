import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// import App from './App';
import * as serviceWorker from './serviceWorker';
import Routes from './routes/';
import './general/assets/styles/global.css';

// import { format } from 'url';

import {combineReducers , createStore ,compose , applyMiddleware} from 'redux' ;
import {Provider} from 'react-redux';
import {loginUser} from './store/reducers/logindUserReducer';
import {showPosts} from './store/reducers/dashboardReducer' ;
import thunk from 'redux-thunk';

const allReducer = combineReducers({
    loginUser : loginUser,
    showPosts : showPosts
});

const store = createStore(
    allReducer,
    {},
    compose(applyMiddleware(thunk) , window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() ),
);


ReactDOM.render( 
     <Provider store={store}>
         <Routes />
     </Provider>
     , document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
