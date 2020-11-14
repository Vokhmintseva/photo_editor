import React from 'react';
import {Editor} from '../../model';
import './Svg.css';

interface SvgProps {
    editor: Editor,
    reference: any,
    top: number,
    left: number,
    width: number,
    height: number
}

const Svg = (props: SvgProps) => {
    console.log('props.top', props.top);
    console.log('props.left', props.left);
    console.log('props.width', props.width);
    console.log('props.height', props.height);

    return (
        <svg 
            className="svgRectangle"
            style={{
                top: `${props.top}`,
                left: `${props.left}`,
                width: `${props.width}`,
                height: `${props.height}` 
            }}>
        </svg>
    )
}

export default Svg;