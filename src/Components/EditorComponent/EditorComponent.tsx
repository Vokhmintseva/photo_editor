import React, { useState } from 'react';
import { Figure, Editor } from '../../model';
import Toolbar from '../Toolbar/Toolbar';
import { isSelectedArea, isTextObject, isShapeObject } from '../../actions';
import Video from '../Video/Video';
import SelectedArea from '../SelectedObject/SelectedArea';
import TextObject from '../SelectedObject/TextObject';
import ShapeObject from '../SelectedObject/ShapeObject';
import Canvas from '../Canvas/Canvas';
import './EditorComponent.css';
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
    const [showCamera, setShowCamera] = useState(false);
    const [showTextArea, setShowTextArea] = useState(false);
    const [showShapeObj, setShowShapeObj] = useState(false);
    const [showSelArea, setShowSelArea] = useState(true);
    const [figure, setFigure] = useState(Figure.circle);
    const [showNewFigure, setShowNewFigure] = useState(false);
    const [showGallery, setShowGallery] = useState(false);

    const [canvas, setCanvas] = useState(null);
    const getCanvas = (ref: any) => setCanvas(ref.current!);

    const onShowCamera = () => {
        setShowCamera(!showCamera);
    }

    const onShowSelArea = (should: boolean) => {
        setShowSelArea(should);
    }

    function onShowNewFigure(should: boolean) {
        setShowNewFigure(should);
    }

    const onOpenGalleryHandler = () => {
        setShowGallery(!showGallery);
    }

    const onCancelFigureClickHandler = () => {
        props.onDeselectArea();
        setShowShapeObj(false);
    }

    const onShowTextArea = () => {
        if (showTextArea) {
            props.onDeselectArea();
        }
        setShowTextArea(!showTextArea);
        setShowShapeObj(false);
    }

    const onShowFigureClickHandler = (event: any) => {
        const newFigure: Figure = event.target.id;
        setShowNewFigure(true);
        setShowShapeObj(true);
        setFigure(newFigure);
        props.onAddFigure({figureType: newFigure});
        setShowTextArea(false);
        setShowGallery(false);
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
                 <SelectedArea onShowSelArea={onShowSelArea}/>
                }

                {(props.editor.selectedObject && isTextObject(props.editor.selectedObject)) &&
                <TextObject
                    onShowTextArea={onShowTextArea}
                />}

                {(props.editor.selectedObject && isShapeObject(props.editor.selectedObject)) &&
                <ShapeObject
                    figure={figure}
                    onShowFigureClickHandler={onShowFigureClickHandler}
                    showNewFigure={showNewFigure}
                    onShowNewFigure={onShowNewFigure}
                    onCancelFigureClickHandler={onCancelFigureClickHandler}
                />}

                {!showCamera
                ? <Canvas 
                    setCanv={getCanvas}
                />
                : <Video
                    onShowCamera={onShowCamera}
                />}

                {!showTextArea && !showShapeObj && !showGallery && showSelArea && 
                <SelectingSA onShowSelArea={onShowSelArea}/>
                }       

                {showTextArea && !showGallery && !showShapeObj &&
                <SelectingTextObject/>
                }
                
                {showGallery &&
                <Gallery 
                    onOpenGalleryHandler={onOpenGalleryHandler}
                />
                }
               
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