import { Editor } from './model';

export const undoStack: Array<Editor> = []
export const redoStack: Array<Editor> = []

export function undo() {
	const editor: Editor = undoStack.pop()!;
	redoStack.push(editor);
	return editor;
}

export function redo() {
	return redoStack.pop();
}

export function addToHistory(editor:Editor) {
	undoStack.push(editor);
}