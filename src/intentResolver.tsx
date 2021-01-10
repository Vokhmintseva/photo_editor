import { Editor } from "./model";
import { isSelectedArea, isTextObject } from './actions';

export enum Intent {
    Nothing, //0
    SelectingSA, //1
    DraggingSA,  //2
    DroppingSA, // 3
    SelectingTextObj, //4
    DraggingTextObj, //5
    DroppingTextObj, //6
    WorkWithTextObj, //7
    DraggingFigure, //8
    DroppingFigure //9
}

export let intention: Intent = Intent.Nothing;

export function setIntention(int: Intent) {
    intention = int;
}

function isInSelectedObjClick(editor: Editor, mouseCoords: {x: number, y: number}, bounds: DOMRect): Boolean {
    const selStartX = editor.selectedObject?.position.x!;
    const selStartY = bounds.top + editor.selectedObject?.position.y!;  
    const selEndX = selStartX + editor.selectedObject?.w!;
    const selEndY = selStartY + editor.selectedObject?.h!;
    return (
        mouseCoords.x >= selStartX &&
        mouseCoords.x <= selEndX &&
        mouseCoords.y >= selStartY &&
        mouseCoords.y <= selEndY
    )
}

export function resolve(editor: Editor, mouseCoords: {x: number, y: number}, bounds: DOMRect): void {
    
    if (editor.selectedObject && isTextObject(editor.selectedObject)) {
        if (isInSelectedObjClick(editor, mouseCoords, bounds)) {
            intention = Intent.DraggingTextObj;
        } else {
            intention = Intent.DroppingTextObj;
        }
        return;
    }
    
    if (intention == Intent.SelectingTextObj) return;

    if (editor.selectedObject && isSelectedArea(editor.selectedObject)) {
        if (isInSelectedObjClick(editor, mouseCoords, bounds)) {
            intention = Intent.DraggingSA;
        } else {
            intention = Intent.DroppingSA;
        }
    } else {
        intention = Intent.SelectingSA;
    }


}