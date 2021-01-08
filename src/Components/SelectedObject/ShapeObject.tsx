import React, { useRef, useEffect, useState, useContext }  from 'react';
import { Editor, Figure } from '../../model';
import './SelectedObject.css';
import { dispatch } from '../../reducer';
import { dropTextObj, isTextObject, addImage, deSelectArea } from '../../actions';
import { CanvasContext } from '../EditorComponent/EditorComponent';
import { resolve, intention, Intent } from '../../intentResolver';

interface ShapeObjProps {
    editor: Editor,
}

const ShapeObject = (props: ShapeObjProps) => {
    let svgRef = useRef(null);
    const [figureType, setFigureType] = useState(Figure.circle);
    const [figureSelected, setFigureSelected] = useState(false);
    function onShapeObjClickHandler(event: any) {
        const figure: Figure = event.target.id
        setFigureType(figure);
        setFigureSelected(true);
    }
     
    let canvas: HTMLCanvasElement | null = useContext(CanvasContext);
    // const borderWidth = 1;
    // //const canvasCoords = canvas!.getBoundingClientRect();
    // function calculateInitPos (props: ShapeObjProps) {
    //     const canvasCoords = canvas!.getBoundingClientRect();
    //     return {
    //         x: props.editor.selectedObject!.position.x,
    //         y: canvasCoords.top + props.editor.selectedObject!.position.y
    //     }
    // }

    // const [isMousePressed, setIsMousePressed] = useState(false);
    // const [offset, setOffset] = useState({x: 0, y: 0});
    // const [position, setPosition] = useState(() => {return calculateInitPos(props)});


    // function onMouseDownHandler(event: any) {
    //     const canvasCoords = canvas!.getBoundingClientRect();
    //     if (event.clientY < canvasCoords.top) return;
    //     resolve(props.editor, {x: event.clientX, y: event.clientY}, canvasCoords);
    //     if (intention !== Intent.DroppingTextObj) return;
    //     console.log('TEXT in onMouseDownHandler function');
    //     if (isTextObject(props.editor.selectedObject)) {
    //         console.log("слияние с канвасом");
    //         //dispatch(joinSelectionWithCanvas, {});
    //     }
    // }
    
    // function onMouseDownTextObjHandler(event: any) {
    //     const canvasCoords = canvas!.getBoundingClientRect();
    //     resolve(props.editor, {x: event.clientX, y: event.clientY}, canvasCoords);
    //     if (intention !== Intent.DraggingTextObj) return;
    //     console.log('TEXT in onMouseDownTextObjHandler function');
    //     setOffset({x: event.clientX - position.x!, y: event.clientY - position.y!});
    //     setIsMousePressed(true);
    // }
        
    // const adjustCoords = function (left: number, top: number): {left: number, top: number} {
    //     const svg: HTMLCanvasElement = svgRef.current!;
    //     const canvasCoords = canvas!.getBoundingClientRect();
    //     if (left < canvasCoords.left) {
    //         left = canvasCoords.left;
    //     }
    //     if (left + svg.width > canvasCoords.right) {
    //         left = canvasCoords.right - svg.width;
    //     }
    //     if (top < canvasCoords.top) {
    //         top = canvasCoords.top - borderWidth;
    //     }
    //     if (top + svg.height > canvasCoords.bottom) {
    //         top = Math.max(canvasCoords.bottom - svg.height, canvasCoords.top);
    //     }
    //     return {left, top}
    // }
    
    // const onMouseMoveTextObjHandler = function (event: any) {
    //     if (isMousePressed) {
    //         const adjustedCoords = adjustCoords(event.clientX - offset.x, event.clientY - offset.y)
    //         setPosition({x: adjustedCoords.left, y: adjustedCoords.top});
    //     }
    // }

    // const onMouseUpTextObjHandler = function (event: any) {
    //     if (!isMousePressed) return;
    //     console.log('TEXT in onMouseUpTextObjHandler function');
    //     const canvasCoords = canvas!.getBoundingClientRect();
    //     const adjustedCoords = adjustCoords(event.clientX - offset.x, event.clientY - offset.y);
    //     setPosition({x: adjustedCoords.left, y: adjustedCoords.top});
    //     dispatch(dropTextObj, {where: {x: adjustedCoords.left, y: adjustedCoords.top - canvasCoords.top}});
    //     setIsMousePressed(false);

    // }

    useEffect(() => { 
        if (figureSelected) {
            const canvasCoords = canvas!.getBoundingClientRect();
            const svgElem: HTMLElement = svgRef.current!;
            svgElem.style.top = (props.editor.canvas.width / 2 - 50 ).toString();
            svgElem.style.left = (props.editor.canvas.width / 2 - 50).toString();
            svgElem.style.width = '100px';
            svgElem.style.height = '100px';
        }
        
        // inputElem.addEventListener('mousedown', onMouseDownTextObjHandler);
        // document.addEventListener('mousedown', onMouseDownHandler);
        // document.addEventListener('mousemove', onMouseMoveTextObjHandler);
        // document.addEventListener('mouseup', onMouseUpTextObjHandler);
        //функция сработает когда произойдет следующая перерисовка
        //return () => {
            // inputElem.removeEventListener('mousedown', onMouseDownTextObjHandler);
            // document.removeEventListener('mousedown', onMouseDownHandler);
            // document.removeEventListener('mousemove', onMouseMoveTextObjHandler);
            // document.removeEventListener('mouseup', onMouseUpTextObjHandler);
    });  

 
    return (
        <div>
            <div className="ShapeBar">
                <button 
                    className="circleBtn"
                    title="Круг"
                    id="circle"
                    onClick={onShapeObjClickHandler}
                ></button>
                <button 
                    className="rectangleBtn"
                    title="Прямоугольник"
                    id="rectangle"
                    onClick={onShapeObjClickHandler}
                ></button>
                <button 
                    className="triangleBtn"
                    title="Треугольник"
                    id="triangle"
                    onClick={onShapeObjClickHandler}
                ></button>
            </div>
            
            {figureSelected &&
            <svg
                className="shapeBorder"
                ref={svgRef}
            />
            }
        </div>
    ) 
}

export default ShapeObject;