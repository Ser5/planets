import {canvasesBlock}     from 'init';

import view                from 'view';
import input               from 'input';

import objectsTree         from 'objects-tree';
import SpaceObject         from 'space-object';
import SpaceObjectsManager from 'space-objects-manager';

import System              from 'system';
import positionSystem      from 'system/position-system';
import stillSystem         from 'system/move/still-system';
import orbitSystem         from 'system/move/orbit-system';
import sphereSystem        from 'system/exterior/sphere-system';
import discSystem          from 'system/exterior/disc-system';

import draw3DSystem        from 'system/draw/draw-3d-system';
import drawSystem          from 'system/draw/draw-system';



let commonComponentParams = {
	position: {},
	draw2d:   {},
	draw3d:   {},
	draw:     {},
};



let sun = SpaceObjectsManager.create({
	components: {
		still:  {},
		sphere: {size: 100, color: 'yellow', emissive: 'yellow'},
		focus:  {},
		...commonComponentParams
	},
});
SpaceObjectsManager.create({
	parent:     sun,
	components: {
		orbit:  {distance: 30, speed: 2},
		sphere: {size: 8, color: 'white'},
		focus:  {},
		...commonComponentParams
	},
});
SpaceObjectsManager.create({
	parent:     sun,
	components: {
		orbit:  {distance: 70, speed: 1.5},
		sphere: {size: 20, color: 'orange'},
		focus:  {},
		...commonComponentParams
	},
});

let earth = SpaceObjectsManager.create({
	parent:     sun,
	components: {
		orbit:    {distance: 140, speed: 1.2},
		sphere:   {size: 25, color: 'green'},
		focus:  {},
		...commonComponentParams
	},
});
SpaceObjectsManager.create({
	parent:     earth,
	components: {
		orbit:    {distance: 12, speed: 1},
		sphere:   {size: 5, color: 'white'},
		focus:  {},
		...commonComponentParams
	},
});

let mars = SpaceObjectsManager.create({
	parent:     sun,
	components: {
		orbit:    {distance: 220, speed: 1},
		sphere:   {size: 17, color: 'red'},
		focus:  {},
		...commonComponentParams
	},
});
SpaceObjectsManager.create({
	parent:     mars,
	components: {
		orbit:    {distance: 9, speed: 0.8},
		sphere:   {size: 5, color: 'white'},
		focus:  {},
		...commonComponentParams
	},
});
SpaceObjectsManager.create({
	parent:     mars,
	components: {
		orbit:    {distance: 18, speed: 0.6},
		sphere:   {size: 5, color: 'white'},
		focus:  {},
		...commonComponentParams
	},
});

for (let a = 0; a < 300; a++) {
	SpaceObjectsManager.create({
		parent:     sun,
		components: {
			orbit: {
				distance: 280 + Math.floor(Math.random() * 151),
				speed:    0.3,
			},
			sphere: {
				size:  2 + Math.floor(Math.random() * 3),
				color: 'gray',
			},
			focus:  {},
			...commonComponentParams
		},
	});
}

let jupiter = SpaceObjectsManager.create({
	parent:     sun,
	components: {
		orbit:    {distance: 550, speed: 1},
		sphere:   {size: 50, color: 'khaki'},
		focus:  {},
		...commonComponentParams
	},
});

for (let a = 0; a < 4; a++) {
	SpaceObjectsManager.create({
		parent:     jupiter,
		components: {
			orbit:    {distance: 20 + a*10, speed: 1 - a/10},
			sphere:   {size: 5, color: 'white'},
			focus:  {},
			...commonComponentParams
		},
	});
}

let saturn = SpaceObjectsManager.create({
	parent:     sun,
	components: {
		orbit:  {distance: 700, speed: 0.9},
		sphere: {size: 30, color: 'khaki'},
		focus:  {},
		...commonComponentParams
	},
});
SpaceObjectsManager.create({
	parent:     saturn,
	components: {
		still:    {},
		disc:     {distance: 5, size: 6, color: '#f0e68c88'},
		...commonComponentParams
	},
});
SpaceObjectsManager.create({
	parent:     saturn,
	components: {
		still:    {},
		disc:     {distance: 12, size: 4, color: '#f0e68c88'},
		...commonComponentParams
	},
});

let uranus = SpaceObjectsManager.create({
	parent:     sun,
	components: {
		orbit:    {distance: 850, speed: 0.8},
		sphere:   {size: 28, color: 'lightblue'},
		focus:  {},
		...commonComponentParams
	},
});
SpaceObjectsManager.create({
	parent:     uranus,
	components: {
		still:    {},
		disc:     {distance: 7, size: 5, color: '#add8e688'},
		...commonComponentParams
	},
});

SpaceObjectsManager.create({
	parent:     sun,
	components: {
		orbit:    {distance: 950, speed: 0.7},
		sphere:   {size: 26, color: 'lightblue'},
		focus:  {},
		...commonComponentParams
	},
});

let pluto = SpaceObjectsManager.create({
	parent:     sun,
	components: {
		orbit:    {distance: 1000, speed: 0.5},
		sphere:   {size: 5, color: 'gray'},
		focus:  {},
		...commonComponentParams
	},
});
SpaceObjectsManager.create({
	parent:     pluto,
	components: {
		orbit:    {distance: 5, speed: 0.2},
		sphere:   {size: 3, color: 'gray'},
		focus:  {},
		...commonComponentParams
	},
});



objectsTree.root = sun;
view.spaceObject = sun;

if (window.location.search.match('d=3')) {
	drawSystem.set3D();
} else {
	drawSystem.set2D();
}




function resizeView () {
	//console.log(`${window.innerWidth}x${window.innerHeight} vs ${html.clientWidth}x${html.clientHeight}`);
	//canvases.style.height = `${window.innerHeight - 5}px`;
	let viewWidth  = window.innerWidth;
	let viewHeight = window.innerHeight - 5;
	drawSystem.onViewResize(viewWidth, viewHeight);
}
resizeView();



function animationFrame () {
	orbitSystem.move();
	stillSystem.move();
	view.continueMoving();
	drawSystem.draw();
	window.requestAnimationFrame(animationFrame);
}



window.onresize = resizeView;
animationFrame();



canvasesBlock.onmousedown  = e=>input.notify('mousedown',  {e});
canvasesBlock.onmouseup    = e=>input.notify('mouseup',    {e});
canvasesBlock.onmousemove  = e=>input.notify('mousemove',  {e});
canvasesBlock.onmouseleave = e=>input.notify('mouseleave', {e});
canvasesBlock.onmouseenter = e=>input.notify('mouseenter', {e});
window.onwheel             = e=>input.notify('wheel',      {e});
