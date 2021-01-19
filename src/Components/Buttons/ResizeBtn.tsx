import React, { useState } from 'react';
import { Editor } from '../../model'
import './buttons.css';
import { rollEditor } from '../../store/actions/Actions';
import { connect } from 'react-redux';
import ResizeModal from '../ResizeModal/ResizeModal';

interface ResizeBtnProps {
    onRollOn: (payload: {newEditor: Editor}) => void,
    editor: Editor,
}

function ResizeBtn(props: ResizeBtnProps) {
    const [showResizeModal, setShowResizeModal] = useState(false);

    function onShowModalClicked(should: boolean) {
        setShowResizeModal(should);
    }    

    return (
        <div>
            <button onClick={e => onShowModalClicked(true)} title="Изменить размер">Изменить размер</button>
            {showResizeModal &&
            <ResizeModal onShowModalClicked={onShowModalClicked}/>
            }
        </div>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(ResizeBtn);