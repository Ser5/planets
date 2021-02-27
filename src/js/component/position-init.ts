import {Entity}  from 'ecs/import';

import {IComponentInit}     from 'ecs/import';
import {IPositionComponent} from './i/iposition-component';



export class PositionInit implements IComponentInit {
	get componentName () { return 'position' };



	initComponent (
		{entity,         x = 0,     y = 0}:
		{entity: Entity, x: number, y: number}
	): IPositionComponent {
		return {entity, x, y};
	};
}
