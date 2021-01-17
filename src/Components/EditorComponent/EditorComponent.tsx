import React, { useState, useRef } from 'react';
import { Figure, Editor } from '../../model';
import Toolbar from '../Toolbar/Toolbar';
import { isSelectedArea, isTextObject, isShapeObject } from '../../actions';
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
import { connect } from 'react-redux';
import { deselectArea, addFigure } from '../../store/actions/Actions';

interface EditorComponentProps {
    editor: Editor,
    onDeselectArea: () => void,
    onAddFigure: (payload: {figureType: Figure}) => void
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

    const onShowCamera = () => {
        setShouldShowCamera(!shouldShowCamera);
    }

    function onShouldResetFigureHandler(should: boolean) {
        setShouldResetFigure(should);
    }

    const onOpenGalleryHandler = () => {
        setIsOpenGallery(!showGallery);
    }

    const onCancelFigureClickHandler = () => {
        props.onDeselectArea();
        //dispatch(deSelectArea, {});
        setShowShapeObj(false);
    }

    const onShowTextArea = () => {
        if (showTextArea) {
            props.onDeselectArea();
            //dispatch(deSelectArea, {});
        }
        setShowTextArea(!showTextArea);
        setShowShapeObj(false);
    }

    const onShowFigureClickHandler = (event: any) => {
        const newFigure: Figure = event.target.id;
        setShouldResetFigure(true);
        setShowShapeObj(true);
        setFigure(newFigure);
        props.onAddFigure({figureType: newFigure});
        //dispatch(addFigure, {figureType: newFigure});
        setShowTextArea(false);
    }
    
    return (
        <CanvasContext.Provider value={canvas}>
            <div>
                <Toolbar 
                    onShowCamera={onShowCamera}
                    onShowTextArea={onShowTextArea}
                    showTextArea={showTextArea}
                    onShowFigureClickHandler={onShowFigureClickHandler}
                    onOpenGalleryHandler={onOpenGalleryHandler}
                />
                {(props.editor.selectedObject && isSelectedArea(props.editor.selectedObject)) && 
                 <SelectedArea />
                }

                {(props.editor.selectedObject && isTextObject(props.editor.selectedObject)) &&
                <TextObject
                    onShowTextArea={onShowTextArea}
                />}

                {/* {(props.editor.selectedObject && isShapeObject(props.editor.selectedObject)) &&
                <ShapeObject
                    editor={props.editor}
                    figure={figure}
                    onShowFigureClickHandler={onShowFigureClickHandler}
                    shouldResetFigure={shouldResetFigure}
                    onShouldResetFigureHandler={onShouldResetFigureHandler}
                    onCancelFigureClickHandler={onCancelFigureClickHandler}
                />} */}

                {!shouldShowCamera
                ? <Canvas 
                    setCanv={getCanvas}
                />
                : <Video
                    onShowCamera={onShowCamera}
                />}

                {!showTextArea && !showShapeObj && !showGallery && !props.editor.selectedObject && 
                <SelectingSA />
                }       

                {showTextArea && !showGallery && !showShapeObj &&
                <SelectingTextObject/>
                }
                {/* {showGallery &&
                    <Gallery 
                        onOpenGalleryHandler={onOpenGalleryHandler}
                    />
                } */}
               
            </div>
        </CanvasContext.Provider>
    )
}

function mapStateToProps(state: any) {
    return {
        editor: state.editorReducer.editor
    }
}
  
function mapDispatchToProps(dispatch: any) {
    return {
      onDeselectArea: () => dispatch(deselectArea()),
      onAddFigure: (payload: {figureType: Figure}) => dispatch(addFigure(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorComponent);