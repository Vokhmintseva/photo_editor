import React, { useRef, useEffect}  from 'react';
import {Editor} from '../../model';
import './Canvas.css';
import {dispatch} from '../../reducer';
import {selectArea, deSelectArea, cut} from '../../actions';



interface CanvasProps {
    editor: Editor,
    setCanv: (ref: any) => void;
}

function useMakeSelection(canvasRef: any, selRef: any, editor: Editor) {
    let isMousePressed = false;
    let mouseDownCoords = {x: 0, y: 0};

    function onMouseDownHandler(event: any) {
        const canvasCoord = canvasRef.current!.getBoundingClientRect();
        if (event.clientY < canvasCoord.top) {
            return;
        }
        if (event.defaultPrevented) {
            return;
        }
        if (editor.selectedObject) {
            dispatch(deSelectArea, {});
        }
        console.log('in onMouseDownHandler function');
        document.addEventListener('mousemove', onMouseMoveHandler);
        document.addEventListener('mouseup', onMouseUpHandler);
        isMousePressed = true;
        mouseDownCoords = {x: event.clientX, y: event.clientY};
    }
    
    const onMouseMoveHandler = function (event: any) {
        
        //рисуем выбор выделенной области
        if (event.defaultPrevented) {
            return;
        }
        if (isMousePressed) {
            const selection: HTMLDivElement = selRef.current!;
            const selectionCoords = getSelectionParams({x: mouseDownCoords.x, y: mouseDownCoords.y}, {x: event.clientX, y: event.clientY});
            if (selectionCoords.width && selectionCoords.height) {
                selection.style.display = 'block';
                selection.style.left = selectionCoords.startX.toString();
                selection.style.top = selectionCoords.startY.toString();
                selection.style.width = selectionCoords.width.toString();
                selection.style.height = selectionCoords.height.toString();
            }
        }
    }

    function getSelectionParams (start: {x: number, y: number}, end: {x: number, y: number}) {
        const canv: HTMLCanvasElement = canvasRef.current!;
        const canvasCoord = canv.getBoundingClientRect();
        let startX = Math.min(start.x, end.x, canvasCoord.width);
        let startY = Math.max(canvasCoord.y, Math.min(canvasCoord.y + canvasCoord.height, end.y, start.y));
        let endX = Math.min(Math.max(end.x, start.x), canvasCoord.width);
        let endY = Math.min(startY + Math.abs(end.y - start.y), canvasCoord.y + canvasCoord.height);
        return ({
            startX: startX,
            startY: startY,
            endX: endX,
            endY: endY,
            width: endX - startX,
            height: endY - startY,
        })
    }

    const onMouseUpHandler = function (event: any) {
        const canvasCoords = canvasRef.current!.getBoundingClientRect();
        if (event.clientY < canvasCoords.top) {
            return;
        }
        if (event.defaultPrevented) {
            return;
        }
        console.log('in onMouseUpHandler function');
        isMousePressed = false;
        const selection: HTMLDivElement = selRef.current!;
        selection.style.display = 'none';

        //делаем выделение
        if ((event.clientX !== mouseDownCoords.x) && (event.clientY !== mouseDownCoords.y)) {
            console.log('creating selected area');
            const selectionCoords = getSelectionParams({x: mouseDownCoords.x, y: mouseDownCoords.y}, {x: event.clientX, y: event.clientY});
            const startX = selectionCoords.startX + 2 as number;
            const startY = selectionCoords.startY + 2 as number;
            const endX = selectionCoords.endX + 2 as number;
            const endY = selectionCoords.endY + 2 as number;
            dispatch(selectArea, {startPoint: {x: startX, y: startY - canvasCoords.top}, endPoint: {x: endX, y: endY - canvasCoords.top}});
            
        }
        document.removeEventListener('mousemove', onMouseMoveHandler);
        document.removeEventListener('mouseup', onMouseUpHandler);
    }

    useEffect(() => { //функция запутится после рендеринга
        
        document.addEventListener('mousedown', onMouseDownHandler);
        //функция сработает когда произойдет следующая перерисовка
        return () => {
            document.removeEventListener('mousedown', onMouseDownHandler);
        };
    });
}
    
const Canvas = (props: CanvasProps) => {
    console.log('rendering Canvas');
    let canvasRef = useRef(null);
    let selRef = useRef(null);
    
    useMakeSelection(canvasRef, selRef, props.editor);
          
    useEffect(() => { //функция запутится после рендеринга
        const canv: HTMLCanvasElement = canvasRef.current!;
        props.setCanv(canvasRef);
        let context = canv.getContext('2d') as CanvasRenderingContext2D;
        context.putImageData(props.editor.canvas, 0, 0, 0, 0, props.editor.canvas.width, props.editor.canvas.height);
        
    }); 

    return (
        <div>

            <canvas 
                ref={canvasRef}    
                width={props.editor.canvas.width}
                height={props.editor.canvas.height}
                className="canvas"
            />

            <svg 
                ref={selRef} 
                className="selection"
            />

        </div>
    )
}

export default Canvas;