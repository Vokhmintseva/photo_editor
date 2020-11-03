import React from 'react';
import './App.css';
import {Editor} from './model';
import EditorComponent from './EditorComponent/EditorComponent';


interface AppProps {
  editor: Editor
}

function App(appProps: AppProps) {
  return (
    <div className="App">
      <EditorComponent editor={appProps.editor}/>
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