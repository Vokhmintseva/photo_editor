import React, { useState } from 'react'
import {Editor} from '.././model'
import './Toolbar.css';
import Select from '../UI/Select/Select';
import OpenButton from '../Buttons/OpenButton';
import SaveButton from '../Buttons/SaveButton';
import SnapShotButton from '../Buttons/SnapShotButton';
import {applyFilter} from '../actions';
import { dispatch } from '../reducer';

interface ToolbarProps {
    editor: Editor,
    reference: any,
    togglePlayingFunc: () => void,
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
            <OpenButton editor={toolbarProps.editor} reference={toolbarProps.reference}/>
            <SaveButton editor={toolbarProps.editor} reference={toolbarProps.reference}/>
            {select}
            <button onClick={filterButtonHandler}>Применить фильтр</button>
            <SnapShotButton editor={toolbarProps.editor} reference={toolbarProps.reference} togglePlayingFunc={toolbarProps.togglePlayingFunc}/>
        </div>
    )
}

export default Toolbar;