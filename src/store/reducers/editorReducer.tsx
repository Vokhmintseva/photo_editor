import { SELECT_AREA, WHITEN_AREA, JOIN_SA_WITH_CANVAS, DROP_SA, DESELECT_AREA, ADD_FIGURE, APPLY_FILTER, CUT,
CROP, CREATE_CANVAS, ADD_IMAGE, RESIZE_EDITOR_OBJ, DROP_TEXT_OBJ, SELECT_TEXT_AREA } from '../actions/actionTypes';
import { Point, Editor } from '../../model';
import { selectArea, whitenArea, joinSelectionWithCanvas, dropSelection, cleanCanvas, deSelectArea, addFigure,
applyFilter, cut, crop, createCanvas, addImage, resizeEditorObj, dropTextObj, selectTextArea } from '../../actions';

let editor: Editor = {
    //canvas: {} as ImageData,
    canvas: cleanCanvas(800, 600),
    selectedObject: null,
}

let initialState = {
    editor: {...editor}
}

export default function editorReducer (state = initialState, action: any) {
    switch(action.type) {
        case SELECT_AREA:
            return {
                editor: selectArea(state.editor, action.payload)
            }    
        case WHITEN_AREA:
            return {
                editor: whitenArea(state.editor, action.payload)
            }    
        case JOIN_SA_WITH_CANVAS:
            return {
                editor: joinSelectionWithCanvas(state.editor, action.payload)   
            }    
        case DROP_SA:
            return {
                editor: dropSelection(state.editor, action.payload) 
            }
        case DESELECT_AREA:
            return {
                editor: deSelectArea(state.editor, action.payload)
            }  
        case ADD_FIGURE:
            return {
                editor: addFigure(state.editor, action.payload)
            }  
        case APPLY_FILTER:
            return {
                editor: applyFilter(state.editor, action.payload)
            } 
        case CUT:
            return {
                editor: cut(state.editor, action.payload)
            } 
        case CROP:
            return {
                editor: crop(state.editor, action.payload)
            } 
        case CREATE_CANVAS:
            return {
                editor: createCanvas(state.editor, action.payload)
            }   
        case ADD_IMAGE:
            return {
                editor: addImage(state.editor, action.payload)
            }   
        case RESIZE_EDITOR_OBJ:
            return {
                editor: resizeEditorObj(state.editor, action.payload)
            }   
        case DROP_TEXT_OBJ:
            return {
                editor: dropTextObj(state.editor, action.payload)
            }   
        case SELECT_TEXT_AREA:
            return {
                editor: selectTextArea(state.editor, action.payload)
            }                                                                       
        default:
            return state  
    }
    return state;
}