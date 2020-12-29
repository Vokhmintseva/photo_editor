import React, {useRef, useEffect, useState, useContext}  from 'react';
import {Editor} from '../../model';
import './SelectedObject.css';
import {dispatch} from '../../reducer';
import {dropTextObj, isTextObject} from '../../actions';
import {CanvasContext} from '../EditorComponent/EditorComponent';
import { resolve, intention, Intent } from '../../intentResolver';
import SelectFont from '../Select/SelectFont';

const fonts = ['Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Franklin Gothic Medium', 'Georgia',
    'Impact', 'Lucida Console', 'Lucida Sans Unicode', 'Microsoft Sans Serif', 'Palatino Linotype', 'Sylfaen',
    'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana' 
]

interface TextObjProps {
    editor: Editor,
}

function getInitColor (editor: Editor) {
    return isTextObject(editor.selectedObject) ? editor.selectedObject.color : '#000000';
}

function getInitFontWeight (editor: Editor) {
    return isTextObject(editor.selectedObject) ? editor.selectedObject.fontWeight : 'normal';
}

function getInitFontStyle (editor: Editor) {
    return isTextObject(editor.selectedObject) ? editor.selectedObject.fontStyle : 'normal';
}

function getInitTextDecor (editor: Editor) {
    return isTextObject(editor.selectedObject) ? editor.selectedObject.textDecoration : 'none';
}

function getInitFontFamily (editor: Editor) {
    return isTextObject(editor.selectedObject) ? editor.selectedObject.fontFamily : 'Times New Roman';
}

const TextObject = (props: TextObjProps) => {
    console.log('rendering Text Obj');
    
    let canvas: HTMLCanvasElement | null = useContext(CanvasContext);
    const borderWidth = 1;
    //const canvasCoords = canvas!.getBoundingClientRect();
    function calculateInitPos (props: TextObjProps) {
        const canvasCoords = canvas!.getBoundingClientRect();
        return {
            x: props.editor.selectedObject!.position.x,
            y: canvasCoords.top + props.editor.selectedObject!.position.y
        }
    }

    const [isMousePressed, setIsMousePressed] = useState(false);
    const [offset, setOffset] = useState({x: 0, y: 0});
    const [position, setPosition] = useState(() => {return calculateInitPos(props)});
    const [text, setText] = useState('');
    const [color, setColor] = useState(() => getInitColor(props.editor));
    const [fontWeight, setFontWeight] = useState(() => getInitFontWeight(props.editor));
    const [fontStyle, setFontStyle] = useState(() => getInitFontStyle(props.editor));
    const [textDecoration, setTextDecoration] = useState(() => getInitTextDecor(props.editor));
    const [fontFamily, setFontFamily] = useState(() => getInitFontFamily(props.editor));

    let inputRef = useRef(null);

    const select = <SelectFont
        label="Шрифт"
        value={fontFamily}
        onChange={onFontFamilyChangeHandler}
        options={fonts}
    />

    function onFontFamilyChangeHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setFontFamily(event.target.value);
    }
 
    function onTextAreaChangeHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setText(event.target.value);
    }

    function onChangeColorHandler(event: React.ChangeEvent<HTMLInputElement>) {
        setColor(event.target.value);
        console.log(event.target.value);
    }

    function onBoldFontButttonHandler(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        fontWeight == 'normal' ? setFontWeight('bold') : setFontWeight('normal');
    }

    function onItalicsFontButttonHandler(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        fontStyle == 'normal' ? setFontStyle('italic') : setFontStyle('normal');
    }

    function onTextDecorButttonHandler(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        textDecoration == 'none' ? setTextDecoration('underline') : setTextDecoration('none');
    }
    
    function onMouseDownHandler(event: any) {
        const canvasCoords = canvas!.getBoundingClientRect();
        if (event.clientY < canvasCoords.top) return;
        resolve(props.editor, {x: event.clientX, y: event.clientY}, canvasCoords);
        if (intention !== Intent.DroppingTextObj) return;
        console.log('TEXT in onMouseDownHandler function');
        if (isTextObject(props.editor.selectedObject)) {
            console.log("слияние с канвасом");
            //dispatch(joinSelectionWithCanvas, {});
        }
    }
    
    function onMouseDownTextObjHandler(event: any) {
        const canvasCoords = canvas!.getBoundingClientRect();
        resolve(props.editor, {x: event.clientX, y: event.clientY}, canvasCoords);
        if (intention !== Intent.DraggingTextObj) return;
        console.log('TEXT in onMouseDownTextObjHandler function');
        setOffset({x: event.clientX - position.x!, y: event.clientY - position.y!});
        setIsMousePressed(true);
    }
    
    const adjustCoords = function (left: number, top: number): {left: number, top: number} {
        const inputElem: HTMLCanvasElement = inputRef.current!;
        const canvasCoords = canvas!.getBoundingClientRect();
        if (left < canvasCoords.left) {
            left = canvasCoords.left;
        }
        if (left + inputElem.width > canvasCoords.right) {
            left = canvasCoords.right - inputElem.width;
        }
        if (top < canvasCoords.top) {
            top = canvasCoords.top - borderWidth;
        }
        if (top + inputElem.height > canvasCoords.bottom) {
            top = Math.max(canvasCoords.bottom - inputElem.height, canvasCoords.top);
        }
        return {left, top}
    }
    
    const onMouseMoveTextObjHandler = function (event: any) {
        if (isMousePressed) {
            const adjustedCoords = adjustCoords(event.clientX - offset.x, event.clientY - offset.y)
            setPosition({x: adjustedCoords.left, y: adjustedCoords.top});
            //event.preventDefault();
        }
    }

    const onMouseUpTextObjHandler = function (event: any) {
        if (!isMousePressed) return;
        console.log('TEXT in onMouseUpTextObjHandler function');
        const canvasCoords = canvas!.getBoundingClientRect();
        const adjustedCoords = adjustCoords(event.clientX - offset.x, event.clientY - offset.y);
        setPosition({x: adjustedCoords.left, y: adjustedCoords.top});
        dispatch(dropTextObj, {where: {x: adjustedCoords.left, y: adjustedCoords.top - canvasCoords.top}});
        setIsMousePressed(false);

    }

    useEffect(() => { 
        const inputElem: HTMLCanvasElement = inputRef.current!;
        inputElem.addEventListener('mousedown', onMouseDownTextObjHandler);
        document.addEventListener('mousedown', onMouseDownHandler);
        document.addEventListener('mousemove', onMouseMoveTextObjHandler);
        document.addEventListener('mouseup', onMouseUpTextObjHandler);
        console.log('fontStyle', fontStyle);
        console.log('fontWeight', fontWeight);
        console.log('textDecoration', textDecoration);
        //функция сработает когда произойдет следующая перерисовка
        return () => {
            inputElem.removeEventListener('mousedown', onMouseDownTextObjHandler);
            document.removeEventListener('mousedown', onMouseDownHandler);
            document.removeEventListener('mousemove', onMouseMoveTextObjHandler);
            document.removeEventListener('mouseup', onMouseUpTextObjHandler);
        };
    });  
    
    // useEffect(() => {
    //     const inputElem: HTMLCanvasElement = inputRef.current!;
    //     inputElem.style.top = position.y! - borderWidth * 2 + 'px';
    //     inputElem.style.left = position.x! - borderWidth * 2 + 'px';
    //     inputElem.setAttribute('width', props.editor.selectedObject!.w.toString());
    //     inputElem.setAttribute('height', props.editor.selectedObject!.h.toString());
    // }, []);
 
    return (
        <div>
            <div>
                <label>Цвет</label>
                <input
                    type='color'
                    onChange={onChangeColorHandler}
                ></input>
                <button
                    className="boldFontButtton"
                    onClick={onBoldFontButttonHandler}
                >B</button>
                <button
                    className="italicsFontButtton"
                    onClick={onItalicsFontButttonHandler}
                >I</button>
                <button 
                    className="underlinedFontButtton"
                    onClick={onTextDecorButttonHandler}
                >U</button>
                {select}
            </div>
            
            <textarea
                ref={inputRef}
                onChange={onTextAreaChangeHandler}
                value={text}
                className="textField"    
                autoFocus
                style={{
                    top: `${position.y}px`,
                    left: `${position.x}px`,
                    height: `${props.editor.selectedObject?.h}px`,
                    width: `${props.editor.selectedObject?.w}px`,
                    color: `${color}`,
                    fontStyle: `${fontStyle}`,
                    textDecoration: `${textDecoration}`,
                    fontWeight: fontWeight == 'normal' ? 'normal' : 'bold',
                    fontFamily: `${fontFamily}`
                }}
            />
        </div>
    ) 
}

export default TextObject;

//AIzaSyDQvKG1NkhMPOvohmso25A2x_nBW62LOY0