import {FilterType, Point, EditorObject, SelectedArea, TextObject, ShapeObject, Editor} from './model';
const defaultCanvasWidth = 800;
const defaultCanvasHeight = 600;
//const defaultPxArrLength = 1920000;

export function cleanCanvas(width: number = defaultCanvasWidth, height: number = defaultCanvasHeight): ImageData {
	let pixelArrayLength: number = width * height * 4;
	let bufferArray = new Uint8Array(pixelArrayLength);
	//crypto.getRandomValues(buffer);
	for (let i: number = 0; i < pixelArrayLength; i += 4) {
		bufferArray[i] = 255; 
		bufferArray[i + 1] = 122;
		bufferArray[i + 2] = 255;
		bufferArray[i + 3] = 70;
	}
	return new ImageData(new Uint8ClampedArray(bufferArray.buffer), width, height);
}

export function createCanvas(editor: Editor, payload: Object): Editor {
	return {
		...editor,
		canvas: cleanCanvas(),
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
	console.log('new image', payload.newImage);
	return {
		...editor,
		canvas: payload.newImage,
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
			position: {
				x: Math.min(payload.startPoint.x, payload.endPoint.x),
				y: Math.min(payload.startPoint.y, payload.endPoint.y)
			},
			w: Math.abs(payload.startPoint.x - payload.endPoint.x), 
			h: Math.abs(payload.startPoint.y - payload.endPoint.y),
		} 
	}
}
//снять выделение
export function deSelectArea(editor: Editor): Editor {
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
export function dropSelection(editor: Editor, where: Point): Editor {
	if (isSelectedArea(editor.selectedObject)) {
		return {
			...editor,
			selectedObject: {
				...editor.selectedObject,
				position: where,
			}
		}
	} else {
		return editor
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

//получить выделенную область канваса в виде ImageData
export function getSelectedAreaData(editor: Editor): ImageData | undefined  {
	console.log('in getSelectedAreaData function');
	console.log('editor.selectedObject !== null', editor.selectedObject !== null);
	if (editor.selectedObject !== null) {
	
		let editorCopy = JSON.parse(JSON.stringify(editor));
		let startX: number = editorCopy.selectedObject.position.x;
		let startY: number = editorCopy.selectedObject.position.y;
		let endY: number = startY + editorCopy.selectedObject.h;
		let selectionWidth: number = editorCopy.selectedObject.w;
		let selectionHeight: number = editorCopy.selectedObject.h;
		let newImgData: ImageData = new ImageData(selectionWidth, selectionHeight);
		let k: number = 0; 
		for (let i: number = startY; i < endY; i++) {
			let startRowIndex: number = getPxArrIndex(editor, {x: startX, y: i})
			for (let j: number = startRowIndex; j < startRowIndex + selectionWidth * 4; j++) {
				newImgData.data[k] = editorCopy.canvas.data[j];
				k++;
			}
		}
		return newImgData;
	} 
	return undefined
}

//получить массив индексов элементов в массиве Unit8ClampedArray канваса для пикселей, попавших в выделенную область
export function getIndexes(editor: Editor): Array<number> {
	console.log('executing getIndexes function');
	let arr: Array<number> = [];
	if (editor.selectedObject !== null) {
		let startX: number = editor.selectedObject!.position.x;
		let startY: number = editor.selectedObject!.position.y;
		let endY: number = startY + editor.selectedObject!.h;
		let selectionWidth: number = editor.selectedObject!.w; 
		// console.log('startX', startX);
		// console.log('startY', startY);
		// console.log('endY', endY);
		// console.log('selectionWidth', selectionWidth);

		let k: number = 0;
		for (let i: number = startY; i < endY; i++) {
			let startRowIndex: number = getPxArrIndex(editor, {x: startX, y: i});
			//console.log('start row index', startRowIndex);
			for (let j: number = startRowIndex; j < startRowIndex + selectionWidth * 4; j++) {
				arr[k] = j;
				k++;
			}
		}
	}
	//console.log('arr', arr);
	return arr;

}

//сделать прозрачной выделенную область канваса
export function makeSelectionBeTransparent(editor: Editor, arr: Array<number>): ImageData {
	console.log('executing makeSelectionBeTransparent function');
	let newPxArray: Uint8ClampedArray = editor.canvas.data.slice();
	//let newPxArray: Uint8ClampedArray = editor.canvas.data;
	// console.log('slice done');
	// console.log('arr.length', arr.length);
	for (let i: number = 0; i < arr.length; i += 4) {
		newPxArray[arr[i] + 3] = 0; 
	}
	return new ImageData(newPxArray, editor.canvas.width, editor.canvas.height);
}

//перекрасить в белый цвет все, кроме выделенной области
export function whitenAllExceptSelection(editor: Editor, arr: Array<number>): ImageData {
	
	let newPxArray: Uint8ClampedArray = editor.canvas.data.slice();
	for (let i: number = 0; i < newPxArray.length; i += 4) {
		if (arr.indexOf(i) !== -1)
			continue;					
		newPxArray[i] = 255; 
		newPxArray[i + 1] = 255; 
		newPxArray[i + 2] = 255; 
		newPxArray[i + 3] = 1; 
	}
	return new ImageData(newPxArray, editor.canvas.width, editor.canvas.height);
}

//вырезать выделенную область
export function cut(editor: Editor, payload: Object): Editor {
	console.log('executing cut function');
	//let editorCopy = {...editor};
	return {
		...editor,
		//canvas: makeSelectionBeTransparent(editorCopy, getIndexes(editorCopy)),
		canvas: makeSelectionBeTransparent(editor, getIndexes(editor)),
		selectedObject: null,
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
	console.log("filterColor", filterColor)
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


export function addFigure(editor: Editor, newFigure: ShapeObject): Editor {
	return {
		...editor,
		selectedObject: newFigure,
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