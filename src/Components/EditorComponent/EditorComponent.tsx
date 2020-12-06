import React, { useRef, useEffect, useState } from 'react';
import {Editor} from '../../model';
import Toolbar from '../Toolbar/Toolbar';
// import { dispatch, getSelectionImgData} from '../../reducer';
// import {selectArea, cut, getSelectedAreaData, addImage, deSelectArea} from '../../actions';
import Video from '../Video/Video';
import SelectedArea from '../SelectedArea/SelectedArea';
import Canvas from '../Canvas/Canvas';
import './EditorComponent.css';

interface EditorComponentProps {
    editor: Editor
}

export const CanvasContext = React.createContext(null);

function EditorComponent(props: EditorComponentProps) {
    console.log('rendering EditorComponent');
    // const [isVideoPlaying, setVideoPlaying] = useState(false);
    
    const [canvas, setCanvas] = useState(null);
    const getCanvas = (ref: any) => setCanvas(ref.current!);
    //const [selectionImgData, getSelectionImgData] = useState({} as ImageData);
    
    // let isMousePressed = false;
    // let isOnSelectionClick = false;
    // let mouseDownCoords = {x: 0, y: 0};
    
    // let selectionParams = {startX: 0, startY: 0, width: 0, height: 0}; 
    // if (editProps.editor.selectedObject !== null) {
    //     selectionParams = {
    //                         startX: editProps.editor.selectedObject.position.x, 
    //                         startY: editProps.editor.selectedObject.position.y,
    //                         width: editProps.editor.selectedObject.w,
    //                         height: editProps.editor.selectedObject.h,
    //                       }
    // }                      

    //let canvasRef = useRef(null);
    // let selCanvasRef = useRef(null);
    
    // function TogglePlayngState() {
    //     setVideoPlaying(!isVideoPlaying);
    // }

    // const onMouseDownSelectionHandler = function (event: any) {
    //     console.log('in onMouseDownSvgHandler function');
    //     isOnSelectionClick = true;
    //     event.preventDefault();
    // }
    
    // function onMouseDownHandler(event: any) {
    //     console.log('in onMouseDownHandler function');
    //     if (event.defaultPrevented) {console.log('event has been prevented'); return;}
    //     isMousePressed = true;
    //     mouseDownCoords = {x: event.clientX, y: event.clientY};
    //     if (!isOnSelectionClick) {
    //         const selCanv: HTMLCanvasElement = selCanvasRef.current!;
    //         var selContext = selCanv.getContext('2d') as CanvasRenderingContext2D;
    //         selContext.clearRect(0, 0, selCanv.width, selCanv.height);
    //     }
    // }
    
    // const onMouseMoveHandler = function (event: any) {
        
    //     const selCanv: HTMLCanvasElement = selCanvasRef.current!;
    //     //делаем выделение
    //     if (isMousePressed && !isOnSelectionClick) {
    //         const selectionCoords = getSelectionParams({x: mouseDownCoords.x, y: mouseDownCoords.y}, {x: event.clientX, y: event.clientY});
    //         selCanv.style.left = selectionCoords[0].x + 'px';
    //         selCanv.style.top = selectionCoords[0].y + 'px';
    //         selCanv.style.width = selectionCoords[1].x - selectionCoords[0].x + 'px';
    //         selCanv.style.height = selectionCoords[1].y - selectionCoords[0].y + 'px';
    //     }
    //     //делаем перетаскивание
    //     if (isOnSelectionClick) {
    //         selCanv.style.left = event.clientX + 'px';
    //         selCanv.style.top = event.clientY + 'px';
    //         selCanv.style.width = selectionParams.width + 'px';
    //         selCanv.style.height = selectionParams.height + 'px';
    //     }
    // }

    // function getSelectionParams (start: {x: number, y: number}, end: {x: number, y: number})
    // {
    //     const canv: HTMLCanvasElement = canvasRef.current!;
    //     const canvasCoord = canv.getBoundingClientRect();
    //     let startX = Math.min(start.x, end.x);
    //     let startY = Math.max(canvasCoord.y, Math.min(end.y, start.y));
    //     let endX = Math.min(Math.max(end.x, start.x), canvasCoord.width);
    //     let endY = Math.min(startY + Math.abs(end.y - start.y), canvasCoord.y + canvasCoord.height);
    //     return ([{x: startX, y: startY}, {x: endX, y: endY}]);
    // }

    // const onMouseUpHandler = function (event: any) {
    //     console.log('in onMouseUpHandler function');
    //     const canv: HTMLCanvasElement = canvasRef.current!;
    //     const canvasCoords = canv.getBoundingClientRect();
    //     const upClientX = event.clientX;
    //     const upClientY = event.clientY;
        
    //     //делаем выделение
    //     if ((upClientX !== mouseDownCoords.x) && (upClientY !== mouseDownCoords.y) && !isOnSelectionClick) {
    //         console.log('creating selected area');
    //         const selectionCoords = getSelectionParams({x: mouseDownCoords.x, y: mouseDownCoords.y}, {x: event.clientX, y: event.clientY});
    //         const startX = selectionCoords[0].x + 2 as number;
    //         const startY = selectionCoords[0].y + 2 as number;
    //         const endX = selectionCoords[1].x + 2 as number;
    //         const endY = selectionCoords[1].y + 2 as number;
    //         dispatch(selectArea, {startPoint: {x: startX, y: startY - canvasCoords.top}, endPoint: {x: endX, y: endY - canvasCoords.top}});
    //     }
        
    //     //делаем перемещение
    //     if ((upClientX !== mouseDownCoords.x) && (upClientY !== mouseDownCoords.y) && isOnSelectionClick) {
           
    //         const canv: HTMLCanvasElement = canvasRef.current!;
    //         var context = canv.getContext('2d') as CanvasRenderingContext2D;
    //         let selectedImgData: any = context.getImageData(selectionParams.startX, selectionParams.startY, selectionParams.width, selectionParams.height);
    //         context.putImageData(selectedImgData, upClientX, upClientY - canvasCoords.top);
    //         const selCanv: HTMLCanvasElement = selCanvasRef.current!;
    //         selCanv.style.left = upClientX;
    //         selCanv.style.top = upClientY;
    //         selCanv.style.width = selectionParams.width.toString();
    //         selCanv.style.height = selectionParams.height.toString();
    //         const newData = context.getImageData(0, 0, canv.width, canv.height);
    //         dispatch(addImage, {newImage: newData});
    //     }

    //     //снимаем выделение по клику в пределах канваса
    //     if ((upClientX == mouseDownCoords.x) && (upClientY == mouseDownCoords.y) && editProps.editor.selectedObject !== null && !isOnSelectionClick) {
            
    //         if (upClientX <= editProps.editor.canvas.width && upClientY > 31) {
    //             console.log('dispatching deselect area');
    //             dispatch(deSelectArea, {});
    //         }
    //     }
    //     isOnSelectionClick = false; 
    //     isMousePressed = false;
    // }
    
    // useEffect(() => { //функция запутится после рендеринга
    //     const canv: HTMLCanvasElement = canvasRef.current!;
    //     var context = canv.getContext('2d') as CanvasRenderingContext2D;
    //     const selCanv: HTMLCanvasElement = selCanvasRef.current!;
    //     var selContext = selCanv.getContext('2d') as CanvasRenderingContext2D;

  
    //     context.putImageData(editProps.editor.canvas, 0, 0, 0, 0, editProps.editor.canvas.width, editProps.editor.canvas.height);
    //     if (editProps.editor.selectedObject !== null) {
    //         let selectionImgData = context.getImageData(selectionParams.startX - 1, selectionParams.startY - 1, selectionParams.width, selectionParams.height);
    //         selCanv.setAttribute('top', selectionParams.startY.toString());
    //         selCanv.setAttribute('left', selectionParams.startX.toString());
    //         selCanv.setAttribute('width', selectionParams.width.toString());
    //         selCanv.setAttribute('height', selectionParams.height.toString());
    //         selContext.putImageData(selectionImgData, 0, 0);
    //     };

    //     document.addEventListener('mousedown', onMouseDownHandler);
    //     document.addEventListener('mousemove', onMouseMoveHandler);
    //     document.addEventListener('mouseup', onMouseUpHandler);
    //     selCanv.addEventListener('mousedown', onMouseDownSelectionHandler);
        
    //     //функция сработает когда произойдет следующая перерисовка
    //     return () => {
    //         document.removeEventListener('mouseup', onMouseUpHandler);
    //         document.removeEventListener('mousemove', onMouseMoveHandler);
    //         document.removeEventListener('mousedown', onMouseDownHandler);
    //         selCanv.removeEventListener('mousedown', onMouseDownSelectionHandler);
    //     };
    // }); 
    
    // let canvasStyles: Array<String> = ['canvas'];
    // if (isVideoPlaying) canvasStyles.push('canvasNotVisible');
         
    return (
        <CanvasContext.Provider value={canvas}>
            <div>
                <Toolbar 
                    editor={props.editor}
                    
                    // togglePlayingFunc={TogglePlayngState}
                />
                
                {/* <canvas  
                    // className={canvasStyles.join(' ')}
                    // ref={canvasRef} //React установит .current на этот DOM-узел
                    width={editProps.editor.canvas.width}
                    height={editProps.editor.canvas.height}
                    style={{position: 'absolute', border: '1px black',}}
                /> */}
                <Canvas 
                    setCanv={getCanvas}
                    editor={props.editor}
                />
                
                {/* <canvas
                    ref={selCanvasRef}
                    style={{
                        position: 'absolute',
                        border: '1px dashed black',
                        top: `${selectionParams.startY}`,
                        left: `${selectionParams.startX}`,
                        width: `${selectionParams.width}`,
                        height: `${selectionParams.height}`,
                    }}
                ></canvas> */}
                
                {props.editor.selectedObject !==null &&
                <SelectedArea
                    editor={props.editor}
                />}
                
                {/* <Video editor={editProps.editor} reference={canvasRef}/> */}
                
            </div>
        </CanvasContext.Provider>
    )
}

export default EditorComponent;