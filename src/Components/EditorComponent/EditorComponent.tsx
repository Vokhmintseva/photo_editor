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
import { dispatch, editor } from '../../reducer';
import SelectingSA from '../SelectedObject/SelectingSA';
import SelectingTextObject from '../SelectedObject/SelectingTextObject';
import Gallery from '../Gallery/Gallery';

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
    const [shouldResetFigure, setShouldResetFigure] = useState(false);
    const [showGallery, setIsOpenGallery] = useState(false);

    const toggleShowCamera = () => {
        setShouldShowCamera(!shouldShowCamera);
    }

    function onShouldResetFigureHandler(should: boolean) {
        setShouldResetFigure(should);
    }

    const onOpenGalleryHandler = () => {
        setIsOpenGallery(!showGallery);
    }

    const onCancelFigureClickHandler = () => {
        dispatch(deSelectArea, {});
        setShowShapeObj(false);
    }

    const toggleShowTextArea = () => {
        if (showTextArea) {
            dispatch(deSelectArea, {});
        }
        setShowTextArea(!showTextArea);
        setShowShapeObj(false);
    }

    const onShowFigureClickHandler = (event: any) => {
        const newFigure: Figure = event.target.id;
        setShouldResetFigure(true);
        setShowShapeObj(true);
        setFigure(newFigure);
        dispatch(addFigure, {figureType: newFigure});
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
                    onShowFigureClickHandler={onShowFigureClickHandler}
                    onOpenGalleryHandler={onOpenGalleryHandler}
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
                    onShowFigureClickHandler={onShowFigureClickHandler}
                    shouldResetFigure={shouldResetFigure}
                    onShouldResetFigureHandler={onShouldResetFigureHandler}
                    onCancelFigureClickHandler={onCancelFigureClickHandler}
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

                {!showTextArea && !showShapeObj && !showGallery &&
                <SelectingSA 
                    editor={props.editor}                
                />
                }       

                {showTextArea && !showGallery && !showShapeObj &&
                <SelectingTextObject
                    editor={props.editor} 
                />
                }
                {showGallery &&
                    <div>
                        <Gallery 
                            onOpenGalleryHandler={onOpenGalleryHandler}
                        />
                        <canvas />
                    </div>
                }
            </div>
        </CanvasContext.Provider>
    )
}

export default EditorComponent;