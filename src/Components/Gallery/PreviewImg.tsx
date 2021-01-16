import React, { useContext, useState, useEffect }  from 'react';
import { Editor } from '../../model';
import { CanvasContext } from '../EditorComponent/EditorComponent';
import { addImage } from '../../actions';
import { createClient, PhotosWithTotalResults, ErrorResponse, Photo } from 'pexels';
import './Gallery.css';
import { dispatch } from '../../reducer';

interface PreviewImgProps {
    key: number,
    photo: Photo,
    mediumSrc: string
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
            // let imageWidth = image.width;
            // let imageHeight = image.height;
            // if (imageWidth > pro.editor.canvas.width || imageHeight > openButtonProps.editor.canvas.height) {
            //     let shouldEnlarge = window.confirm("импортируемая фотография больше по размеру холста. Увеличить полотно до размера фотографии?");
            //     if (shouldEnlarge) {
            //         canvas!.width = imageWidth;
            //         canvas!.height = imageHeight;
            //         context!.drawImage(image, 0, 0);
            //     } 
            // } else
            context!.drawImage(image, 0, 0);
            let newImgData = context!.getImageData(0, 0, canvas!.width, canvas!.height);
            dispatch(addImage, {newImage: newImgData})
        }
    }

    return (
        <div className="pickImgContainer__preview" onClick={onPreviewImgClicked}>
            <img src={props.photo.src.tiny} width="280" height="200" />
        </div>
    );
}

export default PreviewImg;