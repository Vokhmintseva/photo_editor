import React, { useContext, useState, useEffect }  from 'react';
//import {Editor} from '../../model';
import {CanvasContext} from '../EditorComponent/EditorComponent';
import { setTextColor } from '../../actions';
//import { connect } from 'react-redux';

interface SaveButtonProps {
    //editor: Editor,
}

function SaveButton(saveButtonProps: SaveButtonProps) {
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

// function mapStateToProps(state: any) {
//   return {
//       editor: state.editorReducer.editor
//   }
// }

//export default connect(mapStateToProps)(SaveButton);
export default SaveButton;