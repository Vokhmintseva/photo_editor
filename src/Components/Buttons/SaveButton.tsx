import React, {useContext}  from 'react';
//import {Editor} from '../../model';
import {CanvasContext} from '../EditorComponent/EditorComponent';
//import { connect } from 'react-redux';

interface SaveButtonProps {
    //editor: Editor,
}

function SaveButton(saveButtonProps: SaveButtonProps) {
    let canvas: HTMLCanvasElement | null = useContext(CanvasContext);      
    enum Format {jpeg, png};
    let f = Format.jpeg;
    
    function onChangeHandle(event: any) {
        f = event.target.value;
    }
        
    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        if (f in Format) {
            let dataURL = canvas!.toDataURL(`image/${f}`);
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

// function mapStateToProps(state: any) {
//   return {
//       editor: state.editorReducer.editor
//   }
// }

//export default connect(mapStateToProps)(SaveButton);
export default SaveButton;