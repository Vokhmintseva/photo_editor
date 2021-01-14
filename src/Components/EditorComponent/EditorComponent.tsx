import React, { useState, useRef } from 'react';
import { Figure, Editor } from '../../model';
import Toolbar from '../Toolbar/Toolbar';
import { isSelectedArea, isTextObject, isShapeObject, addFigure, deSelectArea } from '../../actions';
import Video from '../Video/Video';
import SelectedArea from '../SelectedObject/SelectedArea';
import TextObject from '../SelectedObject/TextObject';
import ShapeObject from '../SelectedObject/ShapeObject';
import Canvas from '../Canvas/Canvas';
import './EditorComponent.css';
import { Intent, setIntention } from '../../intentResolver';
import { dispatch } from '../../reducer';
import SelectingSA from '../SelectedObject/SelectingSA';
import SelectingTextObject from '../SelectedObject/SelectingTextObject';

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
    const [figure, setFigure] = useState(Figure.circle);
    //let figureSelectedRef = useRef(false);

    const toggleShowCamera = () => {
        setShouldShowCamera(!shouldShowCamera);
    }

    const showShapeObjHundler = () => {
        if (showShapeObj) {
            dispatch(deSelectArea, {});
        }
        setShowShapeObj(!showShapeObj);
        setShowTextArea(false);
    }

    const toggleShowTextArea = () => {
        if (showTextArea) {
            dispatch(deSelectArea, {});
        }
        setShowTextArea(!showTextArea);
        setShowShapeObj(false);
    }

    const onShapeObjClickHandler = (event: any) => {
        const newFigure: Figure = event.target.id;
        if (newFigure == figure && showShapeObj) {
            //figureSelectedRef.current = false;
            setShowShapeObj(false);
            dispatch(deSelectArea, {});
        } else {
            //figureSelectedRef.current = true;
            setFigure(newFigure);
            setShowShapeObj(true);
            dispatch(addFigure, {figureType: newFigure});
        }
        setShowTextArea(false);
    }
    
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

                {(props.editor.selectedObject && isShapeObject(props.editor.selectedObject)) &&
                <ShapeObject
                    editor={props.editor}
                    figure={figure}
                    showShapeObjHundler={showShapeObjHundler}
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

                {!showTextArea && !showShapeObj &&
                <SelectingSA 
                    editor={props.editor}                
                />
                }       

                {showTextArea && 
                <SelectingTextObject
                    editor={props.editor} 
                />
                }
            </div>
        </CanvasContext.Provider>
    )
}

export default EditorComponent;