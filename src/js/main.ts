import {ecs}                     from 'ecs/import';
import {IPositionComponent}      from 'component/import';
import {ComponentsInitializer}   from 'init/components-initializer';
import {SpaceObjectsInitializer} from 'init/space-objects-initializer';

import {threed, view, moveSystem, drawSystem, engine} from 'dic';



let compsInitializer = new ComponentsInitializer({componentsManager: ecs.componentsManager, scene: threed.scene});
compsInitializer.init();

let soInitializer     = new SpaceObjectsInitializer({entitiesManager: ecs.entitiesManager});
let sun               = soInitializer.init();
ecs.entitiesTree.root = sun;
view.spaceObject      = sun;



if (window.location.search.match('d=3')) {
	engine.setStrategy('canvas3d');
} else {
	engine.setStrategy('canvas2d');
}



function animationFrame () {
	moveSystem.run();
	//stillSystem.run();
	view.continueMoving();
	drawSystem.run();
	window.requestAnimationFrame(animationFrame);
}

animationFrame();
