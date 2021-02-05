import SpaceObject from 'space-object';



export let html:             HTMLElement              = document.querySelector('html');
export let canvasesBlock:    HTMLElement              = document.querySelector('.canvases-block');
export let canvas2d:         HTMLCanvasElement        = document.querySelector('.canvas2d');
export let canvas3d:         HTMLCanvasElement        = document.querySelector('.canvas3d');
export let canvasesList:     HTMLCanvasElement[]      = [canvas2d, canvas3d];
export let ctx:              CanvasRenderingContext2D = canvas2d.getContext('2d');
export let pi2:              number                   = Math.PI * 2;
export let angle270:         number                   = Math.PI * 1.5;
export let spaceObjectsList: SpaceObject[]            = [];



export function dtr (d: number): number {
	return d * (pi2 / 360);
}
export function rtd (r: number): number {
	return r / pi2 * 360;
}

export function getDistance (x1: number, y1: number, x2: number, y2: number): number {
	let xDistance = x1 - x2;
	let yDistance = y1 - y2;
	let d         = Math.sqrt(xDistance**2 + yDistance**2);
	return d;
}
