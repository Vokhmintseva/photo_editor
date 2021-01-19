import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Editor} from './model';
import {createCanvas} from './actions';
import {editor} from './reducer';
import {dispatch} from './reducer';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './store/reducers/rootReducer';
import { addToHistory, undoStack } from './history';

import editorReducer from './store/reducers/editorReducer';

function loggerMiddleWare(store: any) {
  return function(next: any) {
    return function(action: any) {
      const result = next(action);

      return result;
    }
  }
}

const store = createStore(rootReducer, applyMiddleware(loggerMiddleWare));


const app = (
  <Provider store={store}>
    <React.StrictMode>
     <App/>
   </React.StrictMode>
  </Provider>
)

ReactDOM.render(app, document.getElementById('root'));

serviceWorker.unregister();