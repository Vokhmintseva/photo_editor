import React, { useState, useRef, useEffect, useContext }  from 'react';
import { Editor, Point } from '../../model';
import { isSelectedArea } from '../../actions';
import transform from './CoordinateTransformer';
import {CanvasContext} from '../EditorComponent/EditorComponent';
import './SelectedObject.css';
import { connect } from 'react-redux';
import { deselectArea, joinSelectionWithCanvas, selectTextArea } from '../../store/actions/Actions';
import { addToHistory } from '../../history';
import { Intention } from '../../Intentions';

interface TextAreaProps {
    editor: Editor,
    onDeselectArea: () => void,
    onSelectTextArea: (payload: {startPoint: Point, endPoint: Point}) => void,
    onJoinSelectionWithCanvas: () => void,
    onSetIntention: (intent: Intention) => void
}

const SelectingTextObject = (props: TextAreaProps) => {
    let canvas: HTMLCanvasElement | null = useContext(CanvasContext);  
    let svgRef = useRef(null);

    const [mouseState, setMouseState] = useState({
        down: {
            x: 0,
            y: 0,
        },
        isMousePressed: false,
        current: {
            x: 0,
            y: 0,
        }, 
    });
        
    function onMouseDownHandler(event: any) {
        if (props.editor.selectedObject) return;
        const canvasCoords = canvas!.getBoundingClientRect();
        if (event.clientY < canvasCoords.top) return;
        setMouseState({
            ...mouseState,
            down: {
                x: event.clientX,
                y: event.clientY,
            },
            isMousePressed: true,
            current: {
                x: event.clientX,
                y: event.clientY,
            },
        })
    }
    
    const onMouseMoveHandler = function (event: any) {
        if (mouseState.isMousePressed) {
            setMouseState({
                ...mouseState,
                current: {
                    x: event.clientX,
                    y: event.clientY,
                },
            });
        }
    }
    
    const onMouseUpHandler = function (event: any) {
        if (!mouseState.isMousePressed) return;
        if ((event.clientX !== mouseState.down.x) && (event.clientY !== mouseState.down.y)) {
            const canvasCoords = canvas!.getBoundingClientRect();
            const selectionCoords = transform(
                { x: mouseState.down.x, y: mouseState.down.y },
                { x: event.clientX, y: event.clientY },
                canvasCoords
            );
            const startX = selectionCoords.startX + 2 as number;
            const startY = selectionCoords.startY + 2 as number;
            const endX = selectionCoords.endX + 2 as number;
            const endY = selectionCoords.endY + 2 as number;
            addToHistory(props.editor);
            props.onSelectTextArea({startPoint: {x: startX, y: startY - canvasCoords.top}, endPoint: {x: endX, y: endY - canvasCoords.top}});
        }
        
        setMouseState({
            ...mouseState,
            isMousePressed: false,
        });
        props.onSetIntention(Intention.HandleSelectedObject);
    }
    
    useEffect(() => {
        if (props.editor.selectedObject && isSelectedArea(props.editor.selectedObject)) {
            console.log('dispatch SelectingTextObject joinSelectionWithCanvas');
            props.onJoinSelectionWithCanvas();
        }
    }, []);

    useEffect(() => {
        if (!canvas) return;
        const canvasCoords = canvas!.getBoundingClientRect();
        document.addEventListener('mousedown', onMouseDownHandler);
        document.addEventListener('mousemove', onMouseMoveHandler);
        document.addEventListener('mouseup', onMouseUpHandler);
        const adjustedSVGcoords = transform(
            { x: mouseState.down.x, y: mouseState.down.y},
            { x: mouseState.current.x, y: mouseState.current.y},
            canvasCoords
        );
    
        const svg: HTMLElement = svgRef.current!;
        svg.style.display = (mouseState.isMousePressed) ? 'block' : 'none';
        svg.style.top = adjustedSVGcoords.startY.toString();
        svg.style.left = adjustedSVGcoords.startX.toString();
        svg.setAttribute('width', adjustedSVGcoords.width.toString());
        svg.setAttribute('height', adjustedSVGcoords.height.toString());
        return () => {
            document.removeEventListener('mousedown', onMouseDownHandler);
            document.removeEventListener('mousemove', onMouseMoveHandler);
            document.removeEventListener('mouseup', onMouseUpHandler);
            
        };
    });

    return (
        <svg
            ref={svgRef}
            className="textSelection"
        />
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
      onSelectTextArea: (payload: {startPoint: Point, endPoint: Point}) => dispatch(selectTextArea(payload)),
      onJoinSelectionWithCanvas: () => dispatch(joinSelectionWithCanvas())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectingTextObject);