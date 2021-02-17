export let pi2:      number = Math.PI * 2;
export let angle270: number = Math.PI * 1.5;



export function getDistance (x1: number, y1: number, x2: number, y2: number): number {
	let xDistance = x1 - x2;
	let yDistance = y1 - y2;
	let d         = Math.sqrt(xDistance**2 + yDistance**2);
	return d;
}
