import React from 'react';
import {Editor} from '../../model';
import {addImage} from '../../actions';
import { dispatch } from '../../reducer';


interface SnapShotButtonProps {
    editor: Editor,
    reference: any,
    togglePlayingFunc: () => void,
}

function SnapShotButton(snapShotButtonProps: SnapShotButtonProps) {
     function snapShotClickHandler() {
        snapShotButtonProps.togglePlayingFunc();
     }   


    return (
        <button onClick={snapShotClickHandler}>Snapshot</button>
    );
}    

export default SnapShotButton;