import {canvas, ctx, rootObject, processSpaceObjects} from './init.js';
import view        from './view.js';
import input       from './input.js';
import SpaceObject from './SpaceObject.js';
import PlanetDisc  from './PlanetDisc.js';



let sun = new SpaceObject({
	x:     0,
	y:     0,
	size:  100,
	color: 'yellow',
});
sun.addChild(new SpaceObject({
	size:     8,
	color:    'white',
	distance: 30,
	speed:    2,
}));
sun.addChild(new SpaceObject({
	size:     20,
	color:    'orange',
	distance: 70,
	speed:    1.5,
}));

let earth = new SpaceObject({
	size:     25,
	color:    'green',
	distance: 140,
	speed:    1.2,
});
sun.addChild(earth);

earth.addChild(new SpaceObject({
	size:     5,
	color:    'white',
	distance: 12,
	speed:    1,
}));

let mars = new SpaceObject({
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
}

let saturn = new SpaceObject({
	size:     30,
	color:    'khaki',
	distance: 700,
	speed:    0.9,
});
sun.addChild(saturn);

saturn.addChild(new PlanetDisc({
	distance: 5,
	size:     6,
	color:    '#f0e68c88',
}));
saturn.addChild(new PlanetDisc({
	distance: 12,
	size:     4,
	color:    '#f0e68c88',
}));

let uranus = new SpaceObject({
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
}));



rootObject.set(sun);
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
	processSpaceObjects(sun, so=>so.move());
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	processSpaceObjects(sun, so=>so.draw());
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
