import React, { useState, useRef, useEffect, useContext }  from 'react';
import {Editor} from '../../model';
import {dispatch} from '../../reducer';
import {selectTextArea, deSelectArea, joinSelectionWithCanvas, isSelectedArea } from '../../actions';
import transform from './CoordinateTransformer';
import {CanvasContext} from '../EditorComponent/EditorComponent';
import { setIntention, intention, Intent } from '../../intentResolver';
import './SelectedObject.css';

interface TextAreaProps {
    editor: Editor,
}

const SelectingTextObject = (props: TextAreaProps) => {
    let canvas: HTMLCanvasElement | null = useContext(CanvasContext);  
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
        if (props.editor.selectedObject) return;
        const canvasCoords = canvas!.getBoundingClientRect();
        if (event.clientY < canvasCoords.top) return;
        // if (intention !== Intent.SelectingTextObj) return;
        // console.log('TEXT SELECTING onMouseDownSVGHandler');
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
        console.log('TEXT SELECTING onMouseUpSVGHandler');
        if ((event.clientX !== mouseState.down.x) && (event.clientY !== mouseState.down.y)) {
            //setIntention(Intent.WorkWithTextObj);
            const canvasCoords = canvas!.getBoundingClientRect();
            const selectionCoords = transform(
                { x: mouseState.down.x, y: mouseState.down.y },
                { x: event.clientX, y: event.clientY },
                canvasCoords
            );
            const startX = selectionCoords.startX + 2 as number;
            const startY = selectionCoords.startY + 2 as number;
            const endX = selectionCoords.endX + 2 as number;
            const endY = selectionCoords.endY + 2 as number;
            
            dispatch(selectTextArea, {startPoint: {x: startX, y: startY - canvasCoords.top}, endPoint: {x: endX, y: endY - canvasCoords.top}});
            
        }
        
        setMouseState({
            ...mouseState,
            isMousePressed: false,
        });
    }
    
    useEffect(() => {
        //setIntention(Intent.SelectingTextObj);
        if (props.editor.selectedObject && isSelectedArea(props.editor.selectedObject)) {
            dispatch(joinSelectionWithCanvas, {})
            dispatch(deSelectArea, {});
            
        }
    }, []);

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
            className="textSelection"
        />
    )
}

export default SelectingTextObject;