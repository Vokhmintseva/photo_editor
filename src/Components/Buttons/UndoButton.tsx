import React from 'react';
import { Editor } from '../../model';
import './buttons.css';
import { undo, undoStack, redoStack } from '../../history';
import { rollEditor } from '../../store/actions/Actions';
import { connect } from 'react-redux';
import { Intention } from '../../Intentions';

interface UndoButtonProps {
   onRollBack: (payload: {newEditor: Editor}) => void,
   editor:Editor,
   onSetIntention: (intent: Intention) => void,
}

function UndoButton(props: UndoButtonProps) {
    
    function onUndo() {
        props.onSetIntention(Intention.SelectArea);
        if (undoStack.length) {
            if (!props.editor.selectedObject) {
                let currEditor: Editor = {...props.editor};
                redoStack.push(currEditor);
            }
            const prevEditor: Editor = undoStack.pop()!
            props.onRollBack({newEditor: prevEditor});
        }
    }   

    return (
        <button onClick={onUndo} className="undoBtn" title="Отменить"></button>
    );
}    

function mapStateToProps(state: any) {
    return {
        editor: state.editorReducer.editor
    }
}

function mapDispatchToProps(dispatch: any) {
    return {
      onRollBack: (payload: {newEditor: Editor}) => dispatch(rollEditor(payload)),
    }
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(UndoButton);