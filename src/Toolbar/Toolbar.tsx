import React, { useRef, useEffect } from 'react'
import {Editor} from '.././model'
import './Toolbar.css';
import OpenButton from '../Buttons/OpenButton';
import SaveButton from '../Buttons/SaveButton';

interface ToolbarProps {
    editor: Editor,
    reference: any
}

function Toolbar(toolbarProps: ToolbarProps) {
    return (
        <div className='toolbar'>
            <OpenButton editor={toolbarProps.editor} reference={toolbarProps.reference}/>
            <SaveButton editor={toolbarProps.editor} reference={toolbarProps.reference}/>
        </div>
    )
}

export default Toolbar;