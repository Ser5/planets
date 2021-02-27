import {Entity}  from 'ecs/import';

import {IComponentInit} from 'ecs/import';
import {IDiscComponent} from './i/idisc-component';



export class DiscInit implements IComponentInit {
	get componentName () { return 'disc' };



	initComponent (
		{entity,         distance,         size,         color}:
		{entity: Entity, distance: number, size: number, color: string}
	): IDiscComponent {
		return {
			entity,
			distance,
			size,
			color,
		};
	}
}
