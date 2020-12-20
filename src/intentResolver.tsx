import { Editor } from "./model";

export enum Intent {
    Nothing,
    Selecting,
    Dragging,
    Dropping
}

export let intention: Intent = Intent.Nothing;

function isInSelectedAreaClick(editor: Editor, mouseCoords: {x: number, y: number}, bounds: DOMRect): Boolean {
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
    if (editor.selectedObject) {
        if (isInSelectedAreaClick(editor, mouseCoords, bounds)) {
            intention = Intent.Dragging;
        } else {
            intention = Intent.Dropping;
        }
    } else {
        intention = Intent.Selecting;
    }
}
//export function isSelectedAreaMoving 