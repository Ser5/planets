export let html             = document.querySelector('html');
export let canvas           = document.querySelector('canvas');
export let ctx              = canvas.getContext('2d');
export let pi2              = Math.PI * 2;
export let spaceObjectsList = [];

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
