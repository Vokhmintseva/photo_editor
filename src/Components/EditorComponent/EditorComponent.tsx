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
import SelectingSelectedArea from '../SelectedObject/SelectingSA';
import SelectingTextObject from '../SelectedObject/SelectingTextObject';
import Gallery from '../Gallery/Gallery';
import { connect } from 'react-redux';
import { deselectArea, addFigure } from '../../store/actions/Actions';
import { Intention } from '../../Intentions';

interface EditorComponentProps {
    editor: Editor,
    onDeselectArea: () => void,
}

export const CanvasContext = React.createContext(null);

function EditorComponent(props: EditorComponentProps) {
    const [figure, setFigure] = useState(Figure.circle);
    const [showNewFigure, setShowNewFigure] = useState(false);

    const [intention, setIntention] = useState(Intention.SelectArea);
    
    const [canvas, setCanvas] = useState(null);
    const getCanvas = (ref: any) => setCanvas(ref.current!);

    const onSetIntention = (intent: Intention) => {
        setIntention(intent);
    }

    function onShowNewFigure(should: boolean) {
        setShowNewFigure(should);
    }

    function onSetFigure(newFigure: Figure) {
        setFigure(newFigure);
    }


    return (
        <CanvasContext.Provider value={canvas}>
            <div>
                {intention != Intention.TakePhoto &&
                <Toolbar 
                    onSetFigure={onSetFigure}
                    onSetIntention={onSetIntention}
                />
                }
                
                {(props.editor.selectedObject && isSelectedArea(props.editor.selectedObject)) && 
                 <SelectedArea />
                }

                {(props.editor.selectedObject && isTextObject(props.editor.selectedObject)) &&
                <TextObject onSetIntention={onSetIntention} />
                }

                {(props.editor.selectedObject && isShapeObject(props.editor.selectedObject)) &&
                <ShapeObject
                    figure={figure}
                    showNewFigure={showNewFigure}
                    onShowNewFigure={onShowNewFigure}
                    onSetIntention={onSetIntention}
                />}

                {intention == Intention.TakePhoto
                ? <Video onSetIntention={onSetIntention} />
                : <Canvas setCanv={getCanvas} />
                }

                {(intention == Intention.SelectArea) &&
                <SelectingSelectedArea />
                }       

                {intention == Intention.SelectTextObj &&
                <SelectingTextObject onSetIntention={onSetIntention}/>
                }
                
                {intention == Intention.BrowseRemoteGallery &&
                <Gallery onSetIntention={onSetIntention} />
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