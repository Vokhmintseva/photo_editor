import React from 'react';
import './App.css';
import {Editor} from './model';
import EditorComponent from './EditorComponent/EditorComponent';
import {createCanvas} from './actions'

// interface AppProps {
//   editor: Editor
// }

function App() {
  
  let editor: Editor = {
    canvas: {} as ImageData,
    selectedObject: null,
  }
  editor.canvas = createCanvas(editor).canvas;
  
  return (
    <div className="App">
      <EditorComponent editor={editor}/>
    </div>
  );
}

export default App;


/*      <header className="App-header">
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>*/