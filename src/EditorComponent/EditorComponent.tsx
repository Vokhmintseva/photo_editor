import React, { useRef, useEffect, useState } from 'react'
import {Editor} from '../model'
import Toolbar from '../Toolbar/Toolbar';
import { dispatch, getEditor } from '../reducer';
import {selectArea} from '../actions';
import Video from '../UI/Video';

interface EditorComponentProps {
    editor: Editor
}

function EditorComponent(editProps: EditorComponentProps) {
    console.log('rendering editor component');
    const [mouseDownCoordinates, setMouseDownCoordinates] = useState({x: 0, y: 0});
    const [mouseUpCoordinates, setMouseUpCoordinates] = useState({x: 0, y: 0});
    const [selectionParams, setSelectionParams] = useState({x: 0, y: 0, width: 0, height: 0})

    let canvasRef = useRef(null);
    

    useEffect(() => { //функция запутится после рендеринга
        const canv: HTMLCanvasElement = canvasRef.current!;
        var context = canv.getContext('2d') as CanvasRenderingContext2D;
        context.putImageData(editProps.editor.canvas, 0, 0, 0, 0, editProps.editor.canvas.width, editProps.editor.canvas.height);
    });   
     
    function onMouseUpHandler(event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
        setMouseUpCoordinates({x: event.clientX, y: event.clientY});
        if ((mouseUpCoordinates.x !== mouseDownCoordinates.x) && (mouseUpCoordinates.y !== mouseDownCoordinates.y)) {
            let startX = Math.min(mouseUpCoordinates.x, mouseDownCoordinates.x);
            let startY = Math.min(mouseUpCoordinates.y, mouseDownCoordinates.y);
            let width = Math.abs(mouseUpCoordinates.x - mouseDownCoordinates.x);
            let height = Math.abs(mouseUpCoordinates.y - mouseDownCoordinates.y);
            setSelectionParams({x: startX, y: startY, width: width, height: height});
            dispatch(selectArea, {startPoint: mouseDownCoordinates, endPoint: mouseUpCoordinates});     
        }
    }

    return (
        <div>
            <Toolbar editor={editProps.editor} reference={canvasRef}/>
            <div style={{position: 'relative'}}>
                <canvas 
                    style={{position: 'absolute'}}
                    ref={canvasRef} //React установит .current на этот DOM-узел
                    width={editProps.editor.canvas.width}
                    height={editProps.editor.canvas.height}
                    onMouseDown={(e) => setMouseDownCoordinates({x: e.clientX, y: e.clientY})}
                    onMouseUp={onMouseUpHandler}

                />
                
                <div style={{
                        position: 'absolute',
                        border: '4px dashed black',
                        top: `${selectionParams.x}`,
                        left: `${selectionParams.y}`,
                        width: `${selectionParams.width}`,
                        height: `${selectionParams.height}`,
                     }}
                ></div>
                
                <Video editor={editProps.editor} reference={canvasRef}/>
                     
            </div>
        </div>
    )
}

export default EditorComponent;