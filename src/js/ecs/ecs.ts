import {ComponentsManager} from './components-manager';
import {EntitiesManager}   from './entities-manager';
import {EntitiesTree}      from './entities-tree';



export let ecs: {
	componentsManager?: ComponentsManager,
	entitiesManager?:   EntitiesManager,
	entitiesTree?:      EntitiesTree,
} = {};

ecs.componentsManager = new ComponentsManager();
ecs.entitiesManager   = new EntitiesManager({componentsManager: ecs.componentsManager});
ecs.entitiesTree      = new EntitiesTree();
