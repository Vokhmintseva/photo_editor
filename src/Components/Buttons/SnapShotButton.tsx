import React from 'react';

interface SnapshotButtonProps {
    onShowCamera: () => void,
}

function SnapshotButton(props: SnapshotButtonProps) {
    
    function snapshotClickHandler() {
        props.onShowCamera();
    }   

    return (
        <button onClick={snapshotClickHandler}>Snapshot</button>
    );
}    

export default SnapshotButton;