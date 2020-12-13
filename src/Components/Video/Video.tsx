import React, {useEffect, useState, useContext}  from 'react';
import {Editor} from '../../model';
import {addImage} from '../../actions'
import { dispatch } from '../../reducer';
import {CanvasContext} from '../EditorComponent/EditorComponent';

interface VideoProps {
    editor: Editor,
    
}

function Video (props: VideoProps) {
    //const [isStreaming, toggleIsStreaming] = useState(false);
    let video: any;
    
    function startWebcam() {
        if (navigator.mediaDevices.getUserMedia) {
            //метод  MediaDevices.getUserMedia() запрашивая медиапоток
            //Успешное выполнение промиса передает объект потока( stream ) в качестве параметра функции метода then()
              navigator.mediaDevices.getUserMedia({audio: false, video: true }).then(function (stream) {
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

    function stopWebcam() {
        console.log(video.srcObject.getVideoTracks()[0]);
        video.srcObject.getVideoTracks()[0].stop();
    } 

    function snapshot() {
        let context = canvas!.getContext('2d');
        context!.drawImage(video, 0, 0);
        let newImgData = context!.getImageData(0, 0, canvas!.width, canvas!.height);
        dispatch(addImage, {newImage: newImgData})
        video.srcObject.getVideoTracks()[0].stop();
    }
    
    let canvas: HTMLCanvasElement | null = useContext(CanvasContext);
    
    useEffect(() => { //функция запутится после рендеринга
        var context = canvas!.getContext('2d') as CanvasRenderingContext2D;
        //const canvasCoords = canvas!.getBoundingClientRect();
    })

    return (
        <div style={{position: 'absolute'}}>
            <video id="video" controls autoPlay></video>
            <button onClick={startWebcam}>Запуск Камеры</button>
            <button onClick={stopWebcam}>Стоп Камера</button> 
            <button onClick={snapshot}>Снимок</button> 
        </div>
    )
}

export default Video;

//position: 'relative', top: videoProps.editor.canvas.height