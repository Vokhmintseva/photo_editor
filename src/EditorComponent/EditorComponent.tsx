import React, { useRef, useEffect, useState } from 'react'
import {Editor} from '../model'
import Toolbar from '../Toolbar/Toolbar';
import { dispatch, getSelectionImgData} from '../reducer';
import {selectArea, cut, getSelectedAreaData, addImage, deSelectArea} from '../actions';
import Video from '../UI/Video';
import './EditorComponent.css';

interface EditorComponentProps {
    editor: Editor
}

function EditorComponent(editProps: EditorComponentProps) {
    console.log('rendering');
    const [isVideoPlaying, setVideoPlaying] = useState(false);
    //const [selectionImgData, getSelectionImgData] = useState({} as ImageData);
    
    
    let isMousePressed = false;
    let isOnSelectionClick = false;
    let mouseDownCoords = {x: 0, y: 0};
    
    let selectionParams = {startX: 0, startY: 0, width: 0, height: 0}; 
    if (editProps.editor.selectedObject !== null) {
        selectionParams = {
                            startX: editProps.editor.selectedObject.position.x, 
                            startY: editProps.editor.selectedObject.position.y,
                            width: editProps.editor.selectedObject.w,
                            height: editProps.editor.selectedObject.h,
                          }
        
    }                      

    let canvasRef = useRef(null);
    let selCanvasRef = useRef(null);
    
        function TogglePlayngState() {
        setVideoPlaying(!isVideoPlaying);
    }

    const onMouseDownSelectionHandler = function (event: any) {
        console.log('in onMouseDownSvgHandler function');
        isOnSelectionClick = true;
    }
    
    function onMouseDownHandler(event: any) {
        console.log('in onMouseDownHandler function');
        isMousePressed = true;
        mouseDownCoords = {x: event.clientX, y: event.clientY};
    }
    
    const onMouseMoveHandler = function (event: any) {
        
        const selCanv: HTMLCanvasElement = selCanvasRef.current!;
        if (isMousePressed && !isOnSelectionClick) {
            const selectionCoords = getSelectionParams({x: mouseDownCoords.x, y: mouseDownCoords.y}, {x: event.clientX, y: event.clientY});
            selCanv.style.left = selectionCoords[0].x + 'px';
            selCanv.style.top = selectionCoords[0].y + 'px';
            selCanv.style.width = selectionCoords[1].x - selectionCoords[0].x + 'px';
            selCanv.style.height = selectionCoords[1].y - selectionCoords[0].y + 'px';
        }
        if (isOnSelectionClick) {
            
            selCanv.style.left = event.clientX + 'px';
            selCanv.style.top = event.clientY + 'px';
            selCanv.style.width = selectionParams.width + 'px';
            selCanv.style.height = selectionParams.height + 'px';
            
            
        }
    }

    function getSelectionParams (start: {x: number, y: number}, end: {x: number, y: number})
    {
        const canv: HTMLCanvasElement = canvasRef.current!;
        const canvasCoord = canv.getBoundingClientRect();
        let startX = Math.min(start.x, end.x);
        let startY = Math.max(canvasCoord.y, Math.min(end.y, start.y));
        let endX = Math.min(Math.max(end.x, start.x), canvasCoord.width);
        let endY = Math.min(startY + Math.abs(end.y - start.y), canvasCoord.y + canvasCoord.height);
        return ([{x: startX, y: startY}, {x: endX, y: endY}]);
    }

    const onMouseUpHandler = function (event: any) {
        console.log('in onMouseUpHandler function');
        const canv: HTMLCanvasElement = canvasRef.current!;
        const canvasCoords = canv.getBoundingClientRect();
        const upClientX = event.clientX;
        const upClientY = event.clientY;
        
        //делаем выделение
        if ((upClientX !== mouseDownCoords.x) && (upClientY !== mouseDownCoords.y) && !isOnSelectionClick) {
            console.log('creating selected area');
            const selectionCoords = getSelectionParams({x: mouseDownCoords.x, y: mouseDownCoords.y}, {x: event.clientX, y: event.clientY});
            const startX = selectionCoords[0].x as number;
            const startY = selectionCoords[0].y as number;
            const endX = selectionCoords[1].x as number;
            const endY = selectionCoords[1].y as number;
            dispatch(selectArea, {startPoint: {x: startX, y: startY - canvasCoords.top}, endPoint: {x: endX, y: endY - canvasCoords.top}});
        }
        
        //делаем перемещение
        if ((upClientX !== mouseDownCoords.x) && (upClientY !== mouseDownCoords.y) && isOnSelectionClick) {
           
            const canv: HTMLCanvasElement = canvasRef.current!;
            var context = canv.getContext('2d') as CanvasRenderingContext2D;
            let selectedImgData: any = context.getImageData(selectionParams.startX, selectionParams.startY, selectionParams.width, selectionParams.height);
            context.putImageData(selectedImgData, upClientX, upClientY - canvasCoords.top);
            const selCanv: HTMLCanvasElement = selCanvasRef.current!;
            selCanv.style.left = upClientX;
            selCanv.style.top = upClientY;
            selCanv.style.width = selectionParams.width.toString();
            selCanv.style.height = selectionParams.height.toString();
            const newData = context.getImageData(0, 0, canv.width, canv.height);
            dispatch(addImage, {newImage: newData});
        }

        //снимаем выделение
        if ((upClientX == mouseDownCoords.x) && (upClientY == mouseDownCoords.y) && editProps.editor.selectedObject !== null && !isOnSelectionClick) {
            console.log('dispatching deselect area');
            dispatch(deSelectArea, {});
        }
        isOnSelectionClick = false; 
        isMousePressed = false;
    }
    
    useEffect(() => { //функция запутится после рендеринга
        const canv: HTMLCanvasElement = canvasRef.current!;
        const selCanv: HTMLCanvasElement = selCanvasRef.current!;
        var context = canv.getContext('2d') as CanvasRenderingContext2D;
        var selContext = selCanv.getContext('2d') as CanvasRenderingContext2D;
        
        context.putImageData(editProps.editor.canvas, 0, 0, 0, 0, editProps.editor.canvas.width, editProps.editor.canvas.height);
        if (editProps.editor.selectedObject !== null) {
            let selectionImgData = context.getImageData(selectionParams.startX, selectionParams.startY, selectionParams.width, selectionParams.height);
            console.log('selectionParams.startX', selectionParams.startX);
            console.log('selectionParams.startY', selectionParams.startY);
            console.log('selectionParams.width', selectionParams.width);
            console.log('selectionParams.height', selectionParams.height);
            selCanv.style.left = selectionParams.startX.toString();
            selCanv.style.top = selectionParams.startY.toString();
            selCanv.style.width = selectionParams.width.toString();
            selCanv.style.height = selectionParams.height.toString();
            console.log('putting img data on new canvas');
            selContext.putImageData(selectionImgData, 0, 0, 0, 0, selectionParams.width, selectionParams.height);
        };

        document.addEventListener('mousedown', onMouseDownHandler);
        document.addEventListener('mousemove', onMouseMoveHandler);
        document.addEventListener('mouseup', onMouseUpHandler);
        
        selCanv.addEventListener('mousedown', onMouseDownSelectionHandler);
        
        return () => {
            document.removeEventListener('mouseup', onMouseUpHandler);
            document.removeEventListener('mousemove', onMouseMoveHandler);
            document.removeEventListener('mousedown', onMouseDownHandler);
            selCanv.removeEventListener('mousedown', onMouseDownSelectionHandler);

        };
    }); 
    
    let canvasStyles: Array<String> = ['canvas'];
    if (isVideoPlaying) canvasStyles.push('canvasNotVisible');
         
    return (
        <div>
            <Toolbar editor={editProps.editor} reference={canvasRef} togglePlayingFunc={TogglePlayngState}/>
            
            <canvas 
                className={canvasStyles.join(' ')}
                ref={canvasRef} //React установит .current на этот DOM-узел
                width={editProps.editor.canvas.width}
                height={editProps.editor.canvas.height}
                style={{position: 'absolute'}}
            />
            
            <canvas
                ref={selCanvasRef}
                style={{
                    position: 'absolute',
                    border: '1px dashed black',
                    top: `${selectionParams.startY + 31}`,
                    left: `${selectionParams.startX}`,
                    width: `${selectionParams.width}`,
                    height: `${selectionParams.height}`,
                    //zIndex: 50
                }}

            ></canvas>
            
            
            {/* <Video editor={editProps.editor} reference={canvasRef}/> */}
            
        </div>
    )
}

export default EditorComponent;