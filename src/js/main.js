import {canvas, ctx} from 'init';

import view          from 'view';
import input         from 'input';

import objectsTree         from 'objects-tree';
import SpaceObject         from 'space-object';
import SpaceObjectsManager from 'space-objects-manager';

import System         from 'system';
import positionSystem from 'system/position-system';
import orbitSystem    from 'system/move/orbit-system';
import sphereSystem   from 'system/exterior/sphere-system';
//import drawSystem     from 'system/draw-system';



let sun = SpaceObjectsManager.create({
	components: {
		position: {x: 0, y: 0},
		sphere:   {size: 100, color: 'yellow'},
	},
});
/*sun.addChild(new SpaceObject({
	components: spaceObject => ({
		position: positionSystem.getComponent({spaceObject}),
		orbit:    orbitSystem.getComponent(   {distance: 30, speed: 2}),
		sphere:   sphereSystem.getComponent(  {size: 8, color: 'white'}),
	}),
}));
sun.addChild(new SpaceObject({
	components: spaceObject => ({
		position: positionSystem.getComponent({spaceObject}),
		orbit:    orbitSystem.getComponent(   {distance: 70, speed: 1.5}),
		sphere:   sphereSystem.getComponent(  {size: 20, color: 'orange'}),
	}),
}));

let earth = new SpaceObject({
	components: spaceObject => ({
		position: positionSystem.getComponent({spaceObject}),
		orbit:    orbitSystem.getComponent(   {distance: 140, speed: 1.2}),
		sphere:   sphereSystem.getComponent(  {size: 25, color: 'green'}),
	}),
});
sun.addChild(earth);

earth.addChild(new SpaceObject({
	components: spaceObject => ({
		position: positionSystem.getComponent({spaceObject}),
		orbit:    orbitSystem.getComponent(   {distance: 12, speed: 1}),
		sphere:   sphereSystem.getComponent(  {size: 5, color: 'white'}),
	}),
}));*/

/*let mars = new SpaceObject({
	size:     17,
	color:    'red',
	distance: 190,
	speed:    1,
});
sun.addChild(mars);

mars.addChild(new SpaceObject({
	size:     5,
	color:    'white',
	distance: 9,
	speed:    0.8,
}));
mars.addChild(new SpaceObject({
	size:     5,
	color:    'white',
	distance: 18,
	speed:    0.6,
}));

for (let a = 0; a < 300; a++) {
	sun.addChild(new SpaceObject({
		size:     2 + Math.floor(Math.random() * 3),
		color:    'gray',
		distance: 280 + Math.floor(Math.random() * 151),
		speed:    0.3,
	}));
}

let jupiter = new SpaceObject({
	size:     50,
	color:    'khaki',
	distance: 550,
	speed:    1,
});
sun.addChild(jupiter);

for (let a = 0; a < 4; a++) {
	jupiter.addChild(new SpaceObject({
		size:     5,
		color:    'white',
		distance: 20 + a*10,
		speed:    1  - a/10,
	}));
}*/

/*let saturn = new SpaceObject({
	components: {
		'orbit':  new OrbitComponent({distance: 700, speed: 0.9}),
		'sphere': new SphereComponent({size: 30, color: 'khaki'}),
	},
});
sun.addChild(saturn);

saturn.addChild(new SpaceObject({
	components: {
		'around': new AroundComponent({distance: 5}),
		'disc':   new SphereComponent({size: 6, color: '#f0e68c88'}),
	},
}));
saturn.addChild(new SpaceObject({
	components: {
		'around': new AroundComponent({distance: 12}),
		'disc':   new SphereComponent({size: 4, color: '#f0e68c88'}),
	},
}));*/

/*let uranus = new SpaceObject({
	size:     28,
	color:    'lightblue',
	distance: 850,
	speed:    0.8,
})
sun.addChild(uranus);

uranus.addChild(new PlanetDisc({
	distance: 7,
	size:     5,
	color:    '#add8e688',
}));

sun.addChild(new SpaceObject({
	size:     26,
	color:    'lightblue',
	distance: 950,
	speed:    0.7,
}));

let pluto = new SpaceObject({
	size:     5,
	color:    'gray',
	distance: 1000,
	speed:    0.5,
});
sun.addChild(pluto);

pluto.addChild(new SpaceObject({
	size:     3,
	color:    'gray',
	distance: 5,
	speed:    0.2,
}));*/



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
	orbitSystem.move();
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	sphereSystem.draw();
	view.continueMoving();
	window.requestAnimationFrame(animationFrame);
}

animationFrame();



window.onresize = resizeView;



canvas.onmousedown  = e=>input.notify('mousedown',  {e});
canvas.onmouseup    = e=>input.notify('mouseup',    {e});
canvas.onmousemove  = e=>input.notify('mousemove',  {e});
canvas.onmouseleave = e=>input.notify('mouseleave', {e});
canvas.onmouseenter = e=>input.notify('mouseenter', {e});
window.onwheel      = e=>input.notify('wheel',      {e});
