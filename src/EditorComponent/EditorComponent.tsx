import React, { useRef, useEffect, useState } from 'react'
import {Editor} from '../model'
import Toolbar from '../Toolbar/Toolbar';
import { dispatch, getSelectionImgData} from '../reducer';
import {selectArea, cut, getSelectedAreaData, addImage} from '../actions';
import Video from '../UI/Video';
//import Svg from '../UI/Svg/Svg';
import './EditorComponent.css';

interface EditorComponentProps {
    editor: Editor
}

function EditorComponent(editProps: EditorComponentProps) {
    console.log('rendering');
    const [isVideoPlaying, setVideoPlaying] = useState(false);
    const [isOnSvgClick, setIsOnSvgClick] = useState(false);
    const [selectionParams, setSelectionParams] = useState({start: {x: 0, y: 0}, end: {x: 0, y: 0}});
    const [isMousePressed, setIsMousePressed] = useState(false);
    const [mouseDownCoords, setMouseDownCoords] = useState({x: 0, y: 0});
    let canvasRef = useRef(null);
    let svgRef = useRef(null);
    
    
    function TogglePlayngState() {
        setVideoPlaying(!isVideoPlaying);
    }

    function onMouseDownHandler(event: any) {
        //console.log('in onMouseDownHandler function');
        //mouseDownCoord = {x: event.clientX, y: event.clientY};
        setIsMousePressed(true);
        setMouseDownCoords({x: event.clientX, y: event.clientY});
        if (selectionParams !== {start: {x: 0, y: 0}, end: {x: 0, y: 0}}) {
            setSelectionParams({start: {x: 0, y: 0}, end: {x: 0, y: 0}});
        }
    }
    
    const onMouseMoveHandler = function (event: any) {
        if (isMousePressed) {
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
        setIsMousePressed(false);
        const canv: HTMLCanvasElement = canvasRef.current!;
        const canvasCoord = canv.getBoundingClientRect();
        const upClientX = event.clientX;
        const upClientY = event.clientY;
        let downClientX = mouseDownCoords.x;
        let downClientY = mouseDownCoords.y;
        if ((upClientX !== mouseDownCoords.x) && (upClientY !== mouseDownCoords.y) && !isOnSvgClick) {
           
            const selectionCoords = getSelectionParams({x: mouseDownCoords.x, y: mouseDownCoords.y}, {x: event.clientX, y: event.clientY});
            const startX = selectionCoords[0].x as number;
            const startY = selectionCoords[0].y as number;
            const endX = selectionCoords[1].x as number;
            const endY = selectionCoords[1].y as number;
            dispatch(selectArea, {startPoint: {x: startX, y: startY - canvasCoord.top}, endPoint: {x: endX, y: endY - canvasCoord.top}});
        }
        
        if ((upClientX !== mouseDownCoords.x) && (upClientY !== mouseDownCoords.y) && isOnSvgClick) {
            let newImgData: any = getSelectionImgData();
            newImgData = getSelectionImgData();
            setIsMousePressed(false);
            const canv: HTMLCanvasElement = canvasRef.current!;
            var context = canv.getContext('2d') as CanvasRenderingContext2D;
            context.putImageData(newImgData, upClientX, upClientY, 0, 0, canv.width, canv.height);
            const newData = context.getImageData(0, 0, canv.width, canv.height);
            setIsOnSvgClick(false);
            dispatch(addImage, {newImage: newData});
            
        }
    }
    
    const onMouseDownSvgHandler = function (event: any) {
        console.log('in onMouseDownSvgHandler function');
        setIsOnSvgClick(true);
        setIsMousePressed(false);
        event.stopPropagation();
    }

    // const onMouseUpSvgHandler = function (event: any) {
    //     setIsOnSvgClick(false);
    //     let newImgData = getSelectionImgData();
    //     console.log('newImgData', newImgData);
    //     setIsMousePressed(false);
    //     // event.stopPropagation();
    //     // dispatch(cut, {});
    // }

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
                        top: `${selectionParams.start.y ?? 0}`,
                        left: `${selectionParams.start.x ?? 0}`,
                        width: `${selectionParams.end.x - selectionParams.start.x ?? 0}`,
                        height: `${selectionParams.end.y - selectionParams.start.y ?? 0}`
                    }}

                >
                </svg>
                
                <Video editor={editProps.editor} reference={canvasRef}/>
            </div>
        </div>
    )
}

export default EditorComponent;