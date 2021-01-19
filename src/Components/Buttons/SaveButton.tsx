import React, { useContext, useState }  from 'react';
import {CanvasContext} from '../EditorComponent/EditorComponent';

function SaveButton() {
    let canvas: HTMLCanvasElement | null = useContext(CanvasContext);      
    const [ext, setExt] = useState('jpeg')

    function onChangeExt(event: any) {
        setExt(event.target.value);
    }
        
    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
          let dataURL = canvas!.toDataURL(`image/${ext}`);
            let link = document.createElement("a");
            link.href = dataURL;
            link.download = `my-image.${ext}`;
            link.click();
    }

    return (
        <form onSubmit={handleSubmit} className="saveBtn__form">
          <div className="saveBtn__wrapper">
            <div >
              <label className="saveBtn__label">
                <select className="saveBtn__select" onChange={onChangeExt}>
                  <option value="jpeg">jpeg</option>
                  <option value="png">png</option>
                </select>
              </label>
            </div>
            <div>
              <button type="submit" value="Сохранить" className="saveBtn" title="Сохранить"/>
            </div>
          </div>
        </form>
      );
}

export default SaveButton;