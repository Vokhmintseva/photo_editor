import React, { useEffect, useState } from 'react';
import { Figure, Editor } from '../../model';
import Toolbar from '../Toolbar/Toolbar';
import { isSelectedArea, isTextObject, isShapeObject, deSelectArea } from '../../actions';
import Video from '../Video/Video';
import SelectedArea from '../SelectedObject/SelectedArea';
import TextObject from '../SelectedObject/TextObject';
import ShapeObject from '../SelectedObject/ShapeObject';
import Canvas from '../Canvas/Canvas';
import './EditorComponent.css';
import { Intent, setIntention } from '../../intentResolver';
import { dispatch } from '../../reducer';

interface EditorComponentProps {
    editor: Editor
}

export const CanvasContext = React.createContext(null);

function EditorComponent(props: EditorComponentProps) {
    const [shouldShowCamera, setShouldShowCamera] = useState(false);
    const [showTextArea, setShowTextArea] = useState(false);
    const [showShapeObj, setShowShapeObj] = useState(false);
    
    const [canvas, setCanvas] = useState(null);
    const getCanvas = (ref: any) => setCanvas(ref.current!);

    const toggleShowCamera = () => {
        setShouldShowCamera(!shouldShowCamera);
    }

    const toggleShowTextArea = () => {
        if (showTextArea) {
            dispatch(deSelectArea, {});
        }
        setShowTextArea(!showTextArea);
    }

    const onShapeObjClickHandler = (event: any) => {
        if (showShapeObj) {
            dispatch(deSelectArea, {});
        }
        setShowShapeObj(!showShapeObj);
    }
    
    // useEffect(() => {
    //     showTextArea ? setIntention(Intent.SelectingTextObj) : setIntention(Intent.Nothing);
    // })
         
    return (
        <CanvasContext.Provider value={canvas}>
            <div>
                <Toolbar 
                    editor={props.editor}
                    toggleShowCamera={toggleShowCamera}
                    toggleShowTextArea={toggleShowTextArea}
                    showTextArea={showTextArea}
                    onShapeObjClickHandler={onShapeObjClickHandler}
                />

                {(props.editor.selectedObject && isSelectedArea(props.editor.selectedObject)) &&
                <SelectedArea
                    editor={props.editor}
                />}

                {(props.editor.selectedObject && isTextObject(props.editor.selectedObject)) &&
                <TextObject
                    editor={props.editor}
                    toggleShowTextArea={toggleShowTextArea}
                />}

                {showShapeObj &&
                <ShapeObject
                    editor={props.editor}
                />}
                
                {!shouldShowCamera 
                ? <Canvas 
                    setCanv={getCanvas}
                    editor={props.editor}
                    showTextArea={showTextArea}
                />
                : <Video
                    toggleShowCamera={toggleShowCamera}
                />}
                
            </div>
        </CanvasContext.Provider>
    )
}

export default EditorComponent;