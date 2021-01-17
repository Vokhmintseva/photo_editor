import React, { useRef, useEffect}  from 'react';
import {Editor} from '../../model';
import './Canvas.css';
import { connect } from 'react-redux';

interface CanvasProps {
    editor: Editor,
    setCanv: (ref: any) => void,
}

const Canvas = (props: CanvasProps) => {
    let canvasRef = useRef(null);
    useEffect(() => {
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
        </div>
    )
}

function mapStateToProps(state: any) {
    return {
        editor: state.editorReducer.editor
    }
}
  
export default connect(mapStateToProps)(Canvas);