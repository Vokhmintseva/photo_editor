import React, {useRef, useEffect, useState, useContext}  from 'react';
import {Editor} from '../../model';
import './SelectedArea.css';
import {dispatch} from '../../reducer';
import {isSelectedArea, dropSelection, joinSelectionWithCanvas} from '../../actions';
import {CanvasContext} from '../EditorComponent/EditorComponent';

interface SelectedAreaProps {
    editor: Editor,
}

function calculateInitPos (props: SelectedAreaProps, canvasCoords: DOMRect) {
    return {
        x: props.editor.selectedObject!.position.x,
        y: canvasCoords.top + props.editor.selectedObject!.position.y
    }
}

const SelectedArea = (props: SelectedAreaProps) => {
    console.log('rendering SelectedArea');
    let canvas: HTMLCanvasElement | null = useContext(CanvasContext);
    const borderWidth = 1;
    const canvasCoords = canvas!.getBoundingClientRect();

    const [isMousePressed, setIsMousePressed] = useState(false);
    const [offset, setOffset] = useState({x: 0, y: 0});
    // const [position, setPosition] = useState({
    //     x: props.editor.selectedObject!.position.x,
    //     y: canvasCoords.top + props.editor.selectedObject!.position.y
    // });
    const [position, setPosition] = useState(() => {return calculateInitPos(props, canvasCoords)});
    let selCanvasRef = useRef(null);
    
    function onMouseDownHandler(event: any) {
        console.log('SEL CANVAS in onMouseDownHandler function');
        if (event.defaultPrevented) return;
        if (props.editor.selectedObject) {
            if (isSelectedArea(props.editor.selectedObject)) {
                //dispatch(joinSelectionWithCanvas, {});
            }
        }
        event.preventDefault();
    }
    
    function onMouseDownSelectionHandler(event: any) {
        console.log('SEL CANVAS in onMouseDownSelectionHandler function');
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
            top = canvasCoords.top - borderWidth;
        }
        if (top + selCanv.height > canvasCoords.bottom) {
            top = Math.max(canvasCoords.bottom - selCanv.height, canvasCoords.top);
        }
        return {left, top}
    }
    
    const onMouseMoveSelectionHandler = function (event: any) {
        if (isMousePressed) {
            const adjustedCoords = adjustCoords(event.clientX - offset.x, event.clientY - offset.y)
            setPosition({x: adjustedCoords.left, y: adjustedCoords.top});
            event.preventDefault();
        }
        
    }

    const onMouseUpSelectionHandler = function (event: any) {
        if (!isMousePressed) return;
        console.log('SEL CANVAS in onMouseUpHandler function');
        const adjustedCoords = adjustCoords(event.clientX - offset.x, event.clientY - offset.y);
        setPosition({x: adjustedCoords.left, y: adjustedCoords.top});
        dispatch(dropSelection, {where: {x: adjustedCoords.left, y: adjustedCoords.top - canvasCoords.top}});
        setIsMousePressed(false);
        document.removeEventListener('mousemove', onMouseMoveSelectionHandler);
        document.removeEventListener('mouseup', onMouseUpSelectionHandler);
        event.preventDefault();
    }


    // function getSelectionParams (start: {x: number, y: number}, end: {x: number, y: number}) {
    //     const canv: HTMLCanvasElement = canvasRef.current!;
    //     const canvasCoord = canv.getBoundingClientRect();
    //     let startX = Math.min(start.x, end.x, canvasCoord.width);
    //     let startY = Math.max(canvasCoord.y, Math.min(canvasCoord.y + canvasCoord.height, end.y, start.y));
    //     let endX = Math.min(Math.max(end.x, start.x), canvasCoord.width);
    //     let endY = Math.min(startY + Math.abs(end.y - start.y), canvasCoord.y + canvasCoord.height);
    //     return ({
    //         startX: startX,
    //         startY: startY,
    //         endX: endX,
    //         endY: endY,
    //         width: endX - startX,
    //         height: endY - startY,
    //     })
    // }

    useEffect(() => { 
        document.addEventListener('mousemove', onMouseMoveSelectionHandler);
        document.addEventListener('mouseup', onMouseUpSelectionHandler);
    }, [isMousePressed, offset]);

    useEffect(() => { 
        const selCanvas: HTMLCanvasElement = selCanvasRef.current!;
        selCanvas.addEventListener('mousedown', onMouseDownSelectionHandler);
        document.addEventListener('mousedown', onMouseDownHandler);
        //функция сработает когда произойдет следующая перерисовка
        return () => {
            selCanvas.removeEventListener('mousedown', onMouseDownSelectionHandler);
            document.removeEventListener('mousedown', onMouseDownHandler);
        };
    });  
    
    useEffect(() => {
        const selCanvas: HTMLCanvasElement = selCanvasRef.current!;
        let selContext = selCanvas.getContext('2d') as CanvasRenderingContext2D;
        selCanvas.style.top = position.y! - borderWidth * 2 + 'px';
        selCanvas.style.left = position.x! - borderWidth * 2 + 'px';
        selCanvas.setAttribute('width', props.editor.selectedObject!.w.toString());
        selCanvas.setAttribute('height', props.editor.selectedObject!.h.toString());
        if (isSelectedArea(props.editor.selectedObject)) {
            let selAreaImgData: ImageData = props.editor.selectedObject!.pixelArray;
            selContext.putImageData(
                selAreaImgData, 
                0,
                0,
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

export default SelectedArea;