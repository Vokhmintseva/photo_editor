import React, { useState, useContext } from 'react'
import {Editor} from '../../model'
import './Toolbar.css';
import Select from '../Select/Select';
import OpenButton from '../Buttons/OpenButton';
import SaveButton from '../Buttons/SaveButton';
import SnapshotButton from '../Buttons/SnapshotButton';
import {applyFilter, cut, crop, createCanvas} from '../../actions';
import { dispatch } from '../../reducer';
import {CanvasContext} from '../EditorComponent/EditorComponent';

interface ToolbarProps {
    editor: Editor,
    toggleShowCamera: () => void,
}

function Toolbar(props: ToolbarProps) {
    console.log('rendering toolbar')
    const [filter, setFilter] = useState("grey");
    
    function selectFilterHandler(event: any): void {
        setFilter(event.target.value)
    }

    function filterButtonHandler(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        dispatch(applyFilter, {filterColor: filter})
    }
    
    function onClearSelectionHandler() {
        dispatch(cut, {});
    }

    function onSelectionCropHandler() {
        dispatch(crop, {});
    }


    function onClearAllHandler() {
        dispatch(createCanvas, {width: canvas!.width, height: canvas!.height});
    }


    function onInsertTextHandler(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {

    }

    const select = <Select
        label="Выберите фильтр"
        value={filter}
        onChange={selectFilterHandler}
        options={[
            {text: "grey", value: "grey"},
            {text: "red", value: "red"},
            {text: "green", value: "green"},
            {text: "blue", value: "blue"},
        ]}
    />
    let canvas: HTMLCanvasElement | null = useContext(CanvasContext);

    return (
        <div className='toolbar'>
            <OpenButton editor={props.editor} />
            <SaveButton editor={props.editor} />
            <button onClick={onClearAllHandler}>ClearAll</button>
            {select}
            <button onClick={filterButtonHandler}>Применить фильтр</button>
            <SnapshotButton editor={props.editor} toggleShowCamera={props.toggleShowCamera}/>
            <button onClick={onClearSelectionHandler}>Cut</button>
            <button onClick={onSelectionCropHandler}>Crop</button>
            <button onClick={onInsertTextHandler}>A</button>

        </div>
    )
}

export default Toolbar;