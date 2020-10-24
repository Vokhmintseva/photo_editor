import React, { useRef} from 'react'
import {Editor} from '../model'

interface Sav {
    editor: Editor,
    reference: any
}

function SaveButton(saveButtonProps: Sav) {
        
    enum Format {jpeg, png};
    let f = Format.jpeg;
    
    function onChangeHandle(event: any) {
        f = event.target.value;
    }
        
    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (f in Format) {
            let canvas: HTMLCanvasElement = saveButtonProps.reference.current;
            let dataURL = canvas.toDataURL(`image/${f}`);
            let link = document.createElement("a");
            link.href = dataURL;
            link.download = `my-image.${f}`;
            link.click();
        }
    }

    return (
        <form onSubmit={handleSubmit} >
          <label>
            Выберите формат сохранения:
            <select onChange={onChangeHandle}>
              <option value="jpeg">jpeg</option>
              <option value="png">png</option>
            </select>
          </label>
          <input type="submit" value="Сохранить" />
        </form>
      );
}

export default SaveButton;