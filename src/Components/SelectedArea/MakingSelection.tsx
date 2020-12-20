import React, { useState, useRef, useEffect, useContext}  from 'react';
import {Editor} from '../../model';
import {dispatch, editor} from '../../reducer';
import {selectArea, deSelectArea, cut, addImage, isSelectedArea, joinSelectionWithCanvas} from '../../actions';
import transform from './CoordinateTransformer';
import {CanvasContext} from '../EditorComponent/EditorComponent';

interface MakingSelectionProps {
    editor: Editor,
}

const MakingSelection = (props: MakingSelectionProps) => {
       
    let svgRef = useRef(null);
    
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
        
    function onMouseDownSVGHandler(event: any) {
                
        const canvasCoords = canvas!.getBoundingClientRect();
        if (event.clientY < canvasCoords.top || event.defaultPrevented) return;
        console.log('SVG onMouseDownSVGHandler');
        //if (editor.selectedObject !== null) return;
    
        setMouseState({
            ...mouseState,
            down: {
                x: event.clientX,
                y: event.clientY,
            },
            isMousePressed: true,
        })
    }
    
    const onMouseMoveSVGHandler = function (event: any) {
        //рисуем выбор выделенной области
        if (event.defaultPrevented) return;
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
    
    const onMouseUpSVGHandler = function (event: any) {
        //const canvasCoords = canvas!.getBoundingClientRect();
        
        const canvasCoords = canvas!.getBoundingClientRect();
        if (event.clientY < canvasCoords.top || event.defaultPrevented) return;
        console.log('SVG onMouseUpSVGHandler');
        const selection: HTMLDivElement = svgRef.current!;
        selection.style.display = 'none';

    
        //делаем выделение
        if ((event.clientX !== mouseState.down.x) && (event.clientY !== mouseState.down.y)) {
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
    
    let canvas: HTMLCanvasElement | null = useContext(CanvasContext);
    //let canvas: HTMLCanvasElement = useContext(CanvasContext)!;

    useEffect(() => { //функция запутится после рендеринга
        
        
        //const canv: HTMLCanvasElement = canvas!;
        if (!canvas) return;
        
        const canvasCoords = canvas!.getBoundingClientRect();
        document.addEventListener('mousedown', onMouseDownSVGHandler);
        document.addEventListener('mousemove', onMouseMoveSVGHandler);
        document.addEventListener('mouseup', onMouseUpSVGHandler);
        //if(mouseState.down.x == -1 && mouseState.down.y == -1) return;
        //const rect = canvas.getBoundingClientRect();
        const adjustedSVGcoords = transform(
            { x: mouseState.down.x, y: mouseState.down.y},
            { x: mouseState.current.x, y: mouseState.current.y},
            canvasCoords
        );
    
        const svg: HTMLElement = svgRef.current!;
        svg.style.display = 'block';
        svg.style.top = adjustedSVGcoords.startY.toString();
        svg.style.left = adjustedSVGcoords.startX.toString();
        svg.setAttribute('width', adjustedSVGcoords.width.toString());
        svg.setAttribute('height', adjustedSVGcoords.height.toString());
    
        //функция сработает когда произойдет следующая перерисовка
        return () => {
            
            document.removeEventListener('mousedown', onMouseDownSVGHandler);
            document.removeEventListener('mousemove', onMouseMoveSVGHandler);
            document.removeEventListener('mouseup', onMouseUpSVGHandler);
        };
    });

    return (
        <svg
            ref={svgRef}
            className="selection"
        />
    )
}

export default MakingSelection;