export default function transform(start: {x: number, y: number}, end: {x: number, y: number}, bounds: DOMRect)
{
    let startX = Math.min(start.x, end.x, bounds.width);
    let startY = Math.max(bounds.y, Math.min(bounds.y + bounds.height, end.y, start.y));
    let endX = Math.min(Math.max(end.x, start.x), bounds.width);
    let endY = Math.min(startY + Math.abs(end.y - start.y), bounds.y + bounds.height);

    return ({
        startX: startX,
        startY: startY,
        endX: endX,
        endY: endY,
        width: endX - startX,
        height: endY - startY,
    })
}