import {Entity}  from 'ecs/import';

import {IComponentInit}     from 'ecs/import';
import {IPositionComponent} from './i/iposition-component';



export class DrawInit implements IComponentInit {
	get componentName () { return 'draw' };



	initComponent (
		{entity}:
		{entity: Entity}
	): IPositionComponent {
		return {entity, x: 0, y: 0};
	};
}
