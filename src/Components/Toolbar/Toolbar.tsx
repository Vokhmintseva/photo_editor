import React, { useState, useContext, useEffect, useRef } from 'react'
import { Editor, Figure } from '../../model'
import './Toolbar.css';
import SelectFilter from '../Select/SelectFilter';
import OpenButton from '../Buttons/OpenButton';
import SaveButton from '../Buttons/SaveButton';
import SnapshotButton from '../Buttons/SnapshotButton';
import { isSelectedArea } from '../../actions';
import { dispatch } from '../../reducer';
import { deselectArea, crop, cut, createCanvas, applyFilter } from '../../store/actions/Actions';
import { connect } from 'react-redux';

interface ToolbarProps {
    editor: Editor,
    onShowCamera: () => void,
    onShowTextArea: () => void,
    showTextArea: Boolean,
    onShowFigureClickHandler: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    onOpenGalleryHandler: () => void,
    onDeselectArea: () => void,
    onApplyFilter: (payload: {filterColor: string}) => void,
    onCut: () => void,
    onCrop: () => void,
    onCreateCanvas: (payload: {width: number, height: number}) => void
}

function Toolbar(props: ToolbarProps) {
      
    let showTextBtnRef = useRef(null);
    const [filter, setFilter] = useState("grey");
        
    function selectFilterHandler(event: any): void {
        setFilter(event.target.value)
    }

    function filterButtonHandler(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        props.onApplyFilter({filterColor: filter});
    }
    
    function onClearSelectionHandler() {
        props.onCut();
        props.onDeselectArea();
    }

    function onSelectionCropHandler() {
        props.onCrop();
    }

    function onClearAllHandler() {
        let shouldremoveCanvas = window.confirm("Текущий холст будет удален. Вы подтверждаете удаление холста?");
        if (shouldremoveCanvas) {
            props.onCreateCanvas({width: 800, height: 600});
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
            <OpenButton />
            <button onClick={props.onOpenGalleryHandler}>Галерея</button>
            <SaveButton />
            <button onClick={onClearAllHandler}>New Canvas</button>
            {select}
            <button onClick={filterButtonHandler}>Применить фильтр</button>
            <SnapshotButton onShowCamera={props.onShowCamera}/>
            {props.editor.selectedObject && isSelectedArea(props.editor.selectedObject) &&
            <div>
            <button onClick={onClearSelectionHandler}>Cut</button>
            <button onClick={onSelectionCropHandler}>Crop</button>
            </div>
            }
            <button 
                ref={showTextBtnRef}
                title="Текст"
                onClick={props.onShowTextArea}
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

function mapStateToProps(state: any) {
    return {
        editor: state.editorReducer.editor
    }
}

function mapDispatchToProps(dispatch: any) {
    return {
      onDeselectArea: () => dispatch(deselectArea()),
      onApplyFilter: (payload: {filterColor: string}) => dispatch(payload),
      onCut: () => dispatch(cut()),
      onCrop: () => dispatch(crop()),
      onCreateCanvas: (payload: {width: number, height: number}) => dispatch(createCanvas(payload))
    }
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);