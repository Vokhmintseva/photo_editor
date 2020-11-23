import React, { useRef, useEffect, useState } from 'react'
import {Editor} from '../model'
import Toolbar from '../Toolbar/Toolbar';
import { dispatch, getSelectionImgData} from '../reducer';
import {selectArea, cut, getSelectedAreaData, addImage, deSelectArea} from '../actions';
import Video from '../UI/Video';
//import Svg from '../UI/Svg/Svg';
import './EditorComponent.css';

interface EditorComponentProps {
    editor: Editor
}

function EditorComponent(editProps: EditorComponentProps) {
    console.log('rendering');
    const [isVideoPlaying, setVideoPlaying] = useState(false);
    
    let isMousePressed = false;
    let isOnSvgClick = false;
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
    let svgRef = useRef(null);
    
        function TogglePlayngState() {
        setVideoPlaying(!isVideoPlaying);
    }

    const onMouseDownSvgHandler = function (event: any) {
        console.log('in onMouseDownSvgHandler function');
        isOnSvgClick = true;
        // //isMousePressed = false;
        // event.stopPropagation();
    }
    
    function onMouseDownHandler(event: any) {
        console.log('in onMouseDownHandler function');
        isMousePressed = true;
        mouseDownCoords = {x: event.clientX, y: event.clientY};
        // if (!isOnSvgClick) {
        //     mouseDownCoords = {x: event.clientX, y: event.clientY};
        // }    

    }
    
    const onMouseMoveHandler = function (event: any) {
        if (isMousePressed && !isOnSvgClick) {
            const selectionCoords = getSelectionParams({x: mouseDownCoords.x, y: mouseDownCoords.y}, {x: event.clientX, y: event.clientY});
            //setSelectionParams({start: {x: selectionCoords[0].x, y: selectionCoords[0].y}, end: {x: selectionCoords[1].x, y: selectionCoords[1].y}});
            //console.log('selectionParams', setSelectionParams);
            const svg: HTMLElement = svgRef.current!;
            svg.style.left = selectionCoords[0].x.toString();
            svg.style.top = selectionCoords[0].y.toString();
            svg.style.width = (selectionCoords[1].x - selectionCoords[0].x).toString();
            svg.style.height = (selectionCoords[1].y - selectionCoords[0].y).toString();
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
        if ((upClientX !== mouseDownCoords.x) && (upClientY !== mouseDownCoords.y) && !isOnSvgClick) {
            console.log('creating selected area');
            const selectionCoords = getSelectionParams({x: mouseDownCoords.x, y: mouseDownCoords.y}, {x: event.clientX, y: event.clientY});
            const startX = selectionCoords[0].x as number;
            const startY = selectionCoords[0].y as number;
            const endX = selectionCoords[1].x as number;
            const endY = selectionCoords[1].y as number;
            dispatch(selectArea, {startPoint: {x: startX, y: startY - canvasCoords.top}, endPoint: {x: endX, y: endY - canvasCoords.top}});
        }
        
        //делаем перемещение
        if ((upClientX !== mouseDownCoords.x) && (upClientY !== mouseDownCoords.y) && isOnSvgClick) {
            console.log('upClientX', upClientX);
            console.log('mouseDownCoords.x', mouseDownCoords.x);
            console.log('upClientY', upClientY);
            console.log('mouseDownCoords.y', mouseDownCoords.y);
            console.log('replacement of selected area');
            let newImgData: any = getSelectionImgData();
            //newImgData = getSelectionImgData();
            //isMousePressed = false;
            const canv: HTMLCanvasElement = canvasRef.current!;
            var context = canv.getContext('2d') as CanvasRenderingContext2D;
            context.putImageData(newImgData, upClientX, upClientY, 0, 0, canv.width, canv.height);
            const newData = context.getImageData(0, 0, canv.width, canv.height);
            //isOnSvgClick = false;
            dispatch(addImage, {newImage: newData});
        }

        console.log('upClientX', upClientX);
        console.log('mouseDownCoords.x', mouseDownCoords.x);
        console.log('upClientY', upClientY);
        console.log('mouseDownCoords.y', mouseDownCoords.y);
        console.log('editProps.editor.selectedObject !== null', editProps.editor.selectedObject !== null);
        console.log('isOnSvgClick', isOnSvgClick);
        
        if ((upClientX == mouseDownCoords.x) && (upClientY == mouseDownCoords.y) && editProps.editor.selectedObject !== null && !isOnSvgClick) {
            console.log('dispatching deselect area');
            dispatch(deSelectArea, {});
        }
        isOnSvgClick = false; 
        isMousePressed = false;
    }
    
    useEffect(() => { //функция запутится после рендеринга
        const canv: HTMLCanvasElement = canvasRef.current!;
        const svg: HTMLElement = svgRef.current!;
        var context = canv.getContext('2d') as CanvasRenderingContext2D;
        context.putImageData(editProps.editor.canvas, 0, 0, 0, 0, editProps.editor.canvas.width, editProps.editor.canvas.height);
        document.addEventListener('mousedown', onMouseDownHandler);
        document.addEventListener('mousemove', onMouseMoveHandler);
        document.addEventListener('mouseup', onMouseUpHandler);
        svg.addEventListener('mousedown', onMouseDownSvgHandler);
        //в функции onMouseDownSvgHandler не работает
        //svg.addEventListener('mouseup', onMouseUpSvgHandler);
        
        return () => {
            document.removeEventListener('mouseup', onMouseUpHandler);
            document.removeEventListener('mousemove', onMouseMoveHandler);
            document.removeEventListener('mousedown', onMouseDownHandler);
            //svg.removeEventListener('mouseup', onMouseUpSvgHandler);
            svg.removeEventListener('mousedown', onMouseDownSvgHandler);

        };
    }); 
    
    let canvasStyles: Array<String> = ['canvas'];
    if (isVideoPlaying) canvasStyles.push('canvasNotVisible');
         
    return (
        <div>
            <Toolbar editor={editProps.editor} reference={canvasRef} togglePlayingFunc={TogglePlayngState}/>
            <div>
                <canvas 
                    className={canvasStyles.join(' ')}
                    ref={canvasRef} //React установит .current на этот DOM-узел
                    width={editProps.editor.canvas.width}
                    height={editProps.editor.canvas.height}
                />
                
                <svg 
                    ref={svgRef}
                    style={{
                        position: 'absolute',
                        border: '1px dashed black',
                        top: `${selectionParams.startY + 31}`,
                        left: `${selectionParams.startX}`,
                        width: `${selectionParams.width}`,
                        height: `${selectionParams.height}`,
                    }}

                >
                </svg>
                
                <Video editor={editProps.editor} reference={canvasRef}/>
            </div>
        </div>
    )
}

export default EditorComponent;