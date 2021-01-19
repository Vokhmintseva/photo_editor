import React, { useContext, useEffect, useRef } from 'react'
import {CanvasContext} from '../EditorComponent/EditorComponent';
import SliderType from './slyderType';
import './SelectedObject.css';

const halfSizeOfSlider: number = 3;
const borderWidth: number = 2;

interface SliderProps {
    pos: {x: number, y: number, width: number, height: number},
    changeSize: (x: number, y: number, width: number, height: number) => void,
    type: SliderType,
    showNewFigure: Boolean,
}

const adjustCoords = function (x: number, y: number, canvasCoords: DOMRect): {x: number, y: number} {

    if (x < canvasCoords.left) {
        x = canvasCoords.left;
    }
    if (x > canvasCoords.right - halfSizeOfSlider - borderWidth) {
        x = canvasCoords.right - halfSizeOfSlider - borderWidth;
    }
    if (y < canvasCoords.top) {
        y = canvasCoords.top;
    }
    if (y > canvasCoords.bottom - halfSizeOfSlider - borderWidth) {
        y = canvasCoords.bottom - halfSizeOfSlider - borderWidth;
    }
    return {x, y}
}

const getNewTextAreaParams = function(clientX: number, clientY: number, initPoints: any, canvasCoords: DOMRect, sliderType: SliderType) :
{x: number, y: number, width: number, height: number}
{
    let x: number = 0;
    let y: number = 0;
    let width: number = 0;
    let height: number = 0;
    let adjastedCoords;
    switch (sliderType) {
    case SliderType.LeftTop:
        if (clientX > initPoints.rightTop.x)
            clientX = initPoints.rightTop.x;
        if (clientY > initPoints.leftBottom.y)
            clientY = initPoints.rightTop.y;      
        adjastedCoords = adjustCoords(clientX, clientY, canvasCoords);
        x = adjastedCoords.x;
        y = adjastedCoords.y;
        width = initPoints.rightTop.x - x;
        height = initPoints.leftBottom.y - y;
        break;
    case SliderType.LeftBottom:
        if (clientX > initPoints.rightBottom.x)
            clientX = initPoints.rightBottom.x;
        if (clientY < initPoints.leftTop.y)
            clientY = initPoints.leftTop.y;      
        adjastedCoords =  adjustCoords(clientX, clientY, canvasCoords);
        x = adjastedCoords.x;
        y = initPoints.leftTop.y;
        width = initPoints.rightBottom.x - x;
        height = adjastedCoords.y - y;
        break;
    case SliderType.RightTop:
        if (clientX < initPoints.leftTop.x)
            clientX = initPoints.leftTop.x;
        if (clientY > initPoints.rightBottom.y)
            clientY = initPoints.rightBottom.y;     
        adjastedCoords =  adjustCoords(clientX, clientY, canvasCoords);
        x = initPoints.leftTop.x;
        y = adjastedCoords.y;
        width = adjastedCoords.x - x;
        height = initPoints.rightBottom.y - y;
        break;   
    case SliderType.RightBottom:
        if (clientX < initPoints.leftTop.x)
            clientX = initPoints.leftTop.x;
        if (clientY < initPoints.leftTop.y)
            clientY = initPoints.leftTop.y;  
        adjastedCoords =  adjustCoords(clientX, clientY, canvasCoords);
        x = initPoints.leftTop.x;
        y = initPoints.leftTop.y;
        width = adjastedCoords.x - x;
        height = adjastedCoords.y - y;
        break; 
    }
    return {x, y, width, height};
}

function Slider(props: SliderProps) {
    let sliderRef = useRef(null);
    let offset = useRef({x: 0, y: 0});
    let cursorStyle = useRef('');
    let canvas: HTMLCanvasElement | null = useContext(CanvasContext);

    let isMousePressed = useRef(false);

    function onMouseDownSliderHandler(event: any) {
        isMousePressed.current = true;
        event.preventDefault();
    }
        
    const onMouseMoveSliderHandler = function (event: any) {
        if (isMousePressed.current) {
            const canvasCoords = canvas!.getBoundingClientRect();
            const initPoints = {
                leftTop: {x: props.pos.x, y: props.pos.y},
                leftBottom: {x: props.pos.x, y: props.pos.y + props.pos.height},
                rightTop: {x: props.pos.x + props.pos.width, y: props.pos.y},
                rightBottom: {x: props.pos.x + props.pos.width, y: props.pos.y + props.pos.height}
            };
            const {x, y, width, height} = getNewTextAreaParams(event.clientX, event.clientY, {...initPoints}, canvasCoords, props.type);
            props.changeSize(x, y, width, height);
            event.preventDefault();
        }
    }

    const onMouseUpSliderHandler = function (event: any) {
        if (!isMousePressed.current) return;
        isMousePressed.current = false;
        event.preventDefault();
    }

    useEffect(() => { 
        switch (props.type) {
        case SliderType.LeftTop:
            offset.current = {x: -halfSizeOfSlider, y: -halfSizeOfSlider};
            cursorStyle.current = 'se-resize';
            break;
        case SliderType.LeftBottom:
            offset.current = {x: -halfSizeOfSlider, y: props.pos.height};
            cursorStyle.current = 'ne-resize';
            break;
        case SliderType.RightTop:
            offset.current = {x: props.pos.width, y: -halfSizeOfSlider};
            cursorStyle.current = 'sw-resize';
            break;   
        case SliderType.RightBottom:
            offset.current = {x: props.pos.width, y: props.pos.height};
            cursorStyle.current = 'nw-resize';
            break;     
        }
        if (props.showNewFigure) {
            switch (props.type) {
                case SliderType.LeftTop:
                    offset.current = {x: -halfSizeOfSlider, y: -halfSizeOfSlider};
                    break;
                case SliderType.LeftBottom:
                    offset.current = {x: -halfSizeOfSlider, y: 100};
                    break;
                case SliderType.RightTop:
                    offset.current = {x: 100, y: -halfSizeOfSlider};
                    break;   
                case SliderType.RightBottom:
                    offset.current = {x: 100, y: 100};
                    break;     
            }
            
        }   
        const sliderElem: HTMLCanvasElement = sliderRef.current!;
        sliderElem.addEventListener('mousedown', onMouseDownSliderHandler);
        document.addEventListener('mousemove', onMouseMoveSliderHandler);
        document.addEventListener('mouseup', onMouseUpSliderHandler);
        
        return () => {
            sliderElem.removeEventListener('mousedown', onMouseDownSliderHandler);
            document.removeEventListener('mousemove', onMouseMoveSliderHandler);
            document.removeEventListener('mouseup', onMouseUpSliderHandler);
        };
    });  
   
    return (
        <div 
            ref={sliderRef}
            className='slider'
            style={{
                left: `${props.pos.x + offset.current.x}px`,
                top: `${props.pos.y + offset.current.y}px`,
                cursor: `${cursorStyle.current}`
            }} 
        >
        </div>
    )
}

export default Slider;