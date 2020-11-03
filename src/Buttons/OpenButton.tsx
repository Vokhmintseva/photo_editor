import React from 'react'
import {Editor} from '.././model';
import {addImage} from '../actions'
import { dispatch } from '../reducer';


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
        let url = window.URL.createObjectURL(new Blob(binaryData, {type: "originalFile.type"}));
        image.src = url;
        e.target.value = '';
        let canvas: HTMLCanvasElement = openButtonProps.reference.current; 
        let context = canvas!.getContext('2d');
        
        image.onload = () => {
            let imageWidth = image.width;
            let imageHeight = image.height;
            if (imageWidth > openButtonProps.editor.canvas.width || imageHeight > openButtonProps.editor.canvas.height) {
                let shouldEnlarge = window.confirm("импортируемая фотография больше по размеру холста. Увеличить полотно до размера фотографии?");
                if (shouldEnlarge) {
                    canvas.width = imageWidth;
                    canvas.height = imageHeight;
                    context!.drawImage(image, 0, 0);
                } 
            } else
                context!.drawImage(image, 0, 0);
            let newImgData = context!.getImageData(0, 0, canvas.width, canvas.height);
            dispatch(addImage, {newImage: newImgData})
        }
    }

    return (
        <input type="file" name="myImage" onChange={onImageChange} style={{margin: '5px'}}/>
    );
}    

export default OpenButton;