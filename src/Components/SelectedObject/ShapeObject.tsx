import React, { useRef, useEffect, useState, useContext }  from 'react';
import { Editor, Figure } from '../../model';
import './SelectedObject.css';
import { dispatch } from '../../reducer';
import { setFigureBorderColor, setFigureBackgroundColor, resizeEditorObj, dropShapeObj } from '../../actions';
import { CanvasContext } from '../EditorComponent/EditorComponent';
import Slider from './Slider';
import SliderType from './slyderType';

interface ShapeObjProps {
    editor: Editor,
    figure: Figure,
    showShapeObjHundler: () => void,
}

const adjustCoords = function (left: number, top: number, textAreaCoords: DOMRect, canvasCoords: DOMRect): {left: number, top: number} {
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

function calculateInitPos(editor: Editor, canvasCoords: DOMRect) {
    return {
        x: editor.selectedObject!.position.x,
        y: editor.selectedObject!.position.y + canvasCoords.top,
        width: editor.selectedObject!.w,
        height: editor.selectedObject!.h
    }
}

function drawFigure(figure: Figure, context: CanvasRenderingContext2D, position: any) {
    switch (figure.toString()) {
    
    case 'circle':
        context.beginPath();
        context.ellipse(position.width / 2, position.height / 2, position.width / 2, position.height / 2 , 0, 0, Math.PI*2);
        context.stroke();
        break;
    case 'triangle':
        context.beginPath();
        context.moveTo(0, position.height);
        context.lineTo(position.width, position.height);
        context.lineTo(position.width / 2, 0);
        context.closePath();
        context.stroke();
        break;  
    case 'rectangle':
        context.beginPath();
        context.moveTo(0, position.height);
        context.lineTo(position.width, position.height);
        context.lineTo(position.width, 0);
        context.lineTo(0, 0);
        context.closePath();
        context.stroke();
        break;
    }
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

    function onApplyShapeSelectionHandler(event: any) {

    }

    function onChangeBorderColorHandler(event: React.ChangeEvent<HTMLInputElement>) {
        dispatch(setFigureBorderColor, {newColor: event.target.value});
    }

    function onChangeBackgroundColorHandler(event: React.ChangeEvent<HTMLInputElement>) {
        dispatch(setFigureBackgroundColor, {newColor: event.target.value});
    }
 
    function onMouseDownShapeObjHandler(event: any) {
        if (event.defaultPrevented) return;
        console.log('SHAPE in onMouseDownTextObjHandler function');
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
        const canvasElem: HTMLCanvasElement = canvasRef.current!;
        const context = canvasElem.getContext("2d")!;
        canvasElem.setAttribute('width', props.editor.selectedObject!.w.toString());
        canvasElem.setAttribute('height', props.editor.selectedObject!.h.toString());
        drawFigure(props.figure, context, {...position});
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
                        onClick={props.showShapeObjHundler}
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
            />  
            <Slider
                pos={position}
                changeSize={onChangeSize}
                type={SliderType.RightTop}
            />  
            <Slider
                pos={position}
                changeSize={onChangeSize}
                type={SliderType.LeftBottom}
            />  
            <Slider
                pos={position}
                changeSize={onChangeSize}
                type={SliderType.RightBottom}
            />       
        </div>
    ) 
}

export default ShapeObject;