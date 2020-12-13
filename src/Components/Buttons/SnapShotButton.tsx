import React from 'react';
import {Editor} from '../../model';

interface SnapshotButtonProps {
    editor: Editor,
    toggleShowCamera: () => void,
}

function SnapshotButton(props: SnapshotButtonProps) {
    
    function snapshotClickHandler() {
        props.toggleShowCamera();
    }   

    return (
        <button onClick={snapshotClickHandler}>Snapshot</button>
    );
}    

export default SnapshotButton;