import React, { useRef} from 'react'
import {Editor} from '.././model';
import {addImage, resizeCanvas} from '../actions'

interface OpenButtonProps {
    editor: Editor,
    reference: any
}

function OpenButton(openButtonProps: OpenButtonProps) {
        
    function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        let file: any = e!.target!.files![0];
        const image = new Image();
        var binaryData = [];
        binaryData.push(file);
        let url = window.URL.createObjectURL(new Blob(binaryData, {type: "originalFile.type"}))
        let canvas: HTMLCanvasElement = openButtonProps.reference.current; 
        image.src = url;
        
        let context = canvas!.getContext('2d');
        image.onload = async () => {
            let width = image.width;
            let height = image.height;
            if (width > openButtonProps.editor.canvas.width || height > openButtonProps.editor.canvas.height) {
                let isResize = window.confirm("импортируемая фотография больше по размеру холста. Увеличить полотно до размера фотографии?");
                if (isResize) {
                    resizeCanvas(openButtonProps.editor, width, height);
                    
                    canvas.width = width;
                    canvas.height = height
                } else return

            }
            await context!.drawImage(image, 0, 0);
            
        };
        let newImgData = context!.getImageData(0, 0, openButtonProps.editor.canvas.width, openButtonProps.editor.canvas.height);
        addImage(openButtonProps.editor, newImgData);

    }
    console.log('openButtonProps.editor.canvas.width', openButtonProps.editor.canvas.width)
    return (
        <input type="file" name="myImage" onChange={onImageChange} style={{margin: '5px'}}/>
    );
}

export default OpenButton;