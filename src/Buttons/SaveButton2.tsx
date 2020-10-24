import React, { useRef} from 'react'
import {Editor} from '../model'

interface SaveButton2Props {
    editor: Editor,
    reference: any
}

function SaveButton2(saveButton2Props: SaveButton2Props) {
        
    function onClickSaveButton(event: React.MouseEvent<HTMLButtonElement>) {
        //свойство current рефа содержит соответствующий DOM-элемент
        let canvas: HTMLCanvasElement = saveButton2Props.reference.current;
        var dataURL = canvas.toDataURL("image/jpeg");
        var link = document.createElement("a");
        //document.body.appendChild(link);
        link.href = dataURL;
        link.download = "my-image.jpg";
        link.click();
        //document.body.removeChild(link);
    }
    
    return (
        <button onClick={onClickSaveButton} style={{margin: '5px'}}>Save</button>
    );
}

export default SaveButton2;