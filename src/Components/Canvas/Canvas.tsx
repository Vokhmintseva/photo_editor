import React, { useRef, useEffect}  from 'react';
import {Editor} from '../../model';
import './Canvas.css';
// import SelectingSA from '../SelectedObject/SelectingSA';
// import SelectingTextObject from '../SelectedObject/SelectingTextObject';
// import { isTextObject } from '../../actions';

interface CanvasProps {
    editor: Editor,
    setCanv: (ref: any) => void,
    showTextArea: boolean,
}
    
const Canvas = (props: CanvasProps) => {
    let canvasRef = useRef(null);
    //useMakeSelection(canvasRef, selRef, props.editor);
    useEffect(() => { //функция запутится после рендеринга
        const canvas: HTMLCanvasElement = canvasRef.current!;
        let context = canvas.getContext('2d') as CanvasRenderingContext2D;
        context.putImageData(props.editor.canvas, 0, 0, 0, 0, props.editor.canvas.width, props.editor.canvas.height);
        props.setCanv(canvasRef);
    }); 

    return (
        <div>
            <canvas 
                ref={canvasRef}    
                width={props.editor.canvas.width}
                height={props.editor.canvas.height}
                className="canvas"
            />

            {/* {!props.showTextArea &&
            <SelectingSA 
                editor={props.editor}                
            />
            }       

            {props.showTextArea &&
            <SelectingTextObject
                editor={props.editor} 
            />
            } */}

        </div>
    )
}

export default Canvas;