import React, { useState } from 'react'
import {Editor} from '../../model'
import './Toolbar.css';
import Select from '../Select/Select';
import OpenButton from '../Buttons/OpenButton';
import SaveButton from '../Buttons/SaveButton';
import SnapShotButton from '../Buttons/SnapShotButton';
import {applyFilter, cut, crop} from '../../actions';
import { dispatch } from '../../reducer';

interface ToolbarProps {
    editor: Editor,
    
    //togglePlayingFunc: () => void,
}

function Toolbar(toolbarProps: ToolbarProps) {
    //console.log('rendering toolbar')
    const [filter, setFilter] = useState("grey");
    
    function selectChangeHandler(event: any): void {
        setFilter(event.target.value)
    }

    function filterButtonHandler(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        dispatch(applyFilter, {filterColor: filter})
    }
    
    function onClearSelectionHandler(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        dispatch(cut, {});
    }

    function onSelectionCropHandler(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        dispatch(crop, {});
    }


    const select = <Select
        label="Выберите фильтр"
        value={filter}
        onChange={selectChangeHandler}
        options={[
            {text: "grey", value: "grey"},
            {text: "red", value: "red"},
            {text: "green", value: "green"},
            {text: "blue", value: "blue"},
        ]}
    />

    return (
        <div className='toolbar'>
            <OpenButton editor={toolbarProps.editor} />
            <SaveButton editor={toolbarProps.editor} />
            {select}
            <button onClick={filterButtonHandler}>Применить фильтр</button>
            {/* <SnapShotButton editor={toolbarProps.editor} reference={toolbarProps.canvasReference} togglePlayingFunc={toolbarProps.togglePlayingFunc}/> */}
            <button onClick={onClearSelectionHandler}>Clear sel</button>
            <button onClick={onSelectionCropHandler}>Crop sel</button>
        </div>
    )
}

export default Toolbar;