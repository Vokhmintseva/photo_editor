import {Figure, Point, EditorObject, SelectedArea, TextObject, ShapeObject, Editor} from './model';
import EditorComponent from './Components/EditorComponent/EditorComponent';
const defaultCanvasWidth = 800;
const defaultCanvasHeight = 600;
//const defaultPxArrLength = 1920000;

export function cleanCanvas(width: number = defaultCanvasWidth, height: number = defaultCanvasHeight): ImageData {
	let pixelArrayLength: number = width * height * 4;
	let bufferArray = new Uint8Array(pixelArrayLength);
	//crypto.getRandomValues(buffer);
	for (let i: number = 0; i < pixelArrayLength; i += 4) {
		bufferArray[i] = 255; 
		bufferArray[i + 1] = 201;
		bufferArray[i + 2] = 245;
		bufferArray[i + 3] = 255;
	}
	return new ImageData(new Uint8ClampedArray(bufferArray.buffer), width, height);
}

export function createCanvas(editor: Editor, payload: {width: number, height: number}): Editor {
	return {
		...editor,
		canvas: cleanCanvas(payload.width, payload.height),
		selectedObject: null,
	}
}

export function resizeCanvas(editor: Editor, payload: {newWidth: number, newHeight: number}): Editor {
	return {
		...editor,
		canvas: {
			...editor.canvas,
			width: payload.newWidth,
			height: payload.newHeight
		}
	}
}

export function resizeEditorObj(editor: Editor, payload: {newPoint: Point, newWidth: number, newHeight: number}): Editor {
	if(editor.selectedObject) {
		return {
			...editor,
			selectedObject: {
				...editor.selectedObject,
				position: payload.newPoint,	
				w: payload.newWidth,
				h: payload.newHeight
			}
		} 
	} else {
		return editor;
	}
}

function putImgDataOnCanvas (editor: Editor): ImageData {
	let arrayOfIndexesToChange = getIndexes(editor);
	let newPxArray: Uint8ClampedArray = editor.canvas.data.slice();
	if (isSelectedArea(editor.selectedObject)) {
		for (let i: number = 0; i < arrayOfIndexesToChange.length; i++) {
			newPxArray[arrayOfIndexesToChange[i]] = editor.selectedObject.pixelArray.data[i]; 
		}
	}
	return new ImageData(newPxArray, editor.canvas.width, editor.canvas.height);
}

export function joinSelectionWithCanvas(editor: Editor): Editor {
	return {
		...editor,
		canvas: putImgDataOnCanvas(editor),
		selectedObject: null,
	}
}


// export function resizeCanvas(editor: Editor, newWidth: number, newHeight: number): Editor {
// 	return {
// 		...editor,
// 		canvas: {
// 			...editor.canvas,
// 			width: newWidth,
// 			height: newHeight
// 		}
// 	}
// }

export function addImage(editor: Editor, payload: {newImage: ImageData}): Editor {
	return {
		...editor,
		canvas: payload.newImage,
		selectedObject: null,
	}
}



// проверка, картинка больше канваса или нет
// export function isImageNotBiggerThenCanvas(editor: Editor, image: HTMLImageElement): boolean {
// 	return (image.width <= editor.canvas.width && image.height <= editor.canvas.height)
// }

// вставка картинки на канвас
// export function pasteImage(editor: Editor, newImage: HTMLImageElement, ctx: CanvasRenderingContext2D): ImageData {
// 	ctx.drawImage(newImage, 0, 0);
// 	return ctx.getImageData(0, 0, editor.canvas.width, editor.canvas.height);
// }

// export function addImage(editor: Editor, newImage: HTMLImageElement, ctx: CanvasRenderingContext2D): Editor {
// 	return {
// 		...editor,
// 		canvas: pasteImage(editor, newImage, ctx)
// 	}
// }

//удалить холст
export function removeCanvas(editor: Editor): Editor {
	return {
		...editor,
		canvas: cleanCanvas(editor.canvas.width, editor.canvas.height),
		selectedObject: null,
	}
}

export function selectArea(editor: Editor, payload: {startPoint: Point, endPoint: Point}): Editor {
	
	return {
		...editor,
		selectedObject: {
			type: 'selectedArea',
			pixelArray: getImageDataByCoords(editor, payload.startPoint, payload.endPoint), 
			position: {
				x: Math.min(payload.startPoint.x, payload.endPoint.x),
				y: Math.min(payload.startPoint.y, payload.endPoint.y)
			},
			w: Math.abs(payload.startPoint.x - payload.endPoint.x), 
			h: Math.abs(payload.startPoint.y - payload.endPoint.y),
			
		},
		canvas: makeSelectionBeTransparent(editor, getIndexes(editor)), 
	}
}

export function selectTextArea(editor: Editor, payload: {startPoint: Point, endPoint: Point}): Editor {
	return {
		...editor,
		selectedObject: {
			type: 'text',
			position: {
				x: Math.min(payload.startPoint.x, payload.endPoint.x),
				y: Math.min(payload.startPoint.y, payload.endPoint.y)
			},
			w: Math.abs(payload.startPoint.x - payload.endPoint.x), 
			h: Math.abs(payload.startPoint.y - payload.endPoint.y),
			text: '',
			fontFamily: 'Roboto',
			fontSize: 20,
			color: '#000000',
			fontWeight: 400,
			fontStyle: 'normal',
			textDecoration: 'none',
			backgroundColor: 'rgba(255, 255, 255, 0.8)'
		}
	}
}

//снять выделение
export function deSelectArea(editor: Editor, payload: {}): Editor {
	return {
		...editor,
		selectedObject: null
	}
}

export function addText(editor: Editor, newText: TextObject): Editor {
	return {
		...editor,
		selectedObject: newText,
	}
}

/**User defined Type Guards */
export function isTextObject(editorObj: any): editorObj is TextObject {
	return (editorObj.type == 'text')
}

export function isShapeObject(editorObj: any): editorObj is ShapeObject {
	return (editorObj.type == 'triangle' || editorObj.type == 'rectangle' || editorObj.type == 'circle')
} 

export function isSelectedArea(editorObj: any): editorObj is SelectedArea {
	return (editorObj.type == 'selectedArea')
}

export function setTextColor(editor: Editor, newTextColor: string): Editor {
	if (isTextObject(editor.selectedObject)) {
		return {
			...editor,
			selectedObject: {
				...editor.selectedObject,
				  color: newTextColor,	
			}
		}
	} else {
		return editor
	}
}

export function setTextSize(editor: Editor, newTextSize: number): Editor {
	if (isTextObject(editor.selectedObject)) {
		return {
			...editor,
			selectedObject: {
				...editor.selectedObject,
				  fontSize: newTextSize,	
			}
		}
	} else {
		return editor;
	}
}

//переместить выделенную область
export function dropSelection(editor: Editor, payload: {where: Point}): Editor {
	if (isSelectedArea(editor.selectedObject)) {
		return {
			...editor,
			selectedObject: {
				...editor.selectedObject,
				position: payload.where,
			}
		}
	} else {
		return editor;
	}
}

//переместить выделенную область
export function dropTextObj(editor: Editor, payload: {where: Point}): Editor {
	if (isTextObject(editor.selectedObject)) {
		return {
			...editor,
			selectedObject: {
				...editor.selectedObject,
				position: payload.where,
			}
		}
	} else {
		return editor;
	}
}

//получить индекс элемента в массиве Unit8ClampedArray, зная его координаты на канвасе
export function getPxArrIndex(editor: Editor, p: Point): number {
	let x: number = p.x;
	let y: number = p.y;
	let canvasWidth: number = editor.canvas.width;
	let index: number = y * 4 * canvasWidth + x * 4; 
	return index;
}

export function getImageDataByCoords(editor: Editor, startPoint: Point, endPoint: Point): ImageData  {
	let selectionWidth: number = endPoint.x - startPoint.x;
	let selectionHeight: number = endPoint.y - startPoint.y;
	let pixelArrayLength: number = selectionWidth * selectionHeight * 4;
	let bufferArray = new Uint8Array(pixelArrayLength);
	let k: number = 0; 
	for (let y: number = startPoint.y; y < endPoint.y; y++) {
		for (let x: number = startPoint.x; x < endPoint.x; x++) {
			let index: number = getPxArrIndex(editor, {x, y})
			for (let i = index; i < index + 4; i++) {
				bufferArray[k] = editor.canvas.data[i];
				k++;
			}
		}
	}
	return new ImageData(new Uint8ClampedArray(bufferArray.buffer), selectionWidth, selectionHeight);
}


//получить выделенную область канваса в виде ImageData
export function getImageDataOfSelectedArea(editor: Editor): ImageData  {
	let selectedObj: EditorObject = editor.selectedObject!;
	let startX: number = selectedObj.position.x - 1;
	let startY: number = selectedObj.position.y - 1;
	let endY: number = startY + selectedObj.h;
	let endX: number = startX + selectedObj.w;
	let selectionWidth: number = selectedObj.w;
	let selectionHeight: number = selectedObj.h;
	let pixelArrayLength: number = selectionWidth * selectionHeight * 4;
	let bufferArray = new Uint8Array(pixelArrayLength);
	
	let k: number = 0; 
	for (let y: number = startY; y < endY; y++) {
		for (let x: number = startX; x < endX; x++) {
			let index: number = getPxArrIndex(editor, {x, y})
			for (let i = index; i < index + 4; i++) {
				bufferArray[k] = editor.canvas.data[i];
				k++;
			}
		}
	}
	return new ImageData(new Uint8ClampedArray(bufferArray.buffer), selectionWidth, selectionHeight);
	//} 
	
}




//получить массив индексов элементов в массиве Unit8ClampedArray канваса для пикселей, попавших в выделенную область
export function getIndexes(editor: Editor): Array<number> {
	let arr: Array<number> = [];

	
	if (editor.selectedObject !== null) {
		let startX: number = editor.selectedObject!.position.x;
		let startY: number = editor.selectedObject!.position.y;
		let endY: number = startY + editor.selectedObject!.h;
		let selectionWidth: number = editor.selectedObject!.w; 
		let k: number = 0;
		for (let i: number = startY; i < endY; i++) {
			let startRowIndex: number = getPxArrIndex(editor, {x: startX, y: i});
			for (let j: number = startRowIndex; j < startRowIndex + selectionWidth * 4; j++) {
				arr[k] = j;
				k++;
			}
		}
	}
	return arr;
}

//сделать прозрачной выделенную область канваса
export function makeSelectionBeTransparent(editor: Editor, arr: Array<number>): ImageData {
	let newPxArray: Uint8ClampedArray = editor.canvas.data.slice();
	for (let i: number = 0; i < arr.length; i += 4) {
		newPxArray[arr[i] + 3] = 0; 
	}
	return new ImageData(newPxArray, editor.canvas.width, editor.canvas.height);
}

export function makeSelectionBeWhite(editor: Editor, arr: Array<number>): ImageData {
	let newPxArray: Uint8ClampedArray = editor.canvas.data.slice();
	for (let i: number = 0; i < arr.length; i ++) {
		newPxArray[arr[i]] = 255; 
	}
	return new ImageData(newPxArray, editor.canvas.width, editor.canvas.height);
}

//перекрасить в белый цвет все, кроме выделенной области
export function whitenAllExceptSelection(editor: Editor, arr: Array<number>): ImageData {
	let pxArray: Uint8ClampedArray = editor.canvas.data.slice();
	let pixelArrayLength: number = editor.selectedObject?.w! * editor.selectedObject?.h! * 4;
	let bufferArray = new Uint8Array(pixelArrayLength);
    for (let i: number = 0; i < arr.length; i ++) {
		bufferArray[i] = pxArray[arr[i]];
	}
	let blankImgData: ImageData = cleanCanvas();
	pxArray = blankImgData.data;
	for (let i: number = 0; i < arr.length; i++) {
		pxArray[arr[i]] = bufferArray[i]
	}
	return new ImageData(pxArray, editor.canvas.width, editor.canvas.height);
}

//вырезать выделенную область
export function cut(editor: Editor, payload: Object): Editor {
	return {
		...editor,
		canvas: makeSelectionBeTransparent(editor, getIndexes(editor)),
	}
}

export function whitenArea(editor: Editor, payload: Object): Editor {
	return {
		...editor,
		canvas: makeSelectionBeWhite(editor, getIndexes(editor)),
	}
}

//обрезать изображение по выделенной области
export function crop(editor: Editor, payload: Object): Editor {
	return {
		...editor,
		canvas: whitenAllExceptSelection(editor, getIndexes(editor)),
		selectedObject: null,
	}
}

export function turnImgDataToGrey(editor: Editor): ImageData {
	let newPxArray: Uint8ClampedArray = editor.canvas.data.slice();
	for (let i = 0; i < newPxArray.length; i += 4) {
		const average = (newPxArray[i] + newPxArray[i + 1] + newPxArray[i + 2]) / 3
		newPxArray[i] = average
		newPxArray[i + 1] = average
		newPxArray[i + 2] = average
	}
	return new ImageData(newPxArray, editor.canvas.width, editor.canvas.height);
}

function filter(editor: Editor, filterColor: string): ImageData {
	let newPxArray: Uint8ClampedArray = editor.canvas.data.slice();
	if (filterColor === "grey") {
		for (let i = 0; i < newPxArray.length; i += 4) {
			const average = (newPxArray[i] + newPxArray[i + 1] + newPxArray[i + 2]) / 3
			newPxArray[i] = average
			newPxArray[i + 1] = average
			newPxArray[i + 2] = average
		}
	} else {
		for (let i = 0; i < newPxArray.length; i += 4) {
			newPxArray[i] = filterColor === "red" ? newPxArray[i] : 0;
			newPxArray[i + 1] = filterColor === "green" ? newPxArray[i + 1] : 0;
			newPxArray[i + 2] = filterColor === "blue" ? newPxArray[i + 2] : 0;
			
			
			// newPxArray[i + 1] = 0;
			// newPxArray[i + 2] = 0;
		}
	}
	return new ImageData(newPxArray, editor.canvas.width, editor.canvas.height);
}

//применить серый фильтр
export function applyGreyFilter(editor: Editor, payload: Object): Editor {
	return {
		...editor,
		canvas: turnImgDataToGrey(editor),
	}	
}	

export function applyFilter(editor: Editor, payload: {filterColor: string}): Editor {
	return {
		...editor,
		canvas: filter(editor, payload.filterColor),
	}	
}


export function addFigure(editor: Editor, figureType: Figure): Editor {
	const defaultShapeObj: ShapeObject = {
		position: {x: editor.canvas.width / 2 - 50, y: editor.canvas.height / 2 - 50}, 
		w: 100,
		h: 100,
		type: figureType,
		backgroudColor: '#E382B6',
		borderColor: '#9635B1',
	}
	
	return {
		...editor,
		selectedObject: defaultShapeObj,
	}
}

export function setFigureBackgroundColor(editor: Editor, newColor: string): Editor | undefined {
	if (isShapeObject(editor.selectedObject)) {
		return {
			...editor,
			selectedObject: {
				...editor.selectedObject,
				backgroudColor: newColor,	
			}
		}
	} else {
		return editor;
	}
}

export function setFigureBorderColor(editor: Editor, newColor: string): Editor {
	if (isShapeObject(editor.selectedObject)) {
		return {
			...editor,
			selectedObject: {
				...editor.selectedObject,
				borderColor: newColor,	
			}
		}
	} else {
		return editor;
	}
}

export function resizeFigure (editor: Editor, newPosition: Point, newWidth: number, newHeight: number): Editor {
	if (isShapeObject(editor.selectedObject)) {
		return {
			...editor,
			selectedObject: {
				...editor.selectedObject,
				position: newPosition,	
				w: newWidth,
				h: newHeight,
			}
		}
	} else {
		return editor
	}
}

// export function saveImage(editor: Editor): void {

// }