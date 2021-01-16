import React, { useState, useContext, useEffect, useRef } from 'react'
import {Editor} from '../../model'
import './Toolbar.css';
import SelectFilter from '../Select/SelectFilter';
import OpenButton from '../Buttons/OpenButton';
import SaveButton from '../Buttons/SaveButton';
import SnapshotButton from '../Buttons/SnapshotButton';
import {applyFilter, cut, crop, createCanvas, deSelectArea, isSelectedArea} from '../../actions';
import { dispatch } from '../../reducer';

interface ToolbarProps {
    editor: Editor,
    toggleShowCamera: () => void,
    toggleShowTextArea: () => void,
    showTextArea: Boolean,
    onShowFigureClickHandler: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    onOpenGalleryHandler: () => void,
}

function Toolbar(props: ToolbarProps) {
      
    let showTextBtnRef = useRef(null);
    const [filter, setFilter] = useState("grey");
        
    function selectFilterHandler(event: any): void {
        setFilter(event.target.value)
    }

    function filterButtonHandler(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        dispatch(applyFilter, {filterColor: filter})
    }
    
    function onClearSelectionHandler() {
        dispatch(cut, {});
        dispatch(deSelectArea, {});
    }

    function onSelectionCropHandler() {
        dispatch(crop, {});
    }

    function onClearAllHandler() {
        let shouldremoveCanvas = window.confirm("Текущий холст будет удален. Вы подтверждаете удаление холста?");
        if (shouldremoveCanvas) {
            dispatch(createCanvas, {width: 800, height: 600});
        } 
    }

    const select = <SelectFilter
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
    //let canvas: HTMLCanvasElement | null = useContext(CanvasContext);

    useEffect(() => {
        const showTextBtn: HTMLCanvasElement = showTextBtnRef.current!;
        showTextBtn.style.backgroundColor = props.showTextArea ? '#F953BC' : '#FFFFFF';
    })

    return (
        <div className='toolbar'>
            <OpenButton editor={props.editor} />
            <button onClick={props.onOpenGalleryHandler}>Галерея</button>
            <SaveButton editor={props.editor} />
            <button onClick={onClearAllHandler}>New Canvas</button>
            {select}
            <button onClick={filterButtonHandler}>Применить фильтр</button>
            <SnapshotButton editor={props.editor} toggleShowCamera={props.toggleShowCamera}/>
            {props.editor.selectedObject && isSelectedArea(props.editor.selectedObject) &&
            <div>
            <button onClick={onClearSelectionHandler}>Cut</button>
            <button onClick={onSelectionCropHandler}>Crop</button>
            </div>
            }
            <button 
                ref={showTextBtnRef}
                title="Текст"
                onClick={props.toggleShowTextArea}
            >A</button>
            <div className="ShapeBar">
                <button 
                    className="circleBtn"
                    title="Круг"
                    id="circle"
                    onClick={props.onShowFigureClickHandler}
                ></button>
                <button 
                    className="rectangleBtn"
                    title="Прямоугольник"
                    id="rectangle"
                    onClick={props.onShowFigureClickHandler}
                ></button>
                <button 
                    className="triangleBtn"
                    title="Треугольник"
                    id="triangle"
                    onClick={props.onShowFigureClickHandler}
                ></button>

            </div>

        </div>
    )
}

export default Toolbar;