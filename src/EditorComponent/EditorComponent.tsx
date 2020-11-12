import React, { useRef, useEffect, useState } from 'react'
import {Editor} from '../model'
import Toolbar from '../Toolbar/Toolbar';
import { dispatch} from '../reducer';
import {selectArea, cut} from '../actions';
import Video from '../UI/Video';
import './EditorComponent.css';

interface EditorComponentProps {
    editor: Editor
}

function EditorComponent(editProps: EditorComponentProps) {
    console.log('rendering');
    const [isVideoPlaying, setVideoPlaying] = useState(false);
    const [isOnSvgClick, toggleIsOnSvgClick] = useState(false);
    let mouseDownCoord = {x: 0, y: 0};
    let canvasRef = useRef(null);
    let svgRef = useRef(null);
    
    function TogglePlayngState() {
        setVideoPlaying(!isVideoPlaying);
    }

    function onMouseDownHandler(event: any) {
        mouseDownCoord = {x: event.clientX, y: event.clientY};
        document.addEventListener('mouseup', onMouseUpHandler);
    }
    
    const onMouseUpHandler = function (event: any) {
        const canv: HTMLCanvasElement = canvasRef.current!;
        const canvasCoord = canv.getBoundingClientRect();
        const upClientX = event.clientX;
        const upClientY = event.clientY;
        if ((upClientX !== mouseDownCoord.x) && (upClientY !== mouseDownCoord.y) && !isOnSvgClick) {
            let startX = Math.min(upClientX, mouseDownCoord.x);
            let startY = Math.max(canvasCoord.y, Math.min(upClientY, mouseDownCoord.y));
            let endX = Math.min(Math.max(upClientX, mouseDownCoord.x), canvasCoord.width);
            let endY = Math.min(startY + Math.abs(upClientY - mouseDownCoord.y), canvasCoord.y + canvasCoord.height);
            if (startX >= canvasCoord.width || startY >= canvasCoord.y + canvasCoord.height) {
                return;
            }
            dispatch(selectArea, {startPoint: {x: startX, y: startY - 31}, endPoint: {x: endX, y: endY - 31}});
        }
    }

    const onMouseDownSvgHandler = function (event: any) {
        let svg: HTMLElement = svgRef.current!;
        toggleIsOnSvgClick(true);
        svg.addEventListener('mouseup', onMouseUpSvgHandler);
    }

    const onMouseUpSvgHandler = function (event: any) {
        // let upClientX = event.clientX;
        // let upClientY = event.clientY;
        console.log('cut calling');
        toggleIsOnSvgClick(false);
        dispatch(cut, {});
    }

    useEffect(() => { //функция запутится после рендеринга
        const canv: HTMLCanvasElement = canvasRef.current!;
        const svg: HTMLElement = svgRef.current!;
        var context = canv.getContext('2d') as CanvasRenderingContext2D;
        context.putImageData(editProps.editor.canvas, 0, 0, 0, 0, editProps.editor.canvas.width, editProps.editor.canvas.height);
        document.addEventListener('mousedown', onMouseDownHandler);
        svg.addEventListener('mouseup', onMouseUpSvgHandler);
        return () => {
            document.removeEventListener('mouseup', onMouseUpHandler);
            document.removeEventListener('mousedown', onMouseDownHandler);
            svg.removeEventListener('mouseup', onMouseUpSvgHandler);
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
                
                <svg ref={svgRef} style={{
                    position: 'absolute',
                    display: `${editProps.editor.selectedObject ? 'block' : 'none'}`,
                    top: `${editProps.editor.selectedObject?.position.y! + 31 ?? 0}`,
                    left: `${editProps.editor.selectedObject?.position.x ?? 0}`,
                    width: `${editProps.editor.selectedObject?.w! - 1 ?? 0}`,
                    height: `${editProps.editor.selectedObject?.h! - 1 ?? 0}`,
                    border: '1px dashed black',
                  }}
                ></svg>
                
                <Video editor={editProps.editor} reference={canvasRef}/>
            </div>
        </div>
    )
}

export default EditorComponent;