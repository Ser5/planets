export let html             = document.querySelector('html');
export let canvas           = document.querySelector('canvas');
export let ctx              = canvas.getContext('2d');
export let pi2              = Math.PI * 2;
export let spaceObjectsList = [];

export let rootObject = {
	get ()   { return this.value; },
	set (so) { this.value = so; },
};


export function dtr (d) {
	return d * (Math.PI / 180);
}

export function getDistance (x1, y1, x2, y2) {
	let xDistance = x1 - x2;
	let yDistance = y1 - y2;
	let d         = Math.sqrt(xDistance**2 + yDistance**2);
	return d;
}

export function processSpaceObjects (spaceObject, callback) {
	callback(spaceObject);
	if (spaceObject.children.length) {
		for (let so of spaceObject.children) {
			processSpaceObjects(so, callback);
		}
	}
}
