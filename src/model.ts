export enum Figure {
	triangle,
	rectangle,
	circle
}

export type Point = {
	x: number,
	y: number,
}

export type EditorObject = {
	position: Point,
	w: number,
	h: number,
}

export type SelectedArea = EditorObject & {
	type: 'selectedArea',
	pixelArray: ImageData
}

export type TextObject = EditorObject & {
	type: 'text',
	text: string,
	fontFamily: string,
	fontSize: number,
	color: string,
	fontWeight: number,
	fontStyle: string,
	textDecoration: string,
	backgroundColor: string
}

export type ShapeObject = EditorObject & {
	type: Figure,
	backgroundColor: string,
	borderColor: string,
}

export type Editor = {
	canvas: ImageData,
	selectedObject: TextObject | ShapeObject | SelectedArea | null,
}


//export {FilterType, Point, EditorObject, SelectedArea, TextObject, ShapeObject, Editor}