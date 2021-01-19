import React, { useState, useEffect, useContext }  from 'react';
import { Editor } from '../../model';
import './ResizeModal.css';
//import { Intention } from '../../Intentions';
import { connect } from 'react-redux';
import { resizeCanvas } from '../../store/actions/Actions';

interface ResizeModalProps {
    onResize: (payload: {newWidth: number, newHeight: number}) => void,
    editor: Editor,
    onShowModalClicked: (should: boolean) => void,
}


function ResizeModal(props: ResizeModalProps) {
    const [width, setWidth] = useState(() => {return (props.editor.canvas) ? props.editor.canvas.width : 0});
    const [height, setHeight] = useState(() => {return (props.editor.canvas) ? props.editor.canvas.height : 0});


    const onResizeClicked = () => {
        


        props.onResize({newWidth: width, newHeight: height});
    }

    return (
        <div className="resizeModal">
            <label>Ширина</label>
            <input
                onChange={e => {setWidth(parseInt(e.target.value))}}
                placeholder={width.toString()}
            ></input>
            <label>Высота</label>
            <input
                onChange={e => {setHeight(parseInt(e.target.value))}}
                placeholder={height.toString()}
            ></input>
            <button onClick={onResizeClicked} className="pickImgContainer__searchButton">ОК</button>
            <button onClick={e => props.onShowModalClicked(false)} className="pickImgContainer__searchButton">Отмена</button>
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
      onResize: (payload: {newWidth: number, newHeight: number}) => dispatch(resizeCanvas(payload)),
    }
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(ResizeModal);