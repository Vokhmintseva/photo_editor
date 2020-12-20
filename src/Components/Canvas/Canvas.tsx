import React, { useState, useRef, useEffect}  from 'react';
import {Editor} from '../../model';
import './Canvas.css';
import {dispatch} from '../../reducer';
import {selectArea, deSelectArea, cut, addImage, isSelectedArea, joinSelectionWithCanvas} from '../../actions';
import transform from '../SelectedArea/CoordinateTransformer';
import MakingSelection from '../SelectedArea/MakingSelection';

interface CanvasProps {
    editor: Editor,
    setCanv: (ref: any) => void;
}

function useMakeSelection(canvasRef: any, selRef: any, editor: Editor) {
    const [mouseState, setMouseState] = useState({
        down: {
            x: 0,
            y: 0,
        },
        isMousePressed: false,
        current: {
            x: 0,
            y: 0,
        }, 
    });    

    function onMouseDownHandler(event: any) {
        const canvasCoord = canvasRef.current!.getBoundingClientRect();
        if (event.clientY < canvasCoord.top || event.defaultPrevented) return;

        setMouseState({
            ...mouseState,
            down: {
                x: event.clientX,
                y: event.clientY,
            },
            isMousePressed: true,
        })
    }
    
    const onMouseMoveHandler = function (event: any) {
        //рисуем выбор выделенной области
        if (mouseState.isMousePressed) {
            setMouseState({
                ...mouseState,
                current: {
                    x: event.clientX,
                    y: event.clientY,
                },
            });
        }
    }

    const onMouseUpHandler = function (event: any) {
        const canvasCoords = canvasRef.current!.getBoundingClientRect();
        if (event.clientY < canvasCoords.top || event.defaultPrevented) return;
        
        const selection: HTMLDivElement = selRef.current!;
        selection.style.display = 'none';

        //делаем выделение
        if ((event.clientX !== mouseState.down.x) && (event.clientY !== mouseState.down.y)) {
            //console.log('creating selected area');
            const selectionCoords = transform(
                { x: mouseState.down.x, y: mouseState.down.y },
                { x: event.clientX, y: event.clientY },
                canvasCoords
            );
            const startX = selectionCoords.startX + 2 as number;
            const startY = selectionCoords.startY + 2 as number;
            const endX = selectionCoords.endX + 2 as number;
            const endY = selectionCoords.endY + 2 as number;
            dispatch(selectArea, {startPoint: {x: startX, y: startY - canvasCoords.top}, endPoint: {x: endX, y: endY - canvasCoords.top}});
        }

        setMouseState({
            ...mouseState,
            isMousePressed: false,
        });
    }

    useEffect(() => { //функция запутится после рендеринга
        
        document.addEventListener('mousedown', onMouseDownHandler);
        document.addEventListener('mousemove', onMouseMoveHandler);
        document.addEventListener('mouseup', onMouseUpHandler);

        // установим выделение
        const canv: HTMLCanvasElement = canvasRef.current!;
        const rect = canv.getBoundingClientRect();
        const rectReact = transform({x: mouseState.down.x, y: mouseState.down.y}, { x: mouseState.current.x, y: mouseState.current.y}, rect);

        const svg: HTMLElement = selRef.current!;
        svg.style.top = rectReact.startY.toString() + 'px';
        svg.style.left = rectReact.startX.toString() + 'px';
        svg.setAttribute('width', rectReact.width.toString());
        svg.setAttribute('height', rectReact.height.toString());

        //функция сработает когда произойдет следующая перерисовка
        return () => {
            document.removeEventListener('mousedown', onMouseDownHandler);
            document.removeEventListener('mousemove', onMouseMoveHandler);
            document.removeEventListener('mouseup', onMouseMoveHandler);
        };
    });
}
    
const Canvas = (props: CanvasProps) => {
    console.log('rendering Canvas');
    
    let canvasRef = useRef(null);

    //useMakeSelection(canvasRef, selRef, props.editor);
          
    useEffect(() => { //функция запутится после рендеринга
        const canvas: HTMLCanvasElement = canvasRef.current!;
        let context = canvas.getContext('2d') as CanvasRenderingContext2D;
        context.putImageData(props.editor.canvas, 0, 0, 0, 0, props.editor.canvas.width, props.editor.canvas.height);
        props.setCanv(canvasRef);
    }); 

    return (
        <div>
            <canvas 
                ref={canvasRef}    
                width={props.editor.canvas.width}
                height={props.editor.canvas.height}
                className="canvas"
            />

            <MakingSelection 
                editor={props.editor}                
            />

        </div>
    )
}

export default Canvas;