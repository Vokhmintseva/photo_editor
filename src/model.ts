export type FilterType = 'red' | 'green' | 'blue' | 'grey'

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
	//pixelArray: ImageData
}

export type TextObject = EditorObject & {
	type: 'text',
	text: string,
	fontFamily: string,
	fontSize: number,
	color: string,
}

export type ShapeObject = EditorObject & {
	type: 'triangle' | 'rectangle' | 'circle',
	backgroudColor: string,
	borderColor: string,
}

export type Editor = {
	canvas: ImageData,
	selectedObject: TextObject | ShapeObject | SelectedArea | null,
}


//export {FilterType, Point, EditorObject, SelectedArea, TextObject, ShapeObject, Editor}