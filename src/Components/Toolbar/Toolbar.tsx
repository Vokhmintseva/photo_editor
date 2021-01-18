import React, { useState, useEffect, useRef } from 'react'
import { Editor } from '../../model'
import './Toolbar.css';
import SelectFilter from '../Select/SelectFilter';
import OpenButton from '../Buttons/OpenButton';
import SaveButton from '../Buttons/SaveButton';
import SnapshotButton from '../Buttons/SnapshotButton';
import UndoButton from '../Buttons/UndoButton';
import RedoButton from '../Buttons/RedoButton';
import { isSelectedArea } from '../../actions';
import { deselectArea, crop, cut, createCanvas, applyFilter } from '../../store/actions/Actions';
import { connect } from 'react-redux';
import { addToHistory } from '../../history';

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
        console.log('dispatch Toolbar onApplyFilter');
        addToHistory(props.editor);
        props.onApplyFilter({filterColor: filter});
    }
    
    function onClearSelectionHandler() {
        console.log('dispatch Toolbar cut');
        addToHistory(props.editor);
        props.onCut();
        // console.log('dispatch Toolbar deselectArea');
        // props.onDeselectArea();
    }

    function onSelectionCropHandler() {
        console.log('dispatch Toolbar crop');
        addToHistory(props.editor);
        props.onCrop();
    }

    function onClearAllHandler() {
        let shouldremoveCanvas = window.confirm("Текущий холст будет удален. Вы подтверждаете удаление холста?");
        if (shouldremoveCanvas) {
            console.log('dispatch Toolbar createCanvas');
            addToHistory(props.editor);
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
            <button onClick={props.onOpenGalleryHandler} title="Поиск изображений">Галерея</button>
            <SaveButton />
            <UndoButton />
            <RedoButton />
            <button onClick={onClearAllHandler} title="Новый холст">New Canvas</button>
            {select}
            <button onClick={filterButtonHandler} title="Применить фильтр">Применить фильтр</button>
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
      onApplyFilter: (payload: {filterColor: string}) => dispatch(applyFilter(payload)),
      onCut: () => dispatch(cut()),
      onCrop: () => dispatch(crop()),
      onCreateCanvas: (payload: {width: number, height: number}) => dispatch(createCanvas(payload))
    }
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);