import React, { useRef, useEffect, useState, useContext }  from 'react';
import {Editor} from '../../model';
import './SelectedObject.css';
import { dispatch } from '../../reducer';
import { dropTextObj, isTextObject, addImage, deSelectArea, resizeEditorObj } from '../../actions';
import { CanvasContext } from '../EditorComponent/EditorComponent';
import { resolve, intention, Intent, setIntention } from '../../intentResolver';
import SelectFontFamily from '../Select/SelectFontFamily';
import SelectFontSize from '../Select/SelectFontSize';
import Slider from './Slider';
import SliderType from './slyderType';

const fonts = ['Roboto', 'Open Sans', 'Montserrat', 'Roboto Condensed', 'Source Sans Pro',
'Oswald', 'Merriweather', 'Noto Sans', 'Yanone Kaffeesatz', 'Caveat'];

interface TextObjProps {
    editor: Editor,
    toggleShowTextArea: () => void,
}

function getInitColor (editor: Editor) {
    return isTextObject(editor.selectedObject) ? editor.selectedObject.color : '#000000';
}

function getInitFontWeight (editor: Editor) {
    return isTextObject(editor.selectedObject) ? editor.selectedObject.fontWeight : 400;
}

function getInitFontStyle (editor: Editor) {
    return isTextObject(editor.selectedObject) ? editor.selectedObject.fontStyle : 'normal';
}

function getInitFontFamily (editor: Editor) {
    return isTextObject(editor.selectedObject) ? editor.selectedObject.fontFamily : 'Times New Roman';
}

function getInitFontSize (editor: Editor) {
    return isTextObject(editor.selectedObject) ? editor.selectedObject.fontSize : 20;
}

function getInitbackgroundColor (editor: Editor) {
    return isTextObject(editor.selectedObject) ? editor.selectedObject.backgroundColor : 'rgba(255, 255, 255, 0.8)';
}

function wrapText(context: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
    var words = text.split(' ');
    var line = '';
    for(var n = 0; n < words.length; n++) {
        let wordMetrics = context.measureText(words[n]);
        let wordLength = wordMetrics.width;
        if (wordLength > maxWidth) 
        {
            if (line !== '')
                words[n] = line + ' ' + words[n];
            let symbols = words[n].split("");  
            let symbolsLine = '';
            for(let i = 0; i < symbols.length; i++) {
                let testSymbolsLine = symbolsLine + symbols[i];
                let symblosMetrics = context.measureText(testSymbolsLine);
                let testSymbolsWidth = symblosMetrics.width; 
                if (testSymbolsWidth > maxWidth && i > 0) {
                    context.fillText(symbolsLine, x, y);
                    symbolsLine = symbols[i];
                    y += lineHeight;
                }
                else {
                    symbolsLine = testSymbolsLine;
                }
            }
            line = symbolsLine + ' ';    
        }
        else {
            let testLine = line + words[n] + ' ';
            let metrics = context.measureText(testLine);
            let testWordWidth = metrics.width;
            if (testWordWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }
    context.fillText(line, x, y);
    }
}

const TextObject = (props: TextObjProps) => {

    let canvas: HTMLCanvasElement | null = useContext(CanvasContext);
    const [isMousePressed, setIsMousePressed] = useState(false);
    const [offset, setOffset] = useState({x: 0, y: 0});
    const [position, setPosition] = useState(() => calculateInitPos(props.editor));
    const [text, setText] = useState('');
    const [textColor, setTextColor] = useState(() => getInitColor(props.editor));
    const [fontWeight, setFontWeight] = useState(() => getInitFontWeight(props.editor));
    const [fontStyle, setFontStyle] = useState(() => getInitFontStyle(props.editor));
    const [fontFamily, setFontFamily] = useState(() => getInitFontFamily(props.editor));
    const [fontSize, setFontSize] = useState(() => getInitFontSize(props.editor));
    const [backgroundColor, setBackgroundColor] = useState(() => getInitbackgroundColor(props.editor));

    let textAreaRef = useRef(null);
    
    function calculateInitPos (editor: Editor) {
        const canvasCoords = canvas!.getBoundingClientRect();
        
        return {
            x: editor.selectedObject!.position.x,
            y: canvasCoords.top + editor.selectedObject!.position.y,
            width: editor.selectedObject!.w,
            height: editor.selectedObject!.h,
        }
    }

    const selectFontFamily = <SelectFontFamily
        label="Шрифт"
        value={fontFamily}
        onChange={onFontFamilyChangeHandler}
        options={fonts}
    />

    const selectFontSize = <SelectFontSize
        label="Размер шрифта"
        value={fontSize}
        onChange={onFontSizeChangeHandler}
    />

    function onChangeSize(x: number, y: number, width: number, height: number) {
        setPosition({x, y, width, height});
        dispatch(resizeEditorObj, {newPoint: {x, y}, newWidth: width, newHeight: height});
    }

    function onFontFamilyChangeHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setFontFamily(event.target.value);
    }

    function onFontSizeChangeHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setFontSize(Number(event.target.value));
    }
 
    function onTextAreaChangeHandler(event: React.ChangeEvent<HTMLTextAreaElement>) {
        setText(event.target.value);
    }

    function onChangeTextColorHandler(event: React.ChangeEvent<HTMLInputElement>) {
        setTextColor(event.target.value);
    }

    function onBoldFontButttonHandler(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        fontWeight == 400 ? setFontWeight(700) : setFontWeight(400);
    }

    function onItalicsFontButttonHandler(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        fontStyle == 'normal' ? setFontStyle('italic') : setFontStyle('normal');
    }

    function onApplyTextSelectionHandler(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        var lineHeight = 1.2 * fontSize;
        var ctx = canvas!.getContext("2d");
        const canvasCoords = canvas!.getBoundingClientRect();
        ctx!.fillStyle = textColor;
        ctx!.font = fontWeight + " " + fontStyle + " " + fontSize + "px " + fontFamily;
        wrapText(ctx!, text, position.x, position.y - canvasCoords.top + fontSize, props.editor.selectedObject!.w, lineHeight);
        let newImgData = ctx!.getImageData(0, 0, canvas!.width, canvas!.height);
        dispatch(addImage, {newImage: newImgData});
        dispatch(deSelectArea, {});
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
        const textAreaElem: HTMLTextAreaElement = textAreaRef.current!;
        const textAreaCoords = textAreaElem.getBoundingClientRect();
        const canvasCoords = canvas!.getBoundingClientRect();
        if (left < canvasCoords.left) {
            left = canvasCoords.left;
        }
        if (left + textAreaCoords.width > canvasCoords.right) {
            left = canvasCoords.right - textAreaCoords.width;
        }
        if (top < canvasCoords.top) {
            top = canvasCoords.top;
        }
        if (top + textAreaCoords.height > canvasCoords.bottom) {
            top = Math.max(canvasCoords.bottom - textAreaCoords.height, canvasCoords.top);
        }
        return {left, top}
    }
    
    const onMouseMoveTextObjHandler = function (event: any) {
        if (isMousePressed) {
            const adjustedCoords = adjustCoords(event.clientX - offset.x, event.clientY - offset.y)
            setPosition({x: adjustedCoords.left, y: adjustedCoords.top, width: position.width, height: position.height});
        }
    }

    const onMouseUpTextObjHandler = function (event: any) {
        if (!isMousePressed) return;
        setIntention(Intent.WorkWithTextObj);
        console.log('TEXT in onMouseUpTextObjHandler function');
        const canvasCoords = canvas!.getBoundingClientRect();
        const adjustedCoords = adjustCoords(event.clientX - offset.x, event.clientY - offset.y);
        setPosition({x: adjustedCoords.left, y: adjustedCoords.top, width: position.width, height: position.height});
        dispatch(dropTextObj, {where: {x: adjustedCoords.left, y: adjustedCoords.top - canvasCoords.top}});
        setIsMousePressed(false);
    }

    useEffect(() => { 
        const textAreaElem: HTMLCanvasElement = textAreaRef.current!;
        textAreaElem.addEventListener('mousedown', onMouseDownTextObjHandler);
        document.addEventListener('mousemove', onMouseMoveTextObjHandler);
        document.addEventListener('mouseup', onMouseUpTextObjHandler);
        return () => {
            textAreaElem.removeEventListener('mousedown', onMouseDownTextObjHandler);
            document.removeEventListener('mousemove', onMouseMoveTextObjHandler);
            document.removeEventListener('mouseup', onMouseUpTextObjHandler);

        };
    });  

    useEffect(() => { 
        const canvasCoords = canvas!.getBoundingClientRect();
        setPosition({
            x: props.editor.selectedObject!.position.x,
            y: props.editor.selectedObject!.position.y + canvasCoords.top,
            width: props.editor.selectedObject!.w,
            height: props.editor.selectedObject!.h,
        });
    }, []);
 
    return (
        <div>
            <div className="textBar">
                <div>
                    <label>Цвет</label>
                    <input
                        type='color'
                        onChange={onChangeTextColorHandler}
                    ></input>
                </div>
                <div>
                    <button
                        className="boldFontButtton"
                        onClick={onBoldFontButttonHandler}
                        title="Толщина текста"
                    >B</button>
                    <button
                        className="italicsFontButtton"
                        onClick={onItalicsFontButttonHandler}
                        title="Стиль текста"
                    >I</button>
                </div>
                <div>
                    {selectFontFamily}
                </div>
                <div>
                    {selectFontSize}
                </div>
                {/* <div>
                    <label>Заливка</label>
                    <input
                        type='color'
                        onChange={onChangeBackgroundColorHandler}
                    ></input>
                </div> */}
                <div>
                    <button 
                        className="applyBtn"
                        onClick={onApplyTextSelectionHandler}
                        title="Добавить текст"
                    >    
                    </button>
                    <button 
                        className="abolishBtn"
                        onClick={props.toggleShowTextArea}
                        title="Отмена"></button>
                </div>
            </div>
            
            <textarea
                ref={textAreaRef}
                onChange={onTextAreaChangeHandler}
                value={text}
                className="textField"    
                autoFocus
                style={{
                    top: `${position.y}px`,
                    left: `${position.x}px`,
                    height: `${position.height}px`,
                    width: `${position.width}px`,
                    color: `${textColor}`,
                    fontStyle: `${fontStyle}`,
                    fontWeight: fontWeight == 400 ? 400 : 700,
                    fontFamily: `${fontFamily}, sans-serif`,
                    fontSize: `${fontSize}`+'px',
                    backgroundColor: `${backgroundColor}`
                }}
            />

            <Slider
                pos={position}
                //editor={props.editor}
                changeSize={onChangeSize}
                type={SliderType.LeftTop}
            />  
            <Slider
                pos={position}
                //editor={props.editor}
                changeSize={onChangeSize}
                type={SliderType.RightTop}
            />  
            <Slider
                pos={position}
                //editor={props.editor}
                changeSize={onChangeSize}
                type={SliderType.LeftBottom}
            />  
            <Slider
                pos={position}
                //editor={props.editor}
                changeSize={onChangeSize}
                type={SliderType.RightBottom}
            />       
        </div>
    ) 
}

export default TextObject;