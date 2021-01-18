import React, {useContext}  from 'react';
import {Editor} from '../../model';
import {CanvasContext} from '../EditorComponent/EditorComponent';
import { addImage } from '../../store/actions/Actions';
import { connect } from 'react-redux';
import { addToHistory } from '../../history';

interface OpenButtonProps {
    editor: Editor,
    onAddImage: (payload: {newImage: ImageData}) => void
}

function OpenButton(props: OpenButtonProps) {
    let canvas: HTMLCanvasElement | null = useContext(CanvasContext);
    function onImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        let file: any = e!.target!.files![0];
        const image = new Image();
        var binaryData = [];
        binaryData.push(file);
        let url = window.URL.createObjectURL(new Blob(binaryData, {type: "originalFile.type"}));
        image.src = url;
        e.target.value = '';
        let context = canvas!.getContext('2d');
        image.onload = () => {
            let imageWidth = image.width;
            let imageHeight = image.height;
            if (imageWidth > props.editor.canvas.width || imageHeight > props.editor.canvas.height) {
                let shouldEnlarge = window.confirm("импортируемая фотография больше по размеру холста. Увеличить полотно до размера фотографии?");
                if (shouldEnlarge) {
                    canvas!.width = imageWidth;
                    canvas!.height = imageHeight;
                    context!.drawImage(image, 0, 0);
                } 
            } else
                context!.drawImage(image, 0, 0);
            let newImgData = context!.getImageData(0, 0, canvas!.width, canvas!.height);
            console.log('openButton addImage dispatch');
            addToHistory(props.editor);
            props.onAddImage({newImage: newImgData});
        }
    }

    return (
        <input type="file" name="myImage" onChange={onImageChange} style={{margin: '5px'}}/>
    );
}    

function mapStateToProps(state: any) {
    return {
        editor: state.editorReducer.editor
    }
}

function mapDispatchToProps(dispatch: any) {
    return {
      onAddImage: (payload: {newImage: ImageData}) => dispatch(addImage(payload))
    }
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(OpenButton);