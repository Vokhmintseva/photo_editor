import React, { useRef, useEffect, useState } from 'react';
import {Editor} from '../../model';
import Toolbar from '../Toolbar/Toolbar';
// import { dispatch, getSelectionImgData} from '../../reducer';
// import {selectArea, cut, getSelectedAreaData, addImage, deSelectArea} from '../../actions';
import Video from '../Video/Video';
import SelectedArea from '../SelectedArea/SelectedArea';
import Canvas from '../Canvas/Canvas';
import './EditorComponent.css';

interface EditorComponentProps {
    editor: Editor
}

export const CanvasContext = React.createContext(null);

function EditorComponent(props: EditorComponentProps) {
    console.log('rendering EditorComponent');
    const [shouldShowCamera, setShouldShowCamera] = useState(false);
    
    const [canvas, setCanvas] = useState(null);
    const getCanvas = (ref: any) => setCanvas(ref.current!);
  

    const toggleShowCamera = () => {
        setShouldShowCamera(!shouldShowCamera);
    }
    
    // let canvasStyles: Array<String> = ['canvas'];
    // if (isVideoPlaying) canvasStyles.push('canvasNotVisible');
         
    return (
        <CanvasContext.Provider value={canvas}>
            <div>
                <Toolbar 
                    editor={props.editor}
                    toggleShowCamera={toggleShowCamera}
                />

                {props.editor.selectedObject !==null &&
                <SelectedArea
                    editor={props.editor}
                />}
                
                {!shouldShowCamera &&
                <Canvas 
                    setCanv={getCanvas}
                    editor={props.editor}
                />}
                        
                {shouldShowCamera &&
                <Video
                    toggleShowCamera={toggleShowCamera}
                />}
                
            </div>
        </CanvasContext.Provider>
    )
}

export default EditorComponent;