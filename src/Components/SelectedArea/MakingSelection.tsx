import React, { useState, useRef, useEffect, useContext}  from 'react';
import {Editor} from '../../model';
import {dispatch, editor} from '../../reducer';
import {selectArea, deSelectArea, cut, addImage, isSelectedArea, joinSelectionWithCanvas} from '../../actions';
import transform from './CoordinateTransformer';
import {CanvasContext} from '../EditorComponent/EditorComponent';
import { resolve, intention, Intent } from '../../intentResolver';

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
        resolve(editor, {x: event.clientX, y: event.clientY}, canvasCoords);
        console.log('SVG onMouseDownSVGHandler');
        //if (editor.selectedObject !== null) return;
        if (intention !== Intent.Selecting) return;
        setMouseState({
            ...mouseState,
            down: {
                x: event.clientX,
                y: event.clientY,
            },
            isMousePressed: true,
            current: {
                x: event.clientX,
                y: event.clientY,
            },
        })
    }
    
    const onMouseMoveSVGHandler = function (event: any) {
        //рисуем выбор выделенной области
        //if (event.defaultPrevented) return;
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
        if (!mouseState.isMousePressed) return;
        const canvasCoords = canvas!.getBoundingClientRect();
  
        //if (editor.selectedObject !== null) return;
        if (intention !== Intent.Selecting) return;
        if (event.clientY < canvasCoords.top) return;
        console.log('SVG onMouseUpSVGHandler');
    
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

    useEffect(() => {
        if (!canvas) return;
        
        const canvasCoords = canvas!.getBoundingClientRect();
        document.addEventListener('mousedown', onMouseDownSVGHandler);
        document.addEventListener('mousemove', onMouseMoveSVGHandler);
        document.addEventListener('mouseup', onMouseUpSVGHandler);
        const adjustedSVGcoords = transform(
            { x: mouseState.down.x, y: mouseState.down.y},
            { x: mouseState.current.x, y: mouseState.current.y},
            canvasCoords
        );
    
        const svg: HTMLElement = svgRef.current!;
        svg.style.display = (mouseState.isMousePressed) ? 'block' : 'none';
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