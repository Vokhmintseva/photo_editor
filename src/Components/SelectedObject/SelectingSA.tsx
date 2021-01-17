import React, { useState, useRef, useEffect, useContext}  from 'react';
import { Editor, Point } from '../../model';
import { dispatch, editor } from '../../reducer';
//import { selectArea, whitenArea } from '../../actions';
import transform from './CoordinateTransformer';
import { CanvasContext } from '../EditorComponent/EditorComponent';
import { resolve, intention, Intent } from '../../intentResolver';
import { connect } from 'react-redux';
import { selectArea, whitenArea } from '../../store/actions/Actions';

interface SelectingSAProps {
    editor: Editor,
    onSelectArea: (payload: {startPoint: Point, endPoint: Point}) => void,
    onWhitenArea: () => void
}


const SelectingSA = (props: SelectingSAProps) => {
       
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
        if (event.clientY < canvasCoords.top) return;
        resolve(editor, {x: event.clientX, y: event.clientY}, canvasCoords);
        if (intention !== Intent.SelectingSA) return;
        console.log('SA SELECTING onMouseDownSVGHandler');
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
        console.log('SA SELECTING onMouseUpSVGHandler');
        if ((event.clientX !== mouseState.down.x) && (event.clientY !== mouseState.down.y)) {
            const canvasCoords = canvas!.getBoundingClientRect();
            const selectionCoords = transform(
                { x: mouseState.down.x, y: mouseState.down.y },
                { x: event.clientX, y: event.clientY },
                canvasCoords
            );
            const startX = selectionCoords.startX as number;
            const startY = selectionCoords.startY as number;
            const endX = selectionCoords.endX as number;
            const endY = selectionCoords.endY as number;
            props.onSelectArea({startPoint: {x: startX, y: startY - canvasCoords.top}, endPoint: {x: endX, y: endY - canvasCoords.top}});
            props.onWhitenArea();
            // dispatch(selectArea, {startPoint: {x: startX, y: startY - canvasCoords.top}, endPoint: {x: endX, y: endY - canvasCoords.top}});
            // dispatch(whitenArea, {});

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

function mapStateToProps(state: any) {
    return {
        editor: state.editorReducer.editor
    }
}

function mapDispatchToProps(dispatch: any) {
    return {
      onSelectArea: (payload: {startPoint: Point, endPoint: Point}) => dispatch(selectArea(payload)),
      onWhitenArea: () => dispatch(whitenArea())
    }
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(SelectingSA);