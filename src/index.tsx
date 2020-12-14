import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Editor} from './model';
import {createCanvas} from './actions';
import {editor} from './reducer';
import {dispatch} from './reducer';

  // let editor: Editor = {
  //   canvas: {} as ImageData,
  //   selectedObject: null,
  // }
  // editor.canvas = createCanvas(editor).canvas;
   dispatch(createCanvas, {width: 800, height: 600});


// ReactDOM.render(
//   <React.StrictMode>
//     <App editor={editor}/>
//   </React.StrictMode>,
//   document.getElementById('root')
// );

serviceWorker.unregister();