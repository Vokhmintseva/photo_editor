import React, {useRef, useEffect, useState, useContext}  from 'react';
import { Editor, Point } from '../../model';
import './SelectedObject.css';
import {dispatch} from '../../reducer';
import { isSelectedArea } from '../../actions';
import {CanvasContext} from '../EditorComponent/EditorComponent';
//import { resolve, intention, Intent, setIntention } from '../../intentResolver';
import { joinSelectionWithCanvas, dropSelection } from '../../store/actions/Actions';
import { connect } from 'react-redux';
import { addToHistory } from '../../history';
//import { Intention } from '../../Intentions';

interface SelectedAreaProps {
  editor: Editor,
  //onShowSelArea: (should: boolean) => void,
  onDropSelection: (payload: {where: Point}) => void,
  onJoinSelectionWithCanvas: () => void,
  //onSetIntention: (intent: Intention) => void
}

function calculateInitPos (props: SelectedAreaProps, canvasCoords: DOMRect) {
    return {
        x: props.editor.selectedObject!.position.x,
        y: canvasCoords.top + props.editor.selectedObject!.position.y
    }
}

const SelectedArea = (props: SelectedAreaProps) => {
    let canvas: HTMLCanvasElement | null = useContext(CanvasContext);
    const canvasCoords = canvas!.getBoundingClientRect();
    const [isMousePressed, setIsMousePressed] = useState(false);
    const [offset, setOffset] = useState({x: 0, y: 0});
    const [position, setPosition] = useState(() => {return calculateInitPos(props, canvasCoords)});
    let selCanvasRef = useRef(null);

    
    // function onMouseDownHandler(event: any) {
    //     if (event.clientY < canvasCoords.top) return;
    //     if (event.defaultPrevented) return;
    //     console.log('SA in onMouseDownHandler function');
    //     if (isSelectedArea(props.editor.selectedObject)) {
    //         console.log('dispatch SelectedArea joinSelectionWithCanvas');
    //         addToHistory(props.editor);
    //         props.onJoinSelectionWithCanvas();
    //     }
    //     props.onSetIntention(Intention.SelectArea);
    // }
    
    function onMouseDownSAHandler(event: any) {
        console.log('SA in onMouseDownSAHandler function');
        setOffset({x: event.clientX - position.x!, y: event.clientY - position.y!});
        setIsMousePressed(true);
        event.preventDefault();
    }
    
    const adjustCoords = function (left: number, top: number): {left: number, top: number} {
        const selCanv: HTMLCanvasElement = selCanvasRef.current!;
        
        if (left < canvasCoords.left) {
            left = canvasCoords.left;
        }
        if (left + selCanv.width > canvasCoords.right) {
            left = canvasCoords.right - selCanv.width;
        }
        if (top < canvasCoords.top) {
            top = canvasCoords.top;
        }
        if (top + selCanv.height > canvasCoords.bottom) {
            top = Math.max(canvasCoords.bottom - selCanv.height, canvasCoords.top);
        }
        return {left, top}
    }
    
    const onMouseMoveSAHandler = function (event: any) {
        if (isMousePressed) {
            const adjustedCoords = adjustCoords(event.clientX - offset.x, event.clientY - offset.y)
            setPosition({x: adjustedCoords.left, y: adjustedCoords.top});
            event.preventDefault();
        }
    }

    const onMouseUpSAHandler = function (event: any) {
        if (!isMousePressed) return;
        console.log('SA in onMouseUpSAHandler function');
        const adjustedCoords = adjustCoords(event.clientX - offset.x, event.clientY - offset.y);
        setPosition({x: adjustedCoords.left, y: adjustedCoords.top});
        console.log('dispatch SelectedArea onDropSelection');
        addToHistory(props.editor);
        props.onDropSelection({where: {x: adjustedCoords.left, y: adjustedCoords.top - canvasCoords.top}});
        setIsMousePressed(false);
    }

    useEffect(() => { 
        const selCanvas: HTMLCanvasElement = selCanvasRef.current!;
        selCanvas.addEventListener('mousedown', onMouseDownSAHandler);
        //document.addEventListener('mousedown', onMouseDownHandler);
        document.addEventListener('mousemove', onMouseMoveSAHandler);
        document.addEventListener('mouseup', onMouseUpSAHandler);
        return () => {
            selCanvas.removeEventListener('mousedown', onMouseDownSAHandler);
            //document.removeEventListener('mousedown', onMouseDownHandler);
            document.removeEventListener('mousemove', onMouseMoveSAHandler);
            document.removeEventListener('mouseup', onMouseUpSAHandler);
        };
    });  
    
    useEffect(() => {
        const selCanvas: HTMLCanvasElement = selCanvasRef.current!;
        let selContext = selCanvas.getContext('2d') as CanvasRenderingContext2D;
        selCanvas.style.top = position.y! + 'px';
        selCanvas.style.left = position.x! + 'px';
        selCanvas.setAttribute('width', props.editor.selectedObject!.w.toString());
        selCanvas.setAttribute('height', props.editor.selectedObject!.h.toString());
        if (isSelectedArea(props.editor.selectedObject)) {
            let selAreaImgData: ImageData = props.editor.selectedObject!.pixelArray;
            selContext.putImageData(
                selAreaImgData, 
                -1,
                -1,
                0,
                0,
                props.editor.selectedObject.w,
                props.editor.selectedObject.h
            );
        }
    }, []);
 
    return (
        <canvas 
            ref={selCanvasRef}    
            className="selCanvas"
            style={{
                top: `${position.y}px`,
                left: `${position.x}px`,
            }}
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
      onDropSelection: (payload: {where: Point}) => dispatch(dropSelection(payload)),
      onJoinSelectionWithCanvas: () => dispatch(joinSelectionWithCanvas())
    }
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(SelectedArea);