import React, { useState, useContext, useEffect, useRef } from 'react'
import {Editor} from '../../model'
import SelectFilter from '../Select/SelectFilter';
import OpenButton from '../Buttons/OpenButton';
import SaveButton from '../Buttons/SaveButton';
import SnapshotButton from '../Buttons/SnapshotButton';
import {applyFilter, cut, crop, createCanvas, deSelectArea} from '../../actions';
import { dispatch } from '../../reducer';
import {CanvasContext} from '../EditorComponent/EditorComponent';
import { setIntention, intention, Intent } from '../../intentResolver';
import SliderType from './slyderType';
import './SelectedObject.css';

interface SliderProps {
    pos: {x: number, y: number, width: number, height: number},
    changeSize: (x: number, y: number, width: number, height: number) => void,
    type: SliderType
}

function Slider(props: SliderProps) {
    let sliderRef = useRef(null);
    let offset = useRef({x: 0, y: 0});
    let cursorStyle = useRef('');
    //const [position, setPosition] = useState({x: props.pos.x, y: props.pos.y});
    let canvas: HTMLCanvasElement | null = useContext(CanvasContext);
    const borderWidth: number = 2;
    const halfSizeOfSlider: number = 3;

    function onMouseDownSliderHandler(event: any) {
        // const canvasCoords = canvas!.getBoundingClientRect();
        // resolve(props.editor, {x: event.clientX, y: event.clientY}, canvasCoords);
        // if (intention !== Intent.DraggingTextObj) return;
        // console.log('TEXT in onMouseDownTextObjHandler function');
        // setOffset({x: event.clientX - position.x!, y: event.clientY - position.y!});
        // setIsMousePressed(true);
    }
        
    const adjustCoords = function (left: number, top: number): {left: number, top: number} {
        const sliderElem: HTMLTextAreaElement = sliderRef.current!;
        const textAreaCoords = sliderElem.getBoundingClientRect();
        const canvasCoords = canvas!.getBoundingClientRect();
        if (left < canvasCoords.left) {
            left = canvasCoords.left;
        }
        if (left + textAreaCoords.width > canvasCoords.right) {
            left = canvasCoords.right - textAreaCoords.width;
        }
        if (top < canvasCoords.top) {
            top = canvasCoords.top;
        }
        if (top + textAreaCoords.height > canvasCoords.bottom) {
            top = Math.max(canvasCoords.bottom - textAreaCoords.height, canvasCoords.top);
        }
        return {left, top}
    }
    
    const onMouseMoveSliderHandler = function (event: any) {
        // if (isMousePressed) {
        //     const adjustedCoords = adjustCoords(event.clientX - offset.x, event.clientY - offset.y)
        //     setPosition({x: adjustedCoords.left, y: adjustedCoords.top, width: position.width, height: position.height});
        // }
    }

    const onMouseUpSliderHandler = function (event: any) {
        // if (!isMousePressed) return;
        // console.log('TEXT in onMouseUpTextObjHandler function');
        // const canvasCoords = canvas!.getBoundingClientRect();
        // const adjustedCoords = adjustCoords(event.clientX - offset.x, event.clientY - offset.y);
        // setPosition({x: adjustedCoords.left, y: adjustedCoords.top, width: position.width, height: position.height});
        // dispatch(dropTextObj, {where: {x: adjustedCoords.left, y: adjustedCoords.top - canvasCoords.top}});
        // setIsMousePressed(false);
    }

    useEffect(() => { 
        //const canvasCoords = canvas!.getBoundingClientRect();
        console.log(intention);
        switch (props.type) {
        case SliderType.LeftTop:
            offset.current = {x: -halfSizeOfSlider, y: -halfSizeOfSlider};
            cursorStyle.current = 'se-resize';
            break;
        case SliderType.LeftBottom:
            offset.current = {x: -3, y: props.pos.height + halfSizeOfSlider};
            cursorStyle.current = 'ne-resize';
            break;
        case SliderType.RightTop:
            offset.current = {x: props.pos.width - borderWidth + halfSizeOfSlider, y: -halfSizeOfSlider};
            cursorStyle.current = 'sw-resize';
            break;   
        case SliderType.RightBottom:
            offset.current = {x: props.pos.width - borderWidth + halfSizeOfSlider, y: props.pos.height - borderWidth + halfSizeOfSlider};
            cursorStyle.current = 'nw-resize';
            break;     
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

    // useEffect(() => { 
    //     const canvasCoords = canvas!.getBoundingClientRect();
    //     setPosition({
    //         x: props.pos.x,
    //         y: props.pos.y,
    //     });
    // }, []);
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