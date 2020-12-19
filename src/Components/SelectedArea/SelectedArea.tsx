import React, {useRef, useEffect, useState, useContext}  from 'react';
import {Editor} from '../../model';
import './SelectedArea.css';
import {dispatch, getSelectionImgData} from '../../reducer';
import {cut, addImage, isSelectedArea, deSelectArea, dropSelection} from '../../actions';
import {CanvasContext} from '../EditorComponent/EditorComponent';

interface SelectedAreaProps {
    editor: Editor,
}

const SelectedArea = (props: SelectedAreaProps) => {
    console.log('rendering SelectedArea');
    let canvas: HTMLCanvasElement | null = useContext(CanvasContext);
    const borderWidth = 1;
    const canvasCoords = canvas!.getBoundingClientRect();
    const [isMousePressed, toggleIsMousePressed] = useState(false);
    const [offset, setOffset] = useState({x: 0, y: 0});
    const [position, setPosition] = useState({x: props.editor.selectedObject?.position.x, y: canvasCoords.top + props.editor.selectedObject!.position.y!});
    let selCanvasRef = useRef(null);
    

    // function onMouseDownHandler(event: any) {
    //     const canvasCoords = canvas!.getBoundingClientRect();
    //     if (event.clientY < canvasCoords.top) {
    //         return;
    //     }
    //     if (event.defaultPrevented) {
    //         return;
    //     }
    //     if (isSelectedArea(props.editor.selectedObject) ) {
    //         console.log('SEL CANVAS in on Mouse Down Handler function ');
    //         let context = canvas!.getContext('2d') as CanvasRenderingContext2D;
    //         const selCanvas: HTMLCanvasElement = selCanvasRef.current!;
    //         const selCanvasCoords = selCanvas!.getBoundingClientRect();
            
    //         let selAreaImgData: ImageData = props.editor.selectedObject.pixelArray;
    //         context.putImageData(
    //             selAreaImgData, 
    //             selCanvasCoords.left + borderWidth,
    //             selCanvasCoords.top - canvasCoords.top + borderWidth,
    //             0,
    //             0,
    //             selCanvasCoords.width,
    //             selCanvasCoords.height
    //         );
    //         const newData = context.getImageData(0, 0, canvas!.width, canvas!.height);
    //         console.log('add image , deselect')
    //         dispatch(addImage, {newImage: newData});
    //     }
    // }
  
    function onMouseDownSelectionHandler(event: any) {
        console.log('SEL CANVAS in onMouseDownSelectionHandler function');
        setOffset({x: event.clientX - position.x!, y: event.clientY - position.y!});
        document.addEventListener('mousemove', onMouseMoveSelectionHandler);
        document.addEventListener('mouseup', onMouseUpSelectionHandler);
        toggleIsMousePressed(true);
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
        //делаем перетаскивание
        if (isMousePressed) {
            const adjustedCoords = adjustCoords(event.clientX - offset.x, event.clientY - offset.y)
            setPosition({x: adjustedCoords.left, y: adjustedCoords.top})
        }
        event.preventDefault();
    }

    const onMouseUpSelectionHandler = function (event: any) {
        console.log('SEL CANVAS in onMouseUpHandler function');
        const adjustedCoords = adjustCoords(event.clientX - offset.x, event.clientY - offset.y)
        setPosition({x: adjustedCoords.left, y: adjustedCoords.top + canvasCoords.top})
        document.removeEventListener('mousemove', onMouseMoveSelectionHandler);
        document.removeEventListener('mouseup', onMouseUpSelectionHandler);
        event.preventDefault();
        dispatch(dropSelection, {where: {x: position.x!, y: position.y - canvasCoords.top!}})
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

    
    
    

    useEffect(() => { //функция запутится после рендеринга
        const selCanvas: HTMLCanvasElement = selCanvasRef.current!;
        let selContext = selCanvas.getContext('2d') as CanvasRenderingContext2D;
        selCanvas.style.top = position.y! + canvasCoords.top - borderWidth * 2 + 'px';
        selCanvas.style.left = position.x! - borderWidth * 2 + 'px';
        selCanvas.setAttribute('width', props.editor.selectedObject!.w.toString());
        selCanvas.setAttribute('height', props.editor.selectedObject!.h.toString());
        if (isSelectedArea(props.editor.selectedObject) ) {
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
        selCanvas.addEventListener('mousedown', onMouseDownSelectionHandler);
        // document.addEventListener('mousedown', onMouseDownHandler);
       
        //функция сработает когда произойдет следующая перерисовка
        return () => {
            selCanvas.removeEventListener('mousedown', onMouseDownSelectionHandler);
            // document.removeEventListener('mousedown', onMouseDownHandler);
        };
    });
 
    return (
        <canvas 
            ref={selCanvasRef}    
            className="selCanvas"
        />
    ) 
}

export default SelectedArea;


//height: `${props.editor.selectedObject ? props.editor.selectedObject.h : 0}`