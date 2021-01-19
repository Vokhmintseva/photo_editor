//это функции, которые выдают определенный action
import { SELECT_AREA, WHITEN_AREA, JOIN_SA_WITH_CANVAS, DROP_SA, DESELECT_AREA, ADD_FIGURE, APPLY_FILTER, CUT,
CROP, CREATE_CANVAS, ADD_IMAGE, RESIZE_EDITOR_OBJ, DROP_TEXT_OBJ, SELECT_TEXT_AREA, DROP_SHAPE_OBJ, SET_FIGURE_BACKGROUND_COLOR,
SET_FIGURE_BORDER_COLOR, ROLL, RESIZE } from './actionTypes';
import { Editor, Point, Figure } from '../../model';


export function selectArea(payload: {startPoint: Point, endPoint: Point}) {
    return {
        type: SELECT_AREA,
        payload: payload
    }
}

export function whitenArea() {
    return {
        type: WHITEN_AREA,
        payload: {}
    }
}

export function joinSelectionWithCanvas() {
    return {
        type: JOIN_SA_WITH_CANVAS,
        payload: {}
    }
}

export function dropSelection(payload: {where: Point}) {
    return {
        type: DROP_SA,
        payload: payload
    }
}

export function deselectArea() {
    return {
        type: DESELECT_AREA,
        payload: {}
    }
}

export function addFigure(payload: {figureType: Figure}) {
    return {
        type: ADD_FIGURE,
        payload: payload
    }
}
export function applyFilter(payload: {filterColor: string}) {
    return {
        type: APPLY_FILTER,
        payload: payload
    }
}

export function crop() {
    return {
        type: CROP,
        payload: {}
    }
}

export function cut() {
    return {
        type: CUT,
        payload: {}
    }
}

export function createCanvas(payload: {width: number, height: number}) {
    return {
        type: CREATE_CANVAS,
        payload: payload
    }
}

export function addImage(payload: {newImage: ImageData}) {
    return {
        type: ADD_IMAGE,
        payload: payload
    }
}    

export function resizeEditorObj(payload: {newPoint: Point, newWidth: number, newHeight: number}) {
    return {
        type: RESIZE_EDITOR_OBJ,
        payload: payload
    }
}

export function dropTextObj(payload: {where: Point}) {
    return {
        type: DROP_TEXT_OBJ,
        payload: payload
    }
}    

export function selectTextArea(payload: {startPoint: Point, endPoint: Point}) {
    return {
        type: SELECT_TEXT_AREA,
        payload: payload
    }
}    

export function dropShapeObj(payload: {where: Point}) {
    return {
        type: DROP_SHAPE_OBJ,
        payload: payload
    }
}    

export function setFigureBorderColor(payload: {newColor: string}) {
    return {
        type: SET_FIGURE_BORDER_COLOR,
        payload: payload
    }
}    

export function setFigureBackgroundColor(payload: {newColor: string}) {
    return {
        type: SET_FIGURE_BACKGROUND_COLOR,
        payload: payload
    }
}    

export function rollEditor(payload: {newEditor: Editor}) {
    return {
        type: ROLL,
        payload: payload
    }
}    

export function resizeCanvas(payload: {newWidth: number, newHeight: number}) {
    return {
        type: RESIZE,
        payload: payload
    }
}   