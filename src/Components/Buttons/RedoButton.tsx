import React from 'react';
import { Editor } from '../../model'
import './buttons.css';
import { redo, redoStack } from '../../history';
import { rollEditor } from '../../store/actions/Actions';
import { connect } from 'react-redux';

interface RedoButtonProps {
    onRollOn: (payload: {newEditor: Editor}) => void,
}

function RedoButton(props: RedoButtonProps) {
    
    function onRedo() {
        if (redoStack.length) {
            const editor: Editor = redo()!;
            props.onRollOn({newEditor: editor});
        }
    }   

    return (
        <button onClick={onRedo} className="redoBtn" title="Повторить"></button>
    );
}    

function mapDispatchToProps(dispatch: any) {
    return {
      onRollOn: (payload: {newEditor: Editor}) => dispatch(rollEditor(payload)),
    }
  }
  
export default connect(null, mapDispatchToProps)(RedoButton);