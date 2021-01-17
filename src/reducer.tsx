import {Editor} from './model';
import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {getImageDataOfSelectedArea} from './actions';

export let editor: Editor = {
    canvas: {} as ImageData,
    selectedObject: null,
}

export function dispatch<T>(func: { (edtr: Editor, obj: T): Editor }, obj: T): void {
    editor = func(editor, obj);
    ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
    );  
}

export function getSelectionImgData () {
    let imgData = getImageDataOfSelectedArea(editor);  
    return imgData;
}

// export function dispatch<T>(func: { (edtr: Editor, obj: T): Editor }, obj: T): void {
//     editor = func(editor, obj);
//     ReactDOM.render(
//     <React.StrictMode>
//         <App editor={editor}/>
//     </React.StrictMode>,
//     document.getElementById('root')
//     );  
// }
