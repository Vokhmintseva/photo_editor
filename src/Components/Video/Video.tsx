import React, {useEffect, useRef, useContext}  from 'react';
import {Editor} from '../../model';
import {CanvasContext} from '../EditorComponent/EditorComponent';
import { addImage } from '../../store/actions/Actions';
import { connect } from 'react-redux';
import { addToHistory } from '../../history';
import { Intention } from '../../Intentions';

interface VideoProps {
    editor: Editor,
    onAddImage: (payload: {newImage: ImageData}) => void,
    onSetIntention: (intent: Intention) => void,
}

function Video (props: VideoProps) {
    let video: any;
    let cancelPhotoButtonRef = useRef(null);
    let takePhotoButtonRef = useRef(null);

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

    function stopWebCam() {
        video.srcObject.getVideoTracks()[0].stop();
        props.onSetIntention(Intention.SelectArea);
    } 

    function snapshot() {
        if (!canvas) return;
        let context = canvas!.getContext('2d');
        context!.drawImage(video, 0, 0);
        let newImgData = context!.getImageData(0, 0, canvas!.width, canvas!.height);
        addToHistory(props.editor);
        props.onAddImage({newImage: newImgData});
        stopWebCam();
    }
    
    let canvas: HTMLCanvasElement | null = useContext(CanvasContext);
    
    useEffect(() => {
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
  
export default connect(mapStateToProps, mapDispatchToProps)(Video);