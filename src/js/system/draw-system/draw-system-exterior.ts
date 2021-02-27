import {IComponent, Entity} from 'ecs/import';
import {View}               from 'view';



export abstract class DrawSystemExterior {
	abstract draw (so: Entity);
}
