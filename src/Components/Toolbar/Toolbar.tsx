import React, { useState, useLayoutEffect, useRef } from 'react'
import { Editor, Figure } from '../../model'
import './Toolbar.css';
import SelectFilter from '../Select/SelectFilter';
import OpenButton from '../Buttons/OpenButton';
import SaveButton from '../Buttons/SaveButton';
import UndoButton from '../Buttons/UndoButton';
import RedoButton from '../Buttons/RedoButton';
import ResizeBtn from '../Buttons/ResizeBtn';
import { isSelectedArea, isShapeObject } from '../../actions';
import { deselectArea, crop, cut, createCanvas, applyFilter, addFigure } from '../../store/actions/Actions';
import { connect } from 'react-redux';
import { addToHistory } from '../../history';
import { Intention } from '../../Intentions';

interface ToolbarProps {
    editor: Editor,
    //onShowFigureClickHandler: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
    //onShowNewFigure: (should: boolean) => void,
    onDeselectArea: () => void,
    onApplyFilter: (payload: {filterColor: string}) => void,
    onCut: () => void,
    onCrop: () => void,
    onCreateCanvas: (payload: {width: number, height: number}) => void,
    onSetIntention: (intent: Intention) => void,
    onSetFigure: (figure: Figure) => void,
    onAddFigure: (payload: {figureType: Figure}) => void
}

function Toolbar(props: ToolbarProps) {
    let toolbarRef = useRef(null);
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
            props.onSetIntention(Intention.SelectArea);
        } 
    }

    const onFigureClicked = (event: any) => {
        const newFigure: Figure = event.target.id;
        props.onSetFigure(newFigure);
        props.onSetIntention(Intention.HandleSelectedObject);
        console.log('dispatch EditorComponent addFigure');
        addToHistory(props.editor);
        props.onAddFigure({figureType: newFigure});
    }

    const select = <SelectFilter
        label="Выберите фильтр"
        value={filter}
        onChange={selectFilterHandler}
        options={[
            {text: "серый", value: "grey"},
            {text: "красный", value: "red"},
            {text: "зеленый", value: "green"},
            {text: "синий", value: "blue"},
        ]}
    />
    //let canvas: HTMLCanvasElement | null = useContext(CanvasContext);

    useLayoutEffect(() => {
        const toolbar: HTMLCanvasElement = toolbarRef.current!;
        toolbar.style.width = props.editor.canvas.width + 'px';
    })

    return (
        <div className='toolbar' ref={toolbarRef}>
            <OpenButton />
            <button onClick={e => {props.onSetIntention(Intention.BrowseRemoteGallery); props.onDeselectArea();}} title="Поиск изображений" className="remoteImgBtn" />
            <SaveButton />
            <UndoButton onSetIntention={props.onSetIntention}/>
            <RedoButton onSetIntention={props.onSetIntention}/>
            <button onClick={onClearAllHandler} title="Новый холст" className="newCanvas_btn"/>
            {select}
            <button onClick={filterButtonHandler} title="Применить фильтр" className="filterBtn"/>
            <button onClick={e => {props.onSetIntention(Intention.TakePhoto); props.onDeselectArea()}} className="webCamBtn" title="Снимок с веб-камеры"/>
            <button 
                ref={showTextBtnRef}
                title="Текст"
                onClick={e => props.onSetIntention(Intention.SelectTextObj)}
                className="textBtn"
            />
            {!(props.editor.selectedObject && (isShapeObject(props.editor.selectedObject) || isSelectedArea(props.editor.selectedObject))) &&
            <div className="ShapeBar">
                <button 
                    className="circleBtn"
                    title="Круг"
                    id="circle"
                    onClick={onFigureClicked}
                ></button>
                <button 
                    className="rectangleBtn"
                    title="Прямоугольник"
                    id="rectangle"
                    onClick={onFigureClicked}
                ></button>
                <button 
                    className="triangleBtn"
                    title="Треугольник"
                    id="triangle"
                    onClick={onFigureClicked}
                ></button>
            </div>  
            }
            {props.editor.selectedObject && isSelectedArea(props.editor.selectedObject) &&
            <div>
            <button onClick={onClearSelectionHandler} className="cutBtn" />
            <button onClick={onSelectionCropHandler} className="cropBtn" />
            </div>
            }
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
      onCreateCanvas: (payload: {width: number, height: number}) => dispatch(createCanvas(payload)),
      onAddFigure: (payload: {figureType: Figure}) => dispatch(addFigure(payload)),
    }
  }
  
export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);