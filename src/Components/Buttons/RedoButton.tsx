import React from 'react';
import { Editor } from '../../model'
import './buttons.css';
import { undoStack, redoStack } from '../../history';
import { rollEditor } from '../../store/actions/Actions';
import { connect } from 'react-redux';
import { Intention } from '../../Intentions';

interface RedoButtonProps {
    onRollOn: (payload: {newEditor: Editor}) => void,
    editor: Editor,
    onSetIntention: (intent: Intention) => void,
}

function RedoButton(props: RedoButtonProps) {
    
    function onRedo() {
        if (redoStack.length) {
            props.onSetIntention(Intention.SelectArea);
            if (!props.editor.selectedObject) {
                let currEditor: Editor = {...props.editor};
                undoStack.push(currEditor);
            }
            const nextEditor: Editor = redoStack.pop()!;
            props.onRollOn({newEditor: nextEditor});
        }
    }   

    return (
        <button onClick={onRedo} className="redoBtn" title="Повторить"></button>
    );
}

function mapStateToProps(state: any) {
    return {
        editor: state.editorReducer.editor
    }
}

function mapDispatchToProps(dispatch: any) {
    return {
      onRollOn: (payload: {newEditor: Editor}) => dispatch(rollEditor(payload)),
    }
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(RedoButton);
