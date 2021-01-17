import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Editor} from './model';
import {createCanvas} from './actions';
import {editor} from './reducer';
import {dispatch} from './reducer';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './store/reducers/rootReducer';

const store = createStore(rootReducer);
//dispatch(createCanvas, {width: 800, height: 600});

const app = (
  <Provider store={store}>
    <React.StrictMode>
     <App/>
   </React.StrictMode>
  </Provider>
)

ReactDOM.render(app, document.getElementById('root'));

serviceWorker.unregister();