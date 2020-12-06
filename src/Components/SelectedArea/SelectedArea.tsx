import React, {useRef, useEffect, useState, useContext}  from 'react';
import {Editor} from '../../model';
import './SelectedArea.css';
import {dispatch, getSelectionImgData} from '../../reducer';
import {dropSelection, addImage} from '../../actions';
import {CanvasContext} from '../EditorComponent/EditorComponent';

interface SelectedAreaProps {
    editor: Editor,
}

const SelectedArea = (props: SelectedAreaProps) => {
    console.log('rendering SelectedArea');
    
    let isMousePressed = false;
    let mouseDownCoords = {x: 0, y: 0};
    let offset = {x: 0, y: 0};
    let selCanvasRef = useRef(null);

    function onMouseDownSelectionHandler(event: any) {
        console.log('SEL CANVAS in onMouseDownHandler function');
        const selCanvas: HTMLCanvasElement = selCanvasRef.current!;
        const selCanvasCoords = selCanvas.getBoundingClientRect();
        offset = {x: event.clientX - selCanvasCoords.x, y: event.clientY - selCanvasCoords.y}
        document.addEventListener('mousemove', onMouseMoveSelectionHandler);
        document.addEventListener('mouseup', onMouseUpSelectionHandler);
        isMousePressed = true;
        mouseDownCoords = {x: event.clientX, y: event.clientY};
        event.preventDefault();
    }
    
    const adjustCoords = function (top: number, left: number) {
        const selCanv: HTMLCanvasElement = selCanvasRef.current!;
        if (top < canvasCoords.top) {
            top = canvasCoords.top
        }
        if (top + selCanv.height > canvasCoords.bottom) {
            top = Math.max(canvasCoords.bottom - selCanv.height, canvasCoords.top)
        }
        if (left < canvasCoords.left) {
            left = canvasCoords.left;
        }
        if (left + selCanv.width > canvasCoords.right) {
            left = canvasCoords.right - selCanv.width;
        }
        return {top, left}
    }
    
    const onMouseMoveSelectionHandler = function (event: any) {
        //делаем перетаскивание
        if (isMousePressed) {
            let adjustedCoords = adjustCoords(event.clientY - offset.y, event.clientX - offset.x)
            
            const selCanv: HTMLCanvasElement = selCanvasRef.current!;
            selCanv.style.top = adjustedCoords.top + 'px';
            selCanv.style.left = adjustedCoords.left + 'px';
        }
        event.preventDefault();
    }

    const onMouseUpSelectionHandler = function (event: any) {
        console.log('SEL CANVAS in onMouseUpHandler function');
        //делаем перемещение
        if (event.clientX !== mouseDownCoords.x && event.clientY !== mouseDownCoords.y) {
            const selCanv: HTMLCanvasElement = selCanvasRef.current!;
            const selCanvasCoords = selCanv.getBoundingClientRect();
            let left = event.clientX - offset.x;
            let top = event.clientY + selCanvasCoords - offset.y;
            let adjustedCoords = adjustCoords(top, left);
            selCanv.style.top = adjustedCoords.top + 'px';
            selCanv.style.left = adjustedCoords.left + 'px';

            // selCanv.style.width = selCanvasCoords.width - borderWidth + 'px';
            // selCanv.style.height = selCanvasCoords + 'px';
            // const newData = selContext.getImageData(0, 0, selCanv.width, selCanv.height);
            // let top = event.clientY - selCanvasCoords.y;
            //dispatch(dropSelection, {where: {x: event.clientX, y: top}});
        }
        isMousePressed = false;
        // var context = canvas!.getContext('2d') as CanvasRenderingContext2D;            
        // const newData = context.getImageData(0, 0, canvas!.width, canvas!.height);
        // dispatch(addImage, {newImage: newData});
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

    let canvas: HTMLCanvasElement | null = useContext(CanvasContext);
    const canvasCoords = canvas!.getBoundingClientRect();
    const borderWidth = 2;

    useEffect(() => { //функция запутится после рендеринга
        const selCanvas: HTMLCanvasElement = selCanvasRef.current!;
        var selContext = selCanvas.getContext('2d') as CanvasRenderingContext2D;
        const canvasCoords = canvas!.getBoundingClientRect();
        selCanvas.style.top = props.editor.selectedObject!.position.y + canvasCoords.top - borderWidth + 'px';
        selCanvas.style.left = props.editor.selectedObject!.position.x - borderWidth + 'px';
        selCanvas.setAttribute('width', props.editor.selectedObject!.w.toString());
        selCanvas.setAttribute('height', props.editor.selectedObject!.h.toString());
        let selAreaImgData: ImageData = getSelectionImgData();
        selContext.putImageData(selAreaImgData, 0, 0, 0, 0, props.editor.selectedObject!.w, props.editor.selectedObject!.h);
       // let testImgData = selContext.getImageData(0, 0, selCanvas.width, selCanvas.height);
        selCanvas.addEventListener('mousedown', onMouseDownSelectionHandler);

        //функция сработает когда произойдет следующая перерисовка
        return () => {
            selCanvas.removeEventListener('mousedown', onMouseDownSelectionHandler);
        };
    });
    
    
    // function onMouseDownHandler(event: any) {
    //     if (props.editor.selectedObject) {
    //         const selection: HTMLCanvasElement = selCanvasRef.current!;
    //         console.log('скрытие выделенной области')
    //         selection.style.display = 'none';
    //     }
    // }
    
    // useEffect(() => { //функция запутится после рендеринга
    //     document.addEventListener('mousedown', onMouseDownHandler);
        
        
    //     //функция сработает когда произойдет следующая перерисовка
    //     return () => {
    //         document.removeEventListener('mousedown', onMouseDownHandler);
    //         // debugger;
    //         // if (props.editor.selectedObject) {
    //         //     const selection: HTMLCanvasElement = selCanvasRef.current!;
    //         //     console.log('скрытие выделенной области')
    //         //     selection.style.display = 'block';
    //         // }

            
    //     };
    // });
    
    if (props.editor.selectedObject) {
        return (
            <canvas 
                ref={selCanvasRef}    
                className="selCanvas"
                // style={{
                //     top: `${props.editor.selectedObject!.position!.y - 2}px`,
                //     left: `${props.editor.selectedObject!.position!.x - 2}px`,
                //     width: `${props.editor.selectedObject!.w}px`,
                //     height: `${props.editor.selectedObject!.h}px`,
                    
                // }}>
                >
            </canvas>   
        ) 
    } else {
        return <div/>
    }
}

export default SelectedArea;


//height: `${props.editor.selectedObject ? props.editor.selectedObject.h : 0}`