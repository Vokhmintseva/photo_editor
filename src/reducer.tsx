import {Editor} from './model';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {addImage, createCanvas} from './actions'

 
export let editor: Editor = {
    canvas: {} as ImageData,
    selectedObject: null,
}

export function dispatch<T>(func: { (edtr: Editor, obj: T): Editor }, obj: T): void {
    editor =  func(editor, obj);
    
    // console.log("editor.canvas.width ", editor.canvas.width);
    // console.log("editor.canvas.height ", editor.canvas.height);
    if (editor.selectedObject != null) {
      // console.log('editor.selectedObject.position.x', editor.selectedObject.position.x);
      // console.log('editor.selectedObject.position.y', editor.selectedObject.position.y);
      // console.log('editor.selectedObject.w', editor.selectedObject.w);
      // console.log('editor.selectedObject.h', editor.selectedObject.h);
    }
    ReactDOM.render(
    <React.StrictMode>
        <App editor={editor}/>
    </React.StrictMode>,
    document.getElementById('root')
    );  
}

export function getEditor(): Editor {
  return editor;
}