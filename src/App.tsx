import React, { useEffect } from 'react';
import { Editor } from './model'
import './App.css';
import EditorComponent from './Components/EditorComponent/EditorComponent';
import { redo, undo, redoStack, undoStack } from './history';
import { rollEditor } from './store/actions/Actions';
import { connect } from 'react-redux';

interface AppProps {
  onRoll: (payload: {newEditor: Editor}) => void,
}

function App(props: AppProps) {
  
  const onKeyPressed = (event: any) => {
    if (event.ctrlKey && (event.which == 90 || event.keyCode == 90)) {
      if (undoStack.length) {
        const editor: Editor = undo();
        props.onRoll({newEditor: editor});
      }
    }
    if (event.ctrlKey && (event.which == 89 || event.keyCode == 89)) {
      if (redoStack.length) {
        const editor: Editor = redo()!;
        props.onRoll({newEditor: editor});
      }
    }
  }

  useEffect(() => {
      document.addEventListener('keydown', event => onKeyPressed(event));
      return () => {
          document.removeEventListener('keydown', onKeyPressed);
      };
  });
  
  return (
    <div className="App">
      <EditorComponent />
    </div>
  );
}

function mapDispatchToProps(dispatch: any) {
  return {
    onRoll: (payload: {newEditor: Editor}) => dispatch(rollEditor(payload)),
  }
}

export default connect(null, mapDispatchToProps)(App);