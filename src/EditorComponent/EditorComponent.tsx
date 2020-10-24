import React, { useRef, useEffect } from 'react'
import {Editor} from '../model'
import Toolbar from '../Toolbar/Toolbar';

interface EditorComponentProps {
    editor: Editor
}

function EditorComponent({editor}: EditorComponentProps) {
    
    let canvasRef = useRef(null);
    useEffect(() => { //функция запутится после рендеринга
        const canv: HTMLCanvasElement = canvasRef.current!;
        var context = canv.getContext('2d') as CanvasRenderingContext2D;
        context.putImageData(editor.canvas, 0, 0, 0, 0, editor.canvas.width, editor.canvas.height);
    });   
     
    
    return (
        <div>
            <Toolbar editor={editor} reference={canvasRef}/>
            <canvas 
                ref={canvasRef} //React установит .current на этот DOM-узел
                width={editor.canvas.width}
                height={editor.canvas.height}
            />
        </div>
    )
}
export default EditorComponent;














// const Canvas = props => {
  
//   const canvasRef = useRef(null)
  
//   useEffect(() => {
//     const canvas = canvasRef.current
//     const context = canvas.getContext('2d')
//     //Our first draw
//     context.fillStyle = '#000000'
//     context.fillRect(0, 0, context.canvas.width, context.canvas.height)
//   }, [])
  
//   return <canvas ref={canvasRef} {...props}/>
// }

// export default Canvas


        //console.log(context.getImageData(0, 0, 20, 20).data);

        
        // var data = new Uint8Array(20 * 20 * 4);
        // crypto.getRandomValues(data);
        // var img = new ImageData(new Uint8ClampedArray(data.buffer), 20, 20);
        // context.putImageData(img, 0, 0);
        // console.log(context.getImageData(0, 0, 20, 20));