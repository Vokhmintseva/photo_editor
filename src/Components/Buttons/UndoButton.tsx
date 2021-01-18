import React from 'react';
import { Editor } from '../../model';
import './buttons.css';
import { undo, undoStack } from '../../history';
import { rollEditor } from '../../store/actions/Actions';
import { connect } from 'react-redux';

interface UndoButtonProps {
   onRollBack: (payload: {newEditor: Editor}) => void,
}

function UndoButton(props: UndoButtonProps) {
    
    function onUndo() {
        if (undoStack.length) {
            const editor: Editor = undo();
            console.log('editor from undoStack', editor);
            props.onRollBack({newEditor: editor});
        }
    }   

    return (
        <button onClick={onUndo} className="undoBtn" title="Отменить"></button>
    );
}    

function mapDispatchToProps(dispatch: any) {
    return {
      onRollBack: (payload: {newEditor: Editor}) => dispatch(rollEditor(payload)),
    }
  }
  
export default connect(null, mapDispatchToProps)(UndoButton);