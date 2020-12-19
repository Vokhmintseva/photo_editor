import React, {useEffect, useRef, useContext}  from 'react';
import {Editor} from '../../model';
import {addImage} from '../../actions'
import { dispatch } from '../../reducer';
import {CanvasContext} from '../EditorComponent/EditorComponent';

interface VideoProps {
    toggleShowCamera: () => void,
}

function Video (props: VideoProps) {
    let video: any;
    let cancelPhotoButtonRef = useRef(null);
    let takePhotoButtonRef = useRef(null);

    function startWebcam() {
        if (navigator.mediaDevices.getUserMedia) {
            //метод  MediaDevices.getUserMedia() запрашивая медиапоток
            //Успешное выполнение промиса передает объект потока( stream ) в качестве параметра функции метода then()
              navigator.mediaDevices.getUserMedia({audio: true, video: true }).then(function (stream) {
              video = document.querySelector("#video");
              if (video) {
                  //stream присваевается свойству srcObject элемента <video>, направляя поток в него
                video.srcObject = stream;
                video.onloadedmetadata = function() {
                  video!.play();
                };
              }
            }).catch(function (err0r) {
                console.log("!!!!!"+err0r);
            });
        }
    }

    function stopWebCam() {
        video.srcObject.getVideoTracks()[0].stop();
        props.toggleShowCamera();
    } 

    function snapshot() {
        let context = canvas!.getContext('2d');
        context!.drawImage(video, 0, 0);
        let newImgData = context!.getImageData(0, 0, canvas!.width, canvas!.height);
        dispatch(addImage, {newImage: newImgData});
        stopWebCam();
    }
    
    let canvas: HTMLCanvasElement | null = useContext(CanvasContext);
    
    useEffect(() => { //функция запутится после рендеринга
        startWebcam();
        setTimeout(function() {
            const cancelPhotoButton: HTMLCanvasElement = cancelPhotoButtonRef.current!;
            const takePhotoButton: HTMLCanvasElement = takePhotoButtonRef.current!;
            cancelPhotoButton.style.display = 'block';
            takePhotoButton.style.display = 'block';
        }, 2500);
    })

    return (
        <div style={{position: 'absolute'}}>
            <video id="video" controls autoPlay></video>
            <button onClick={stopWebCam} style={{display: 'none'}} ref={cancelPhotoButtonRef}>cancel</button>
            <button onClick={snapshot} style={{display: 'none'}} ref={takePhotoButtonRef}>take photo</button> 
        </div>
    )
}

export default Video;

//position: 'relative', top: videoProps.editor.canvas.height