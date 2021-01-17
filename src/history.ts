import { Editor } from './model';

const undoStack: Array<Editor> = []
const redoStack: Array<Editor> = []

function undo() {
	const editor: Editor = undoStack.pop()!
	redoStack.push(editor)
	return editor
}

function redo() {
	return redoStack.pop()
}

function addToHistory(editor:Editor) {
	undoStack.push(editor)
}