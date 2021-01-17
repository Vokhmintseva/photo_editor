import React, { useContext }  from 'react';
import {Editor} from '../../model';
import { CanvasContext } from '../EditorComponent/EditorComponent';
import { Photo } from 'pexels';
import './Gallery.css';
import { addImage } from '../../store/actions/Actions';
import { connect } from 'react-redux';

interface PreviewImgProps {
    editor: Editor,
    key: number,
    photo: Photo,
    mediumSrc: string,
    onAddImage: (payload: {newImage: ImageData}) => void
}

function PreviewImg(props: PreviewImgProps) {
    let canvas: HTMLCanvasElement | null = useContext(CanvasContext);      
    const onPreviewImgClicked = () => {
        console.log('props.mediumSrc', props.mediumSrc);
        const image = new Image();
        image.src = props.mediumSrc;
        image.crossOrigin = "Anonymous";
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
            props.onAddImage({newImage: newImgData});
        }
    }

    return (
        <div className="pickImgContainer__preview" onClick={onPreviewImgClicked}>
            <img src={props.photo.src.tiny} width="280" height="200" />
        </div>
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
  
export default connect(mapStateToProps, mapDispatchToProps)(PreviewImg);