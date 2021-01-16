import React, { useRef, useEffect, useState, useContext }  from 'react';
import { Editor, Figure, Point } from '../../model';
import './SelectedObject.css';
import { dispatch } from '../../reducer';
import { setFigureBorderColor, setFigureBackgroundColor, resizeEditorObj, dropShapeObj, isShapeObject, addImage, deSelectArea, addFigure } from '../../actions';
import { CanvasContext } from '../EditorComponent/EditorComponent';
import Slider from './Slider';
import SliderType from './slyderType';

const borderWidth = 2;
const strokeWidth = 2;

interface ShapeObjProps {
    editor: Editor,
    figure: Figure,
    onShowFigureClickHandler: (event: any) => void,
    shouldResetFigure: boolean,
    onShouldResetFigureHandler: (should: boolean) => void,
    onCancelFigureClickHandler: () => void,
}
const adjustCoords = function (left: number, top: number, textAreaCoords: DOMRect, canvasCoords: DOMRect): {left: number, top: number} {
    if (left < canvasCoords.left) {
        left = canvasCoords.left;
    }
    if (left + textAreaCoords.width > canvasCoords.right + borderWidth * 2 - strokeWidth) { 
        left = canvasCoords.right - textAreaCoords.width + borderWidth * 2 - strokeWidth;
    }
    if (top < canvasCoords.top) {
        top = canvasCoords.top;
    }
    if (top + textAreaCoords.height > canvasCoords.bottom + borderWidth * 2 - strokeWidth * 2) {
        top = Math.max(canvasCoords.bottom - textAreaCoords.height + borderWidth * 2 - strokeWidth * 2, canvasCoords.top);
    }
    return {left, top}
}

function calculateInitPos(editor: Editor, canvasCoords: DOMRect) {
    return {
        x: editor.selectedObject!.position.x,
        y: editor.selectedObject!.position.y + canvasCoords.top,
        width: editor.selectedObject!.w,
        height: editor.selectedObject!.h
    }
}

function drawFigure(figure: Figure,
                    context: CanvasRenderingContext2D,
                    position: any,
                    borderColor: string,
                    backgroundColor: string,
                    start: Point
                ){
    context.beginPath();
    context.lineWidth = strokeWidth;
    context.fillStyle = backgroundColor;
    context.strokeStyle = borderColor;
    switch (figure.toString()) {
    case 'circle':
        context.ellipse(position.width / 2 + start.x, position.height / 2 + start.y, position.width / 2, position.height / 2 , 0, 0, Math.PI*2);
        break;
    case 'triangle':

        context.moveTo(start.x, start.y + position.height);
        context.lineTo(start.x + position.width, start.y + position.height);
        context.lineTo(start.x + position.width / 2, start.y);
        break;  
    case 'rectangle':
        context.moveTo(start.x, start.y + position.height);
        context.lineTo(start.x + position.width, start.y + position.height);
        context.lineTo(start.x + position.width, start.y);
        context.lineTo(start.x, start.y);
        break;
    }
    context.closePath();
    context.stroke();
    context.fill();
}

const ShapeObject = (props: ShapeObjProps) => {
    let canvas: HTMLCanvasElement | null = useContext(CanvasContext);
    const canvasCoords = canvas!.getBoundingClientRect();
    const [isMousePressed, setIsMousePressed] = useState(false);
    const [offset, setOffset] = useState({x: 0, y: 0});
    const [position, setPosition] = useState(() => calculateInitPos(props.editor, canvasCoords));
        
    let canvasRef = useRef(null);
  
    function onChangeSize(x: number, y: number, width: number, height: number) {
        const canvasCoords = canvas!.getBoundingClientRect();
        setPosition({x, y, width, height});
        dispatch(resizeEditorObj, {newPoint: {x: x, y: y - canvasCoords.top}, newWidth: width, newHeight: height});
    }

    function resetFigureCoords() {
        const canvasCoords = canvas!.getBoundingClientRect();
        setPosition({
            x: props.editor.canvas.width / 2 - 50,
            y: props.editor.canvas.height / 2 - 50 + canvasCoords.top,
            width: 100,
            height: 100});
    }

    function onApplyShapeSelectionHandler(event: any) {
        const context = canvas!.getContext("2d")!;
        const canvasCoords = canvas!.getBoundingClientRect();

        if (isShapeObject(props.editor.selectedObject)) {
            drawFigure(props.figure, context, position, props.editor.selectedObject.borderColor, props.editor.selectedObject.backgroundColor, {x: position.x + strokeWidth / 2, y: position.y - canvasCoords.top + strokeWidth});
            let newImgData = context!.getImageData(0, 0, canvas!.width, canvas!.height);
            dispatch(addImage, {newImage: newImgData});
            dispatch(deSelectArea, {});
            props.onCancelFigureClickHandler();
        }
    }

    function onChangeBorderColorHandler(event: React.ChangeEvent<HTMLInputElement>) {
        dispatch(setFigureBorderColor, {newColor: event.target.value});
    }

    function onChangeBackgroundColorHandler(event: React.ChangeEvent<HTMLInputElement>) {
        dispatch(setFigureBackgroundColor, {newColor: event.target.value});
    }
 
    function onMouseDownShapeObjHandler(event: any) {
        //const canvasElem: HTMLTextAreaElement = canvasRef.current!;
        if (event.defaultPrevented) return;
        setOffset({x: event.clientX - position.x!, y: event.clientY - position.y!});
        setIsMousePressed(true);
    }
        
    const onMouseMoveShapeObjHandler = function (event: any) {
        if (event.defaultPrevented) return;
        if (isMousePressed) {
            const canvasElem: HTMLTextAreaElement = canvasRef.current!;
            const selCanvasCoords = canvasElem.getBoundingClientRect();
            const canvasCoords = canvas!.getBoundingClientRect();
            const adjustedCoords = adjustCoords(event.clientX - offset.x, event.clientY - offset.y, selCanvasCoords, canvasCoords);
            setPosition({x: adjustedCoords.left, y: adjustedCoords.top, width: position.width, height: position.height});
        }
    }

    const onMouseUpShapeObjHandler = function (event: any) {
        if (event.defaultPrevented) return;
        if (!isMousePressed) return;
        const canvasCoords = canvas!.getBoundingClientRect();
        const selCanvasElem: HTMLCanvasElement = canvasRef.current!;
        const selCanvasCoords = selCanvasElem.getBoundingClientRect();
        const adjustedCoords = adjustCoords(event.clientX - offset.x, event.clientY - offset.y, selCanvasCoords, canvasCoords);
        setPosition({x: adjustedCoords.left, y: adjustedCoords.top, width: position.width, height: position.height});
        dispatch(dropShapeObj, {where: {x: adjustedCoords.left, y: adjustedCoords.top - canvasCoords.top}});
        setIsMousePressed(false);
    }

    useEffect(() => { 
        if (props.shouldResetFigure) {
            resetFigureCoords();
            props.onShouldResetFigureHandler(false);
        }    
        const canvasElem: HTMLCanvasElement = canvasRef.current!;
        const context = canvasElem.getContext("2d")!;
        canvasElem.setAttribute('width', props.editor.selectedObject!.w.toString());
        canvasElem.setAttribute('height', props.editor.selectedObject!.h.toString());
        if (isShapeObject(props.editor.selectedObject)) {
            drawFigure(props.figure, context, {...position}, props.editor.selectedObject.borderColor, props.editor.selectedObject.backgroundColor, {x: 0, y: 0});
        }
        canvasElem.addEventListener('mousedown', onMouseDownShapeObjHandler);
        document.addEventListener('mousemove', onMouseMoveShapeObjHandler);
        document.addEventListener('mouseup', onMouseUpShapeObjHandler);
        return () => {
            canvasElem.removeEventListener('mousedown', onMouseDownShapeObjHandler);
            document.removeEventListener('mousemove', onMouseMoveShapeObjHandler);
            document.removeEventListener('mouseup', onMouseUpShapeObjHandler);
        };
    });  

    useEffect(() => { 
        const canvasCoords: DOMRect = canvas!.getBoundingClientRect();
        setPosition({
            x: props.editor.selectedObject!.position.x,
            y: props.editor.selectedObject!.position.y + canvasCoords.top,
            width: props.editor.selectedObject!.w,
            height: props.editor.selectedObject!.h,
        });
    }, []);
 
    return (
        <div>
            <div className="shapeBar">
                <div>
                    <label>Граница</label>
                    <input
                        type='color'
                        onChange={onChangeBorderColorHandler}
                    ></input>
                </div>
                <div>
                    <label>Фон</label>
                    <input
                        type='color'
                        onChange={onChangeBackgroundColorHandler}
                    ></input>
                </div>
                <div>
                    <button 
                        className="applyBtn"
                        onClick={onApplyShapeSelectionHandler}
                        title="Добавить текст"
                    >    
                    </button>
                    <button 
                        className="abolishBtn"
                        onClick={props.onCancelFigureClickHandler}
                        title="Отмена"></button>
                </div>
            </div>    

            <canvas 
                className="shapeObjcanvasSel"
                ref={canvasRef}
                style={{
                    top: `${position.y}px`,
                    left: `${position.x}px`,
                    width: `${position.width}px`,
                    height: `${position.height}px`
                }}

            ></canvas>
            
            <Slider
                pos={position}
                changeSize={onChangeSize}
                type={SliderType.LeftTop}
                resetFigure={props.shouldResetFigure}
            />  
            <Slider
                pos={position}
                changeSize={onChangeSize}
                type={SliderType.RightTop}
                resetFigure={props.shouldResetFigure}
            />
            <Slider
                pos={position}
                changeSize={onChangeSize}
                type={SliderType.LeftBottom}
                resetFigure={props.shouldResetFigure}
            />  
            <Slider
                pos={position}
                changeSize={onChangeSize}
                type={SliderType.RightBottom}
                resetFigure={props.shouldResetFigure}
            /> 
        </div>
    ) 
}

export default ShapeObject;