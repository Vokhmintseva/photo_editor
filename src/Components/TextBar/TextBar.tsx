import React, { useEffect, useState } from 'react';
import {Editor} from '../../model';


interface EditorComponentProps {
    editor: Editor
}

function TextBar(props: EditorComponentProps) {

//     const selectColor = <Select
//     label="Выберите фильтр"
//     value={filter}
//     onChange={selectFilterHandler}
//     options={[
//         {text: "grey", value: "grey"},
//         {text: "red", value: "red"},
//         {text: "green", value: "green"},
//         {text: "blue", value: "blue"},
//     ]}
// />
    
    useEffect(() => {

    })
         
    return (
        <div>
            <label>Цвет текста</label>
            <input type='color'></input>
        </div>
    )
}

export default TextBar;