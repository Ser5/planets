import {canvas, ctx, rtd}  from 'init';

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



let sun = SpaceObjectsManager.create({
	components: {
		position: {},
		still:    {},
		sphere:   {size: 100, color: 'yellow'},
	},
});
SpaceObjectsManager.create({
	parent:     sun,
	components: {
		position: {},
		orbit:    {distance: 30, speed: 2},
		sphere:   {size: 8, color: 'white'},
	},
});
SpaceObjectsManager.create({
	parent:     sun,
	components: {
		position: {},
		orbit:    {distance: 70, speed: 1.5},
		sphere:   {size: 20, color: 'orange'},
	},
});

let earth = SpaceObjectsManager.create({
	parent:     sun,
	components: {
		position: {},
		orbit:    {distance: 140, speed: 1.2},
		sphere:   {size: 25, color: 'green'},
	},
});
SpaceObjectsManager.create({
	parent:     earth,
	components: {
		position: {},
		orbit:    {distance: 12, speed: 1},
		sphere:   {size: 5, color: 'white'},
	},
});

let mars = SpaceObjectsManager.create({
	parent:     sun,
	components: {
		position: {},
		orbit:    {distance: 190, speed: 1},
		sphere:   {size: 17, color: 'red'},
	},
});
SpaceObjectsManager.create({
	parent:     mars,
	components: {
		position: {},
		orbit:    {distance: 9, speed: 0.8},
		sphere:   {size: 5, color: 'white'},
	},
});
SpaceObjectsManager.create({
	parent:     mars,
	components: {
		position: {},
		orbit:    {distance: 18, speed: 0.6},
		sphere:   {size: 5, color: 'white'},
	},
});

for (let a = 0; a < 300; a++) {
	SpaceObjectsManager.create({
		parent:     sun,
		components: {
			position: {},
			orbit: {
				distance: 280 + Math.floor(Math.random() * 151),
				speed:    0.3,
			},
			sphere: {
				size:  2 + Math.floor(Math.random() * 3),
				color: 'gray',
			},
		},
	});
}

let jupiter = SpaceObjectsManager.create({
	parent:     sun,
	components: {
		position: {},
		orbit:    {distance: 550, speed: 1},
		sphere:   {size: 50, color: 'khaki'},
	},
});

for (let a = 0; a < 4; a++) {
	SpaceObjectsManager.create({
		parent:     jupiter,
		components: {
			position: {},
			orbit:    {distance: 20 + a*10, speed: 1 - a/10},
			sphere:   {size: 5, color: 'white'},
		},
	});
}

let saturn = SpaceObjectsManager.create({
	parent:     sun,
	components: {
		position: {},
		orbit:    {distance: 700, speed: 0.9},
		sphere:   {size: 30, color: 'khaki'},
	},
});
SpaceObjectsManager.create({
	parent:     saturn,
	components: {
		position: {},
		still:    {},
		disc:     {distance: 5, size: 6, color: '#f0e68c88'},
	},
});
SpaceObjectsManager.create({
	parent:     saturn,
	components: {
		position: {},
		still:    {},
		disc:     {distance: 12, size: 4, color: '#f0e68c88'},
	},
});


let uranus = SpaceObjectsManager.create({
	parent:     sun,
	components: {
		position: {},
		orbit:    {distance: 850, speed: 0.8},
		sphere:   {size: 28, color: 'lightblue'},
	},
});
SpaceObjectsManager.create({
	parent:     uranus,
	components: {
		position: {},
		still:    {},
		disc:     {distance: 7, size: 5, color: '#add8e688'},
	},
});

SpaceObjectsManager.create({
	parent:     sun,
	components: {
		position: {},
		orbit:    {distance: 950, speed: 0.7},
		sphere:   {size: 26, color: 'lightblue'},
	},
});

let pluto = SpaceObjectsManager.create({
	parent:     sun,
	components: {
		position: {},
		orbit:    {distance: 1000, speed: 0.5},
		sphere:   {size: 5, color: 'gray'},
	},
});
SpaceObjectsManager.create({
	parent:     pluto,
	components: {
		position: {},
		orbit:    {distance: 5, speed: 0.2},
		sphere:   {size: 3, color: 'gray'},
	},
});



objectsTree.root = sun;
view.spaceObject = sun;
/*view.zoomIn();
view.zoomIn();
view.zoomIn();
view.zoomIn();
view.zoomIn();*/



function resizeView () {
	//console.log(`${window.innerWidth}x${window.innerHeight} vs ${html.clientWidth}x${html.clientHeight}`);
	canvas.width  = window.innerWidth;
	canvas.height = window.innerHeight - 5;
	view.centerX  = Math.round(canvas.width  / 2);
	view.centerY  = Math.round(canvas.height / 2);
}
resizeView();



function animationFrame () {
	stillSystem.move();
	orbitSystem.move();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	sphereSystem.draw();
	discSystem.draw();
	view.continueMoving();
	window.requestAnimationFrame(animationFrame);
}

animationFrame();

/*sphereSystem.draw();
setInterval(function () {
	orbitSystem.move();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	sphereSystem.draw();
	let text = '';
	objectsTree.process('orbit', so => text += `${rtd(so.orbit.angle)}, `);
	console.log(text);
	//objectsTree.process('orbit', so => console.log(rtd(so.orbit.angle)));
}, 1000);*/


window.onresize = resizeView;



canvas.onmousedown  = e=>input.notify('mousedown',  {e});
canvas.onmouseup    = e=>input.notify('mouseup',    {e});
canvas.onmousemove  = e=>input.notify('mousemove',  {e});
canvas.onmouseleave = e=>input.notify('mouseleave', {e});
canvas.onmouseenter = e=>input.notify('mouseenter', {e});
window.onwheel      = e=>input.notify('wheel',      {e});
