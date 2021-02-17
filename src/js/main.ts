import {ecs}                     from 'ecs/import';
import {SpaceObjectsInitializer} from 'init/space-objects-initializer';
import {ComponentsRegistrator}   from 'init/components-registrator';

import {view, moveSystem, drawSystem, engine} from 'dic';



let cRegistrator = new ComponentsRegistrator({componentsManager: ecs.componentsManager});
cRegistrator.register();



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
