import React, { useRef, useEffect, useState}  from 'react';
import {Editor} from '../../model';
import './SelectedArea.css';

interface SelectionProps {
    editor: Editor,
    reference: any,
}

const SelectedArea = (props: SelectionProps) => {
    let selectionRef = useRef(null);
    
    return (
        <canvas 
            ref={selectionRef}    
            style={{
                    position: 'absolute',
                    border: '1px dashed black',
                    top: `${props.editor.selectedObject ? props.editor.selectedObject.position.y + 31 : 0}`,
                    left: `${props.editor.selectedObject ? props.editor.selectedObject.position.x : 0}`,
                    width: `${props.editor.selectedObject ? props.editor.selectedObject.w : 0}`,
                    height: `${props.editor.selectedObject ? props.editor.selectedObject.h : 0}`
            }}>
        </canvas>
    )
}

export default SelectedArea;